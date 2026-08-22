import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const VERSION = 1;
const CACHE_PREFIX = 'dgroup_dual_brain:';
const QUEUE_PREFIX = 'dgroup_dual_queue:';

const blankBrain = () => ({ version: VERSION, favorites: [], inquiries: [], consignments: [], viewed_refs: [], target_budget: 50000, brand_weights: {}, preferences: {}, updated_at: 0 });

function safeRead(key, fallback) {
  try { return JSON.parse(window.localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
}

function safeWrite(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable in private browsing. */ }
}

function uniqueById(items) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id || item.item_id || item.reference, item])).values()];
}

export function mergeBrains(localData = {}, remoteData = {}) {
  const local = { ...blankBrain(), ...localData };
  const remote = { ...blankBrain(), ...remoteData };
  const localTime = Number(local.updated_at || 0);
  const remoteTime = Number(remote.updated_at || 0);
  const newer = localTime >= remoteTime ? local : remote;
  const older = newer === local ? remote : local;
  const weights = { ...(older.brand_weights || {}), ...(newer.brand_weights || {}) };
  Object.keys(older.brand_weights || {}).forEach((brand) => { weights[brand] = Math.max(older.brand_weights[brand] || 0, newer.brand_weights?.[brand] || 0); });
  return {
    version: VERSION,
    favorites: uniqueById([...(local.favorites || []), ...(remote.favorites || [])]),
    inquiries: uniqueById([...(local.inquiries || []), ...(remote.inquiries || [])]),
    consignments: uniqueById([...(local.consignments || []), ...(remote.consignments || [])]),
    viewed_refs: [...new Set([...(local.viewed_refs || []), ...(remote.viewed_refs || [])])].slice(-200),
    target_budget: newer.target_budget || older.target_budget || 50000,
    brand_weights: weights,
    preferences: { ...(older.preferences || {}), ...(newer.preferences || {}) },
    updated_at: Math.max(localTime, remoteTime, Date.now()),
  };
}

function queueOperation(key, operation) {
  const queue = safeRead(key, []);
  safeWrite(key, [...queue, operation].slice(-40));
}

export function useDualBrain(user) {
  const identity = user?.is_anonymous ? 'guest' : user?.id || 'guest';
  const cacheKey = `${CACHE_PREFIX}${identity}`;
  const queueKey = `${QUEUE_PREFIX}${identity}`;
  const [brain, setBrain] = useState(() => safeRead(cacheKey, blankBrain()));
  const [syncState, setSyncState] = useState('local');
  const brainRef = useRef(brain);
  brainRef.current = brain;

  const persistLocal = useCallback((next) => {
    safeWrite(cacheKey, next);
    setBrain(next);
  }, [cacheKey]);

  const pushRemote = useCallback(async (next, operation = null) => {
    if (!user || user.is_anonymous) return false;
    try {
      const [vaultResult, affinityResult] = await Promise.all([
        supabase.from('vault_activity').upsert({ user_id: user.id, saved_allocations: next.favorites, inquiries: next.inquiries, consignments: next.consignments, updated_at: new Date(next.updated_at).toISOString() }, { onConflict: 'user_id' }),
        supabase.from('user_affinity').upsert({ user_id: user.id, target_budget: next.target_budget, brand_weights: next.brand_weights, telemetry_logs: [{ viewed_refs: next.viewed_refs, preferences: next.preferences, recorded_at: new Date(next.updated_at).toISOString() }], updated_at: new Date(next.updated_at).toISOString() }, { onConflict: 'user_id' }),
      ]);
      if (vaultResult.error) throw vaultResult.error;
      if (affinityResult.error) throw affinityResult.error;
      setSyncState('synced');
      return true;
    } catch {
      if (operation) queueOperation(queueKey, operation);
      setSyncState('offline');
      return false;
    }
  }, [queueKey, user]);

  const dualWrite = useCallback((patch, remotePatch = patch) => {
    const next = mergeBrains(brain, { ...patch, updated_at: Date.now() });
    persistLocal(next);
    const operation = { snapshot: { ...next, ...remotePatch }, created_at: next.updated_at };
    pushRemote(next, operation);
    return next;
  }, [brain, persistLocal, pushRemote]);

  const flushQueue = useCallback(async () => {
    if (!user || user.is_anonymous) return;
    const queued = safeRead(queueKey, []);
    if (!queued.length) return;
    const next = queued.reduce((current, operation) => mergeBrains(current, operation.snapshot || operation.patch), brainRef.current);
    const ok = await pushRemote(next);
    if (ok) safeWrite(queueKey, []);
  }, [pushRemote, queueKey, user]);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!user || user.is_anonymous) return;
      const [affinityResult, vaultResult] = await Promise.all([
        supabase.from('user_affinity').select('target_budget, brand_weights, telemetry_logs, updated_at').eq('user_id', user.id).maybeSingle(),
        supabase.from('vault_activity').select('saved_allocations, inquiries, consignments, updated_at').eq('user_id', user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      const affinity = affinityResult.data;
      const vault = vaultResult.data;
      const latestLog = affinity?.telemetry_logs?.at?.(-1) || affinity?.telemetry_logs?.[affinity.telemetry_logs.length - 1] || {};
      const remote = { target_budget: affinity?.target_budget || 50000, brand_weights: affinity?.brand_weights || {}, viewed_refs: latestLog.viewed_refs || [], preferences: latestLog.preferences || {}, favorites: vault?.saved_allocations || [], inquiries: vault?.inquiries || [], consignments: vault?.consignments || [], updated_at: Math.max(affinity?.updated_at ? new Date(affinity.updated_at).getTime() : 0, vault?.updated_at ? new Date(vault.updated_at).getTime() : 0) };
      const merged = mergeBrains(safeRead(cacheKey, blankBrain()), remote);
      persistLocal(merged);
      await pushRemote(merged);
      await flushQueue();
    };
    hydrate();
    return () => { cancelled = true; };
  }, [cacheKey, flushQueue, persistLocal, pushRemote, user]);

  useEffect(() => {
    const onOnline = () => flushQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [flushQueue]);

  return useMemo(() => ({ brain, syncState, dualWrite, flushQueue }), [brain, dualWrite, flushQueue, syncState]);
}
