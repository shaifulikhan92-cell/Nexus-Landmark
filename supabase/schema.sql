-- Nexus Landmark CMS schema
create extension if not exists pgcrypto;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Properties table
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

-- Inquiries table
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  property_id uuid references public.properties(id) on delete set null,
  property_title text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

-- Site content table (Stores full key-value JSON for A-Z frontend customization)
create table if not exists public.site_content (
  id text primary key default 'homepage',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Gallery table
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  title text not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Testimonials table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  customer_name text not null,
  customer_role text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Services / Stories table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Board of Directors table
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

-- Function to check admin status
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_content enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.services enable row level security;
alter table public.board_members enable row level security;

-- Board Members Policies
drop policy if exists "Public can read board members" on public.board_members;
create policy "Public can read board members" on public.board_members for select using (published = true);

drop policy if exists "Admins manage board members" on public.board_members;
create policy "Admins manage board members" on public.board_members for all using (public.is_admin()) with check (public.is_admin());

-- Site Content Policies
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content" on public.site_content for select using (true);

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

-- Gallery Policies
drop policy if exists "Public can read gallery" on public.gallery_items;
create policy "Public can read gallery" on public.gallery_items for select using (true);
drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());

-- Testimonials Policies
drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials" on public.testimonials for select using (published = true);
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

-- Services Policies
drop policy if exists "Public can read services" on public.services;
create policy "Public can read services" on public.services for select using (published = true);
drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());

-- Properties Policies
drop policy if exists "Public can view properties" on public.properties;
create policy "Public can view properties" on public.properties for select using (true);
drop policy if exists "Admins manage properties" on public.properties;
create policy "Admins manage properties" on public.properties for all using (public.is_admin()) with check (public.is_admin());

-- Inquiries Policies
drop policy if exists "Public can send inquiries" on public.inquiries;
create policy "Public can send inquiries" on public.inquiries for insert with check (true);
drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries" on public.inquiries for all using (public.is_admin()) with check (public.is_admin());

-- Profiles Policies
drop policy if exists "Users view their profile" on public.profiles;
create policy "Users view their profile" on public.profiles for select using (auth.uid() = id or public.is_admin());

-- Seed Data: Sample Properties
insert into public.properties (title, location, description, property_type, status, size, price, image_url)
values
('Nexus Parkview', 'Gulshan, Dhaka', 'A calm, contemporary family residence shaped around light, space, and everyday ease.', 'Residential', 'Ongoing', '1,850–2,450 sft', 'On request', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'),
('Landmark One', 'Banani, Dhaka', 'A confident commercial address for ambitious businesses, retail, and lifestyle brands.', 'Commercial', 'Upcoming', '1,200–8,000 sft', 'On request', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85'),
('The Grove Residences', 'Uttara, Dhaka', 'Thoughtful apartments with green views, practical planning, and a warm sense of home.', 'Residential', 'Completed', '1,450–1,900 sft', 'On request', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85')
on conflict do nothing;

-- Seed Data: Site Content (Full A-Z frontend default content JSON)
insert into public.site_content (id, content)
values ('homepage', '{
  "brand_name": "Nexus Landmark",
  "brand_subtitle": "Properties & Development",
  "logo_url": "/logo.png",
  "top_bar_text": "NEXUS LANDMARK — CREATING ADDRESSES WITH PURPOSE",
  "hero_eyebrow": "Better thinking. Better addresses.",
  "hero_title": "Spaces that",
  "hero_title_accent": "move you forward.",
  "hero_description": "We create future-ready homes and commercial spaces in the places that matter—designed for the life you have now and the one you are building next.",
  "hero_image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
  "hero_primary_cta": "Explore projects",
  "hero_secondary_cta": "Why Nexus Landmark",
  "hero_stat_number": "12+",
  "hero_stat_label": "Years of trusted work",
  "hero_featured_label": "Featured address",
  "hero_featured_title": "Nexus Parkview · Gulshan",
  "about_eyebrow": "A more considered approach",
  "about_title": "A better address begins with",
  "about_title_accent": "better thinking.",
  "about_description": "We bring planning, architecture, and customer care into one clear ownership journey. From site selection to handover, every decision is made to create calm, lasting value.",
  "about_stat1_number": "12+",
  "about_stat1_label": "Premium floors delivered",
  "about_stat2_number": "100%",
  "about_stat2_label": "Accountable service",
  "portfolio_eyebrow": "Our portfolio",
  "portfolio_title": "Addresses with intention.",
  "board_eyebrow": "Leadership & Vision",
  "board_title": "Board of Directors",
  "board_description": "Leadership with development, finance, structural engineering, and design expertise.",
  "gallery_eyebrow": "See the detail",
  "gallery_title": "A visual language of care.",
  "journal_eyebrow": "The Nexus journal",
  "journal_title": "Stories behind the spaces.",
  "journal_description": "Walk through our projects, meet the people behind them, and see how considered decisions become lasting places.",
  "testimonial_quote": "The process felt clear from day one. The design is premium, but more importantly, it works beautifully for our family.",
  "testimonial_author": "Farzana Chowdhury, Nexus homeowner",
  "cta_eyebrow": "Your next address starts here",
  "cta_title": "Ready to choose a place that feels like yours?",
  "cta_description": "Request a consultation, project brochure, or a private site visit with our team.",
  "phone": "01711994449",
  "email": "hello@nexuslandmark.com",
  "address": "Dhaka, Bangladesh",
  "footer_tagline": "Premium residential and commercial developments shaped by design intelligence, local insight, and long-term trust."
}'::jsonb)
on conflict (id) do update set content = excluded.content;

-- Seed Data: Sample Board Members
insert into public.board_members (name, designation, image_url, bio, sort_order, published)
values
('Ahsan Rahman', 'Chairman', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85', 'Strategic visionary with over 20 years of real estate development and urban growth leadership in Bangladesh.', 1, true),
('Nadia Karim', 'Managing Director', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85', 'Leading operations, architecture standards, and long-term project delivery across residential and commercial towers.', 2, true),
('Tanvir Hasan', 'Director, Operations', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85', 'Overseeing site execution, engineering safety compliance, customer relations, and corporate governance.', 3, true)
on conflict do nothing;

-- Seed Data: Sample Gallery Items
insert into public.gallery_items (label, title, image_url, sort_order)
values
('Exterior', 'Architectural expression', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85', 1),
('Interior', 'Living, refined', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', 2),
('Progress', 'Built with care', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85', 3)
on conflict do nothing;

-- Seed Data: Sample Testimonials
insert into public.testimonials (quote, customer_name, customer_role, published)
values
('The process felt clear from day one. The design is premium, but more importantly, it works beautifully for our family.', 'Farzana Chowdhury', 'Nexus Homeowner', true),
('Landmark One gives our corporate office exactly the prestige and architectural quality we needed in Banani.', 'Tanvir Ahmed', 'CEO, TechVentures', true)
on conflict do nothing;

-- Seed Data: Sample Services / Stories
insert into public.services (title, description, icon, image_url, sort_order, published)
values
('Designing for the way Dhaka lives', 'How local context, airflow, and light shape every Nexus Landmark address.', 'Compass', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85', 1, true),
('Inside Nexus Parkview', 'A private walkthrough of our flagship residence in Gulshan.', 'Video', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=85', 2, true)
on conflict do nothing;

-- Storage bucket setup
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

-- Storage policies
drop policy if exists "Public can view site assets" on storage.objects;
create policy "Public can view site assets" on storage.objects for select using (bucket_id = 'site-assets');

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects for insert with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects for update using (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets" on storage.objects for delete using (bucket_id = 'site-assets' and public.is_admin());
