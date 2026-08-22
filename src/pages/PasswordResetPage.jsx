import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message); else { setMessage('Password updated. Opening your private portal…'); window.setTimeout(() => navigate('/portal', { replace: true }), 900); }
  };
  return <main className="password-reset-page"><div className="password-reset-card"><span className="section-kicker">Private access recovery</span><h1>Create a new password.</h1><p>Set a new password for your DGroup account. Your session remains protected throughout the update.</p><form onSubmit={submit}><label>New password<input required minLength="8" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Confirm password<input required minLength="8" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label><button type="submit" className="primary-button">Update password</button>{error ? <span className="auth-gateway-error">{error}</span> : null}{message ? <span className="auth-gateway-sent">{message}</span> : null}</form></div></main>;
}
