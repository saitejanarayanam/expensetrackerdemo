-- Add a user_id column to expenses and enable row level security
alter table if exists public.expenses
add column if not exists user_id text;

-- Enable RLS and enforce ownership checks
alter table public.expenses enable row level security;

create policy "Users can manage their own expenses"
  on public.expenses
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
