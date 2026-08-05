# Rohan Lall — Portfolio (with contact-form backend)

A dark, terminal-themed portfolio site. The contact form saves submissions to
MongoDB, and a "DB Browser" panel on the site lets you view/delete them —
styled like DB Browser for SQLite, gated behind an admin key.

## Structure

```
server/
├── server.js           # Express app entry point
├── models/Contact.js   # Mongoose schema for a contact submission
├── routes/contacts.js  # POST (public) / GET+DELETE (admin-only) endpoints
├── public/index.html   # The whole frontend (single file)
├── .env.example         # Copy to .env and fill in
└── package.json
```

## Setup

1. Install Node.js 18+ and either a local MongoDB, or a free MongoDB Atlas cluster.
2. From the `server/` folder:
   ```
   npm install
   cp .env.example .env
   ```
3. Edit `.env`:
   - `MONGODB_URI` — your local (`mongodb://127.0.0.1:27017/portfolio`) or Atlas connection string
   - `ADMIN_KEY` — a private key only you know; this unlocks the DB Browser panel on the live site
4. Run it:
   ```
   npm start
   ```
   Visit `http://localhost:5000`.

## How the DB Browser panel works

- Anyone can submit the contact form → `POST /api/contacts` (no auth) → saved to MongoDB.
- Scroll to the "database" section on the site, enter your `ADMIN_KEY` in the
  prompt, and it calls `GET /api/contacts` (sends the key in an `x-admin-key`
  header) to list every submission in a DB-Browser-style table, with a delete
  button per row.
- This is a **soft gate**, not real authentication — anyone who has the key
  (or intercepts the header) can read/delete entries. Fine for a personal
  portfolio; if you ever store more sensitive data, swap this for real auth
  (JWT + login) later.

## Deploying

- **Backend**: Render, Railway, or Fly.io all have free/cheap tiers that run
  Express + MongoDB Atlas well.
- **Frontend**: since `server.js` already serves `public/index.html`, you can
  deploy the whole `server/` folder as one app — no separate static host needed.
