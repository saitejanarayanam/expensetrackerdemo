-- Alter the expenses table to add invoice reference columns
alter table if exists public.expenses
add column if not exists invoice_path text,
add column if not exists invoice_name text;

-- Create the invoices storage bucket (public = true allows simple public url resolution)
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', true)
on conflict (id) do nothing;

-- Drop existing policies if they exist to avoid duplication errors
drop policy if exists "Allow authenticated users to read their own invoices" on storage.objects;
drop policy if exists "Allow authenticated users to upload invoices" on storage.objects;
drop policy if exists "Allow authenticated users to delete their own invoices" on storage.objects;

-- Policy to allow authenticated users to read invoices in their folder
create policy "Allow authenticated users to read their own invoices"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'invoices' and (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow authenticated users to upload invoices to their folder
create policy "Allow authenticated users to upload invoices"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'invoices' and (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow authenticated users to delete invoices from their folder
create policy "Allow authenticated users to delete their own invoices"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'invoices' and (storage.foldername(name))[1] = auth.uid()::text);
