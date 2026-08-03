-- Nexus Landmark CMS schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  description text,
  property_type text not null default 'Residential',
  status text not null default 'Upcoming' check (status in ('Ongoing', 'Upcoming', 'Completed')),
  size text,
  price text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  property_id uuid references public.properties(id) on delete set null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Public can view properties" on public.properties;
create policy "Public can view properties" on public.properties for select using (true);

drop policy if exists "Admins manage properties" on public.properties;
create policy "Admins manage properties" on public.properties for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can send inquiries" on public.inquiries;
create policy "Public can send inquiries" on public.inquiries for insert with check (true);

drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries" on public.inquiries for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users view their profile" on public.profiles;
create policy "Users view their profile" on public.profiles for select using (auth.uid() = id or public.is_admin());

insert into public.properties (title, location, description, property_type, status, size, price, image_url)
values
('Nexus Parkview', 'Gulshan, Dhaka', 'A calm, contemporary family residence shaped around light, space, and everyday ease.', 'Residential', 'Ongoing', '1,850–2,450 sft', 'On request', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'),
('Landmark One', 'Banani, Dhaka', 'A confident commercial address for ambitious businesses, retail, and lifestyle brands.', 'Commercial', 'Upcoming', '1,200–8,000 sft', 'On request', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85')
on conflict do nothing;
