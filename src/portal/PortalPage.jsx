import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';
import PrivateCommandCenter from './PrivateCommandCenter';
import FirmUpdatesModule from './FirmUpdatesModule';
import RegulatoryDisclaimer from './RegulatoryDisclaimer';

const pulseEntries = [
  'The acquisition desk continues to review proprietary operating businesses where durable cash flow and motivated ownership create an attractive basis for long-term control.',
  'Real asset underwriting remains focused on income quality, location, and the relationship between current yield and future value.',
  'Across liquid markets and private opportunities, the firm is preserving flexibility so capital can move when pricing becomes more rational.',
];

function ProtectedPortal() {
  const { user, authReady, signOut, updateFavoriteNote } = useAuth();
  const [activity, setActivity] = useState({ favorites: [], inquiries: [], consignments: [], deals: [] });
  const [firmPulse, setFirmPulse] = useState([]);
  const [discoverItems, setDiscoverItems] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [savedNote, setSavedNote] = useState(null);
  const [syncPulse, setSyncPulse] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.is_anonymous) return undefined;
    let cancelled = false;
    Promise.all([
      supabase.from('favorites').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
      supabase.from('consignment_submissions').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
      supabase.from('closed_deals').select('*').eq('account_id', user.id).order('closed_at', { ascending: false }),
      supabase.from('vault_activity').select('saved_allocations, inquiries, consignments, updated_at').eq('user_id', user.id).maybeSingle(),
      supabase.from('firm_pulse').select('*').eq('published', true).order('created_at', { ascending: false }),
    ]).then(async ([favorites, inquiries, consignments, deals, vault, pulse]) => {
      if (!cancelled) {
        const cloudVault = vault.data || {};
        setActivity({ favorites: cloudVault.saved_allocations?.length ? cloudVault.saved_allocations : (favorites.data || []), inquiries: cloudVault.inquiries?.length ? cloudVault.inquiries : (inquiries.data || []), consignments: cloudVault.consignments?.length ? cloudVault.consignments : (consignments.data || []), deals: deals.data || [] });
        setFirmPulse(pulse.data || []);
        const categories = [...new Set((favorites.data || []).map((item) => item.item_category).filter(Boolean))];
        if (categories.length) {
          const { data: listings } = await supabase.from('listings').select('*').in('category', categories).gt('created_at', user.last_sign_in_at || '1970-01-01').limit(8);
          if (!cancelled) setDiscoverItems(listings || []);
        }
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!user || user.is_anonymous) return undefined;
    const channel = supabase.channel(`portal-telemetry-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites', filter: `account_id=eq.${user.id}` }, () => {
        setSyncPulse(true);
        window.setTimeout(() => setSyncPulse(false), 1800);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleNoteBlur = async (favoriteId, value) => {
    const result = await updateFavoriteNote(favoriteId, value);
    if (!result.error) {
      setSavedNote(favoriteId);
      window.setTimeout(() => setSavedNote(null), 1500);
    }
    setEditingNote(null);
  };

  if (!authReady) return <div className="portal-loading">Opening private portal...</div>;
  if (!user || user.is_anonymous) return <section className="portal-page"><PrivateCommandCenter user={null} activity={{ favorites: [], inquiries: [], consignments: [], deals: [] }} loading={false} signOut={() => undefined} memberSince={null} syncPulse={false} /><FirmUpdatesModule /><RegulatoryDisclaimer /></section>;
  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const savedCategories = [...new Set(activity.favorites.map((item) => item.item_category).filter(Boolean))];
  const curationLabel = savedCategories.length ? `${savedCategories.join(' + ')} desk loop` : 'Principal-led curation loop';

  return <section className="portal-page"><PrivateCommandCenter user={user} activity={activity} loading={loading} signOut={signOut} memberSince={memberSince} syncPulse={syncPulse} /><FirmUpdatesModule /><RegulatoryDisclaimer /></section>;
}

export default ProtectedPortal;
