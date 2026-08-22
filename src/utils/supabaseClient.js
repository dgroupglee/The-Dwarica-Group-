import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function sendMagicLink(email) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + '/portal' },
  });
}

export async function ensureAccount(email, accountId = null, accountType = 'client') {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.from('accounts').upsert({ ...(accountId ? { id: accountId } : {}), email: normalizedEmail, account_type: accountType }, { onConflict: 'email' }).select().single();
  return { data, error };
}

export async function recordActivity(accountId, action, itemId = null, detail = null) {
  return supabase.from('account_activity').insert({ account_id: accountId, action, item_id: itemId, detail });
}

export async function saveFavorite(accountId, item) {
  return supabase.from('favorites').upsert({ account_id: accountId, item_id: item.id, item_name: item.name, item_category: item.category, item_price: item.price, item_image: item.image || null }, { onConflict: 'account_id,item_id' });
}

export async function removeFavorite(accountId, itemId) {
  return supabase.from('favorites').delete().eq('account_id', accountId).eq('item_id', itemId);
}

export async function triggerAutoAccountProvisioning(actionType, metadata = {}) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    let user = sessionData?.session?.user ?? null;

    if (!user) {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;
      user = authData?.user ?? null;
    }

    if (!user) {
      return { ok: true, localOnly: true, actionType, metadata };
    }

    const { error } = await supabase.from('account_activity').insert([
      {
        account_id: user.id,
        action: actionType,
        detail: JSON.stringify(metadata),
      },
    ]);

    if (error) throw error;

    return { ok: true, userId: user.id, actionType, metadata };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Unknown provisioning error',
      actionType,
      metadata,
    };
  }
}
