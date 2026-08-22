import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendMagicLink, supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/useAuth';

export default function AuthModal({ onClose, gated = false }) {
  const { requestAccess } = useAuth();
  const [mode, setMode] = useState('signin');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const selectMode = (nextMode) => { setMode(nextMode); setSent(false); setError(''); setMessage(''); };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (mode === 'signin') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (authError) throw authError;
        onClose?.();
      } else if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { emailRedirectTo: `${window.location.origin}/portal` } });
        if (authError) throw authError;
        if (data.session) onClose?.(); else { setSent(true); setMessage('Account created. Check your inbox if email confirmation is enabled, then return to sign in.'); }
      } else if (mode === 'magic') {
        const { error: authError } = await sendMagicLink(values.email);
        if (authError) throw authError;
        setSent(true); setMessage('Secure magic link sent. Check your inbox to continue.');
      } else if (mode === 'reset') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/auth/reset` });
        if (authError) throw authError;
        setSent(true); setMessage('Password recovery link sent. Check your inbox to reset access securely.');
      } else {
        const result = await requestAccess('private_access_request', { ...values, source: 'auth-gateway' });
        if (result?.ok === false) throw new Error(result.message || result.error || 'Unable to complete this request.');
        setSent(true); setMessage('Private access request received.');
      }
    } catch (authError) { setError(authError.message || 'Unable to complete this request.'); } finally { setLoading(false); }
  };
  const needsPassword = mode === 'signin' || mode === 'signup';
  const title = mode === 'signin' ? 'Return to your private command center.' : mode === 'signup' ? 'Create your private DGroup account.' : mode === 'magic' ? 'Use a passwordless access link.' : mode === 'reset' ? 'Recover your private access.' : 'Request a private allocation profile.';
  return <AnimatePresence><motion.div className="auth-gateway-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (!gated && event.target === event.currentTarget) onClose?.(); }}><motion.div className="auth-gateway-modal" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .45 }} role="dialog" aria-modal="true" aria-labelledby="auth-gateway-title"><div className="auth-gateway-mark">D</div>{!gated ? <button type="button" className="modal-close" onClick={onClose} aria-label="Close authentication">×</button> : null}<span className="section-kicker">Private client gateway</span><h2 id="auth-gateway-title">{title}</h2><p>{sent ? 'Your request has been routed securely.' : mode === 'request' ? 'Tell the private capital team who should receive access to the DGroup workspace.' : mode === 'reset' ? 'Enter your account email and we will send a secure password recovery link.' : 'Returning clients can use email and password for immediate access without another email delivery.'}</p><div className="auth-mode-tabs" role="tablist" aria-label="Authentication options"><button type="button" className={mode === 'signin' ? 'is-active' : ''} onClick={() => selectMode('signin')}>Sign in</button><button type="button" className={mode === 'signup' ? 'is-active' : ''} onClick={() => selectMode('signup')}>Create account</button><button type="button" className={mode === 'magic' ? 'is-active' : ''} onClick={() => selectMode('magic')}>Magic link</button></div>{sent ? <div className="auth-gateway-sent"><strong>{message || 'Request received.'}</strong><span>Use the sign-in tab after confirming access.</span></div> : <form onSubmit={submit}>{mode === 'request' ? <><label>Legal entity name<input required name="entity_name" placeholder="Entity or family office" /></label><label>Accreditation tier<select required name="accreditation_tier" defaultValue=""><option value="" disabled>Select tier</option><option>Accredited investor</option><option>Qualified purchaser</option><option>Institutional / family office</option></select></label><label>Direct contact phone<input required name="phone" placeholder="Direct contact" /></label></> : null}<label>Corporate email<input required type="email" name="email" placeholder="name@company.com" autoFocus /></label>{needsPassword ? <label>Password<input required type="password" name="password" minLength="8" placeholder="At least 8 characters" /></label> : null}<button type="submit" className="primary-button" disabled={loading}>{loading ? 'Processing securely…' : mode === 'signin' ? 'Access portal' : mode === 'signup' ? 'Create account' : mode === 'magic' ? 'Send magic link' : mode === 'reset' ? 'Send recovery link' : 'Request private access'}</button>{error ? <span className="auth-gateway-error" role="alert">{error}</span> : null}</form>}{mode === 'signin' ? <button type="button" className="auth-forgot-link" onClick={() => selectMode('reset')}>Forgot password?</button> : null}{mode === 'request' ? <button type="button" className="auth-mode-toggle" onClick={() => selectMode('signin')}>Already a member? Sign in with password →</button> : <button type="button" className="auth-mode-toggle" onClick={() => selectMode('request')}>Need access? Request a private profile →</button>}</motion.div></motion.div></AnimatePresence>;
}
