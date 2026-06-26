# Sai Teja's Personal Expenses Tracker

Simple personal expense tracker built with React + Vite.

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:5173

Supabase setup
---------------

1. In Supabase, create a table named `expenses` with columns:
   - `id` text primary key
   - `title` text not null
   - `amount` numeric not null
   - `date` date not null
   - `category` text not null
   - `created_at` timestamptz default now()

2. Copy `.env.example` to `.env` and add your Supabase anon key.

3. Start the app:

```bash
npm install
npm run dev
```
