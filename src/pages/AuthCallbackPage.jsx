import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/portal' : '/', { replace: true });
    });
  }, [navigate]);

  return <div className="portal-loading"><p>Confirming access...</p></div>;
}
