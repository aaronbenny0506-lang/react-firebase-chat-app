import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, limitToLast, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function ChatRoom({ room, user, onMenu }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    if (!room) return;
    const q = query(collection(db, 'rooms', room.id, 'messages'), orderBy('createdAt'), limitToLast(100));
    return onSnapshot(q, (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setError('Could not load messages.'));
  }, [room?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setText('');
    try {
      await addDoc(collection(db, 'rooms', room.id, 'messages'), {
        text: clean, uid: user.uid, name: user.displayName, createdAt: serverTimestamp(),
      });
    } catch { setError('Message failed to send.'); setText(clean); }
  };

  const time = (m) => m.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <section className="chat">
      <header><button className="btn ghost menu" onClick={onMenu}>Rooms</button><h2>{room ? `# ${room.name}` : 'Pick a room'}</h2></header>
      {!room ? <p className="center muted">Choose a room on the left, or create a new one.</p> : (
        <>
          <div className="msgs" aria-live="polite">
            {messages.length === 0 && <p className="muted">No messages yet. Say hello.</p>}
            {messages.map((m) => (
              <div key={m.id} className={m.uid === user.uid ? 'msg mine' : 'msg'}>
                <small>{m.uid === user.uid ? 'You' : m.name} {time(m)}</small>
                <p>{m.text}</p>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {error && <p className="err">{error}</p>}
          <form onSubmit={send} className="composer">
            <input value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="Type a message" aria-label="Message" />
            <button className="btn">Send</button>
          </form>
        </>
      )}
    </section>
  );
}
