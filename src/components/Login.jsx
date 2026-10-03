import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase.js';

export default function Login() {
  const [error, setError] = useState('');
  const signIn = async () => {
    try { await signInWithPopup(auth, provider); }
    catch (e) { if (e.code !== 'auth/popup-closed-by-user') setError('Sign-in failed. Check your connection and try again.'); }
  };
  return (
    <main className="login">
      <h1>Huddle</h1>
      <p>Join a room, say hello, and chat in real time.</p>
      <button className="btn" onClick={signIn}>Sign in with Google</button>
      {error && <p className="err" role="alert">{error}</p>}
    </main>
  );
}
