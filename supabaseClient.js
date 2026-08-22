(function () {
  const config = {
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key-placeholder'
  };

  const createClient = () => {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return window.supabase.createClient(config.url, config.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }

    return null;
  };

  const supabase = createClient();

  async function triggerAutoAccountProvisioning(actionType, metadata = {}) {
    const payload = {
      action_type: actionType,
      metadata,
      created_at: new Date().toISOString()
    };

    if (!supabase) {
      console.info('[DwaricaSupabase] Supabase client unavailable; local-only provisioning fallback.', payload);
      return {
        ok: true,
        localOnly: true,
        actionType,
        metadata
      };
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData?.session?.user?.id || null;

      if (!userId) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signInAnonymously();
        if (signUpError) throw signUpError;
        userId = signUpData?.user?.id || null;
      }

      if (!userId) {
        return { ok: true, localOnly: true, actionType, metadata };
      }

      const { error: inquiryError } = await supabase.from('inquiries').insert([
        {
          user_id: userId,
          action_type: actionType,
          metadata,
          created_at: new Date().toISOString()
        }
      ]);

      if (inquiryError) throw inquiryError;

      const { error: ledgerError } = await supabase.from('ledger').insert([
        {
          user_id: userId,
          action_type: actionType,
          metadata,
          created_at: new Date().toISOString()
        }
      ]);

      if (ledgerError) throw ledgerError;

      return { ok: true, userId, actionType, metadata };
    } catch (error) {
      console.error('[DwaricaSupabase] Auto-account provisioning failed:', error);
      return { ok: false, error: error.message || 'Unknown provisioning error' };
    }
  }

  window.DwaricaSupabase = {
    config,
    supabase,
    triggerAutoAccountProvisioning
  };
})();
