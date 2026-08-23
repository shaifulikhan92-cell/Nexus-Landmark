create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  image_url text,
  bio text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.board_members enable row level security;

drop policy if exists "Public can read board members" on public.board_members;
create policy "Public can read board members" on public.board_members for select using (published = true);

drop policy if exists "Admins manage board members" on public.board_members;
create policy "Admins manage board members" on public.board_members for all using (public.is_admin()) with check (public.is_admin());

insert into public.board_members (name, designation, image_url, bio, sort_order, published)
values
('Ahsan Rahman', 'Chairman', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85', 'Strategic visionary with over 20 years of real estate development and urban growth leadership in Bangladesh.', 1, true),
('Nadia Karim', 'Managing Director', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85', 'Leading operations, architecture standards, and long-term project delivery across residential and commercial towers.', 2, true),
('Tanvir Hasan', 'Director, Operations', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85', 'Overseeing site execution, engineering safety compliance, customer relations, and corporate governance.', 3, true)
on conflict do nothing;
