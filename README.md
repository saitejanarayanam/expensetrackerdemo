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
   - `user_id` text not null
   - `created_at` timestamptz default now()

2. Enable row level security for the `expenses` table and add a policy to allow users to access only their own rows.

   In SQL editor, run:

   ```sql
   alter table public.expenses enable row level security;

   create policy "Users can manage their own expenses"
     on public.expenses
     for all
     using (user_id = auth.uid())
     with check (user_id = auth.uid());
   ```

3. Copy `.env.example` to `.env` and add your Supabase anon key.

4. Start the app:

```bash
npm install
npm run dev
```
