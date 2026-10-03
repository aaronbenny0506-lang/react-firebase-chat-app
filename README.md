# Huddle: Real-Time Chat Rooms (React + Firebase)

Multi-room chat app. Sign in with Google, create rooms, and talk in real time.

**Stack:** React 18 (Vite), Firebase Authentication (Google), Cloud Firestore (real-time listeners).

## Features
- Google sign-in / sign-out
- Create and switch between multiple chat rooms
- Real-time messages (Firestore `onSnapshot`), last 100 shown, auto-scroll
- Input validation, error messages, responsive layout (rooms drawer on mobile)
- Firestore security rules: signed-in users only, users can post only as themselves, length limits

## Setup
1. Go to console.firebase.google.com, create a project, then **Add app > Web** and copy the config values.
2. **Build > Authentication > Get started > Sign-in method:** enable **Google**.
3. **Build > Firestore Database > Create database** (start in production mode), then open the **Rules** tab and paste the contents of `firestore.rules`, then Publish.
4. Copy `.env.example` to `.env` and fill in the four values from step 1.
5. Run:
```bash
npm install
npm run dev     # http://localhost:5173
```

## Structure
```
src/
  firebase.js              Firebase init (config from .env)
  App.jsx                  auth state, rooms listener, layout
  components/              Login, Sidebar (rooms), ChatRoom (messages)
firestore.rules            security rules
```

## Data model
`rooms/{roomId}` { name, createdBy, createdAt } and `rooms/{roomId}/messages/{id}` { text, uid, name, createdAt }

## Deploy (optional)
Vercel/Netlify: build `npm run build`, output `dist`, add the four `VITE_FIREBASE_*` variables. Then add your deployed domain under Firebase **Authentication > Settings > Authorized domains**.
