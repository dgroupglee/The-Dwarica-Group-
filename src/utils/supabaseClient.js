import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const unavailableError = new Error('Supabase is not configured for this deployment.')
const unavailableQuery = () => Promise.resolve({ data: [], error: unavailableError })
const unavailableBuilder = () => {
  const builder = {
    select: () => builder,
    insert: () => builder,
    upsert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    in: () => builder,
    gt: () => builder,
    order: () => builder,
    limit: () => builder,
    maybeSingle: () => Promise.resolve({ data: null, error: unavailableError }),
    single: () => Promise.resolve({ data: null, error: unavailableError }),
    then: (...args) => unavailableQuery().then(...args),
  }
  return builder
}

function createUnavailableClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: unavailableError }),
      getUser: () => Promise.resolve({ data: { user: null }, error: unavailableError }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInAnonymously: () => Promise.resolve({ data: { user: null }, error: unavailableError }),
      signInWithOtp: () => Promise.resolve({ data: null, error: unavailableError }),
      signInWithPassword: () => Promise.resolve({ data: null, error: unavailableError }),
      signUp: () => Promise.resolve({ data: null, error: unavailableError }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: unavailableError }),
      updateUser: () => Promise.resolve({ data: null, error: unavailableError }),
      signOut: () => Promise.resolve({ error: unavailableError }),
    },
    from: unavailableBuilder,
    channel: () => ({ on: () => ({ on: () => ({ subscribe: () => undefined }) }) }),
    removeChannel: () => undefined,
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createUnavailableClient()

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing; running with local-only access.')
}

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
