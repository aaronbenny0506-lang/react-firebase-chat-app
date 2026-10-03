import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [rooms, setRooms] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [user]);

  if (user === undefined) return <p className="center">Loading...</p>;
  if (!user) return <Login />;

  const active = rooms.find((r) => r.id === activeId);
  return (
    <div className="layout">
      <Sidebar rooms={rooms} activeId={activeId} user={user} open={menuOpen}
        onSelect={(id) => { setActiveId(id); setMenuOpen(false); }} />
      <ChatRoom room={active} user={user} onMenu={() => setMenuOpen(true)} />
    </div>
  );
}
