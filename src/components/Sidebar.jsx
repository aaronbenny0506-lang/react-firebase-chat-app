import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase.js';

export default function Sidebar({ rooms, activeId, user, open, onSelect }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const create = async (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return setError('Enter a room name');
    if (rooms.some((r) => r.name.toLowerCase() === clean.toLowerCase())) return setError('That room already exists');
    try {
      const ref = await addDoc(collection(db, 'rooms'), { name: clean, createdBy: user.uid, createdAt: serverTimestamp() });
      setName(''); setError(''); onSelect(ref.id);
    } catch { setError('Could not create the room. Try again.'); }
  };

  return (
    <aside className={open ? 'side open' : 'side'}>
      <h2>Rooms</h2>
      <form onSubmit={create} className="newroom">
        <input value={name} maxLength={30} onChange={(e) => setName(e.target.value)} placeholder="New room name" aria-label="New room name" />
        <button className="btn">Add</button>
      </form>
      {error && <p className="err">{error}</p>}
      <nav>
        {rooms.length === 0 && <p className="muted">No rooms yet. Create the first one.</p>}
        {rooms.map((r) => (
          <button key={r.id} className={r.id === activeId ? 'room on' : 'room'} onClick={() => onSelect(r.id)}># {r.name}</button>
        ))}
      </nav>
      <div className="me">
        <span>{user.displayName}</span>
        <button className="btn ghost" onClick={() => signOut(auth)}>Sign out</button>
      </div>
    </aside>
  );
}
