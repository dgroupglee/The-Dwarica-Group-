import { useEffect, useMemo, useRef, useState } from 'react';
import { ensureAccount, removeFavorite, saveFavorite, sendMagicLink, supabase, triggerAutoAccountProvisioning } from '../utils/supabaseClient';
import { useDualBrain } from '../portal/useDualBrain';
import { AuthContext } from './contextStore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [unlockedDossiers, setUnlockedDossiers] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [emailPrompt, setEmailPrompt] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [favoritePulseId, setFavoritePulseId] = useState(null);
  const savedItemsRef = useRef([]);
  savedItemsRef.current = savedItems;
  const dualBrain = useDualBrain(user);

  useEffect(() => {
    const readyFallback = window.setTimeout(() => setAuthReady(true), 2500);
    const sessionRequest = supabase.auth.getSession();
    const sessionTimeout = new Promise((resolve) => window.setTimeout(() => resolve({ data: { session: null } }), 2500));
    Promise.race([sessionRequest, sessionTimeout]).then(({ data }) => {
      setUser(data?.session?.user ?? null);
    }).catch(() => {
      setUser(null);
    }).finally(() => {
      window.clearTimeout(readyFallback);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => {
      window.clearTimeout(readyFallback);
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !user.is_anonymous) return undefined;
    setSavedItems(dualBrain.brain.favorites.map((item) => item.id || item.item_id).filter(Boolean));
    return undefined;
  }, [dualBrain.brain.favorites, user]);

  useEffect(() => {
    if (!user || user.is_anonymous) return undefined;
    let cancelled = false;
    const localFavorites = dualBrain.brain.favorites.map((item) => item.id || item.item_id).filter(Boolean);
    supabase.from('profiles').upsert({ id: user.id, email: user.email, full_name: user.user_metadata?.full_name || user.user_metadata?.name || null }, { onConflict: 'id' }).then(() => undefined);
    supabase.from('favorites').select('*').eq('account_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      if (!cancelled) setSavedItems(data?.length ? data.map((item) => item.item_id) : localFavorites);
    });
    const pendingFavorite = window.localStorage.getItem('dgroup_pending_favorite');
    if (pendingFavorite) {
      try {
        const item = JSON.parse(pendingFavorite);
        saveFavorite(user.id, item).then(({ error }) => {
          if (!error) {
            window.localStorage.removeItem('dgroup_pending_favorite');
            setSavedItems((current) => current.includes(item.id) ? current : [...current, item.id]);
          }
        });
      } catch { window.localStorage.removeItem('dgroup_pending_favorite'); }
    }
    const pendingInquiry = window.localStorage.getItem('pendingInquiry');
    if (pendingInquiry) {
      const inquiry = JSON.parse(pendingInquiry);
      supabase.from('inquiries').insert({ account_id: user.id, item_name: inquiry.item_name, item_category: inquiry.item_category, message: inquiry.message, status: 'received' }).then(({ error }) => { if (!error) window.localStorage.removeItem('pendingInquiry'); });
    }
    return () => { cancelled = true; };
  }, [user]);

  const updateFavoriteNote = async (favoriteId, notes) => {
    if (!user || user.is_anonymous) return { error: new Error('Authentication required') };
    dualBrain.dualWrite({ favorites: dualBrain.brain.favorites.map((item) => (item.id || item.item_id) === favoriteId ? { ...item, notes } : item) });
    const result = await supabase.from('favorites').update({ notes }).eq('id', favoriteId).eq('account_id', user.id);
    return result;
  };

  const authenticateSilently = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        setUser(sessionData.session.user);
        return sessionData.session.user;
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setUser(data?.user ?? null);
      return data?.user ?? null;
    } catch {
      setToastMessage('Private access is queued for review.');
      return null;
    }
  };

  const unlockDossier = async (assetId) => {
    if (!user || user.is_anonymous) {
      setEmailPrompt({ type: 'dossier_unlock', assetId });
      return { ok: false, requiresEmail: true };
    }
    const nextUser = await authenticateSilently();
    if (!nextUser) return { ok: false };
    setUnlockedDossiers((current) => (current.includes(assetId) ? current : [...current, assetId]));
    setLastAction({ type: 'dossier_unlock', assetId, at: new Date().toISOString() });
    setToastMessage('Your private DGroup access has been activated.');
    return { ok: true, user: nextUser, assetId };
  };

  const toggleFavorite = async (assetOrId) => {
    const item = typeof assetOrId === 'string' ? { id: assetOrId } : assetOrId;
    const assetId = item.id;
    const saved = !savedItemsRef.current.includes(assetId);
    const previousItems = savedItemsRef.current;
    const nextItems = saved ? [...previousItems.filter((id) => id !== assetId), assetId] : previousItems.filter((id) => id !== assetId);
    savedItemsRef.current = nextItems;
    setSavedItems(nextItems);
    dualBrain.dualWrite({ favorites: saved ? [...dualBrain.brain.favorites, item] : dualBrain.brain.favorites.filter((favorite) => (favorite.id || favorite.item_id) !== assetId) });
    setFavoritePulseId(assetId);
    window.setTimeout(() => setFavoritePulseId(null), 200);
    if (!user || user.is_anonymous) {
      if (saved) {
        window.localStorage.setItem('dgroup_pending_favorite', JSON.stringify(item));
        setEmailPrompt({ type: 'favorite_added', item });
        return { ok: false, saved, requiresEmail: true };
      }
      const pendingFavorite = window.localStorage.getItem('dgroup_pending_favorite');
      if (pendingFavorite) {
        try {
          if (JSON.parse(pendingFavorite)?.id === assetId) window.localStorage.removeItem('dgroup_pending_favorite');
        } catch {
          window.localStorage.removeItem('dgroup_pending_favorite');
        }
      }
      setEmailPrompt(null);
      setToastMessage('Removed from your private vault.');
      return { ok: true, saved: false };
    }
    const nextUser = await authenticateSilently();
    if (!nextUser) return { ok: false, saved: false };
    setLastAction({ type: saved ? 'favorite_added' : 'favorite_removed', assetId, at: new Date().toISOString() });
    setToastMessage(saved ? 'Added to your private vault.' : 'Removed from your private vault.');
    if (!nextUser.is_anonymous) {
      const result = saved ? await saveFavorite(nextUser.id, item) : await removeFavorite(nextUser.id, assetId);
      if (result?.error) {
        savedItemsRef.current = previousItems;
        setSavedItems(previousItems);
        setToastMessage('Your private vault is temporarily unavailable.');
        return { ok: false, saved: !saved, error: result.error };
      }
    }
    return { ok: true, saved, user: nextUser, assetId };
  };

  const submitEmailAccess = async (email) => {
    const prompt = emailPrompt;
    if (!prompt) return { ok: false };
    const { error: magicLinkError } = await sendMagicLink(email);
    if (magicLinkError) return { ok: false, message: magicLinkError.message };
    const anonymousUser = user?.is_anonymous ? user : null;
    const accountId = anonymousUser?.id || null;
    const { error: accountError } = await ensureAccount(email, accountId);
    if (accountError) return { ok: false, message: accountError.message };
    if (prompt.type === 'favorite_added' && prompt.item && accountId) {
      const { error } = await saveFavorite(accountId, prompt.item);
      if (error) return { ok: false, message: error.message };
      setSavedItems((current) => current.includes(prompt.item.id) ? current : [...current, prompt.item.id]);
    }
    if (prompt.type === 'dossier_unlock' && accountId) {
      setUnlockedDossiers((current) => current.includes(prompt.assetId) ? current : [...current, prompt.assetId]);
    }
    setEmailPrompt(null);
    setToastMessage(prompt.type === 'favorite_added' ? 'Saved. Check your email to access your private DGroup account.' : 'Your private DGroup access has been created — check your email.');
    return { ok: true };
  };

  const requestAccess = async (actionType, metadata = {}) => {
    const email = metadata.email || metadata.directContact;
    if (email) {
      const { error: magicLinkError } = await sendMagicLink(email);
      if (magicLinkError) return { ok: false, message: magicLinkError.message };
      const sessionUser = user?.is_anonymous ? null : user;
      const { error: accountError } = await ensureAccount(email, sessionUser?.id || null);
      if (accountError) return { ok: false, message: accountError.message };
      setToastMessage(actionType === 'favorite_added' ? 'Saved. Check your email to access your private DGroup account.' : 'Inquiry received. Your private DGroup access has been created — check your email.');
      setLastAction({ type: actionType, metadata, at: new Date().toISOString() });
      return { ok: true, actionType, metadata, message: 'Inquiry received. Your private DGroup access has been created — check your email.' };
    }
    const nextUser = await authenticateSilently();
    if (!nextUser) return { ok: false, message: 'Private access is queued for review.' };
    const result = await triggerAutoAccountProvisioning(actionType, metadata);
    setLastAction({ type: actionType, metadata, at: new Date().toISOString() });
    setToastMessage('Your private DGroup access has been activated.');
    return { ...result, ok: result?.ok ?? true, user: nextUser, actionType, metadata, message: 'Your private DGroup access has been activated.' };
  };

  const value = useMemo(
    () => ({
      user,
      savedItems,
      unlockedDossiers,
      toastMessage,
      lastAction,
      isAuthenticated: Boolean(user),
      notice: toastMessage,
      setNotice: setToastMessage,
      setToastMessage,
      emailPrompt,
      favoritePulseId,
      setEmailPrompt,
      submitEmailAccess,
      authReady,
      updateFavoriteNote,
      signOut: () => supabase.auth.signOut(),
      requestAccess,
      unlockDossier,
      toggleFavorite,
      favoriteItem: toggleFavorite,
    }),
    [user, savedItems, unlockedDossiers, toastMessage, lastAction, favoritePulseId, emailPrompt, authReady, dualBrain]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
