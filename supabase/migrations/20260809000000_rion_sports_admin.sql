create extension if not exists pgcrypto;

create type public.inquiry_status as enum ('new', 'read', 'replied', 'archived');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text not null unique check (char_length(sku) between 1 and 80),
  short_description text not null default '',
  description text not null default '',
  material text not null default '',
  available_sizes text[] not null default '{}',
  available_colors text[] not null default '{}',
  features text[] not null default '{}',
  customization_options text[] not null default '{}',
  image_urls text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_active_featured_idx on public.products(is_active, is_featured);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 100),
  company_name text not null check (char_length(company_name) between 1 and 120),
  email text not null check (char_length(email) <= 255),
  phone text,
  country text,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  product_sku text,
  product_page_url text,
  product_category text,
  estimated_quantity text,
  customization_requirements text,
  message text not null check (char_length(message) between 1 and 2000),
  reference_file_url text,
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed')),
  notification_error text,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_status_created_at_idx on public.inquiries(status, created_at desc);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.inquiry_rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  attempts integer not null default 1
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger inquiries_set_updated_at before update on public.inquiries
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.consume_inquiry_rate_limit(p_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed boolean;
begin
  delete from public.inquiry_rate_limits
  where window_start < now() - interval '7 days';

  insert into public.inquiry_rate_limits as limits (key, window_start, attempts)
  values (p_key, now(), 1)
  on conflict (key) do update set
    attempts = case
      when limits.window_start < now() - interval '15 minutes' then 1
      else limits.attempts + 1
    end,
    window_start = case
      when limits.window_start < now() - interval '15 minutes' then now()
      else limits.window_start
    end
  returning attempts <= 5 into allowed;
  return allowed;
end;
$$;

revoke all on function public.consume_inquiry_rate_limit(text) from public;
grant execute on function public.consume_inquiry_rate_limit(text) to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_users enable row level security;
alter table public.inquiry_rate_limits enable row level security;

create policy "Public reads active categories" on public.categories
for select to anon, authenticated using (is_active or public.is_admin());
create policy "Admins insert categories" on public.categories
for insert to authenticated with check (public.is_admin());
create policy "Admins update categories" on public.categories
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete categories" on public.categories
for delete to authenticated using (public.is_admin());

create policy "Public reads active products in active categories" on public.products
for select to anon, authenticated using (
  public.is_admin() or (
    is_active and exists (
      select 1 from public.categories c where c.id = category_id and c.is_active
    )
  )
);
create policy "Admins insert products" on public.products
for insert to authenticated with check (public.is_admin());
create policy "Admins update products" on public.products
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete products" on public.products
for delete to authenticated using (public.is_admin());

create policy "Admins read inquiries" on public.inquiries
for select to authenticated using (public.is_admin());
create policy "Admins update inquiries" on public.inquiries
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete inquiries" on public.inquiries
for delete to authenticated using (public.is_admin());

create policy "Users can verify their own admin record" on public.admin_users
for select to authenticated using (user_id = auth.uid());

insert into public.categories (name, slug, description, display_order) values
  ('Work Jackets', 'work-jackets', 'Two-tone, lined and multi-pocket jackets for daily industrial use.', 10),
  ('Work Trousers', 'work-trousers', 'Cargo, knee-pad and stretch trousers built for movement.', 20),
  ('Coveralls', 'coveralls', 'Single-piece protection for maintenance and heavy industry.', 30),
  ('Bib Overalls', 'bib-overalls', 'Adjustable bib and brace overalls with tool-ready pockets.', 40),
  ('Safety Vests', 'safety-vests', 'Reflective vests for site access, logistics and traffic work.', 50),
  ('Hi-Visibility Workwear', 'hi-visibility', 'Fluorescent fabrics with certified reflective tape placement.', 60),
  ('Softshell Jackets', 'softshell-jackets', 'Wind-resistant, breathable outer layers for outdoor teams.', 70),
  ('Work Shirts', 'work-shirts', 'Poly-cotton shirts for technical, service and corporate teams.', 80)
on conflict (slug) do nothing;

insert into public.products (
  category_id, name, slug, sku, short_description, description, material,
  available_sizes, available_colors, features, customization_options,
  is_featured, is_active
)
select
  c.id, seed.name, seed.slug, seed.sku, seed.short_description,
  seed.description, seed.material, seed.available_sizes, seed.available_colors,
  seed.features, seed.customization_options, true, true
from (
  values
    ('work-jackets', 'Two Tone Work Jacket', 'two-tone-work-jacket', 'RS-WJ-1001', 'A contrast-panel industrial jacket engineered for daily wear.', 'A programme-ready work jacket with reinforced stress points and practical tool storage.', '65% Polyester / 35% Cotton Twill, 245 gsm', array['S','M','L','XL','2XL','3XL','4XL'], array['Navy / Grey','Charcoal / Black','Royal / Navy'], array['Triple-stitched main seams','Reinforced elbow panels','Adjustable cuffs'], array['Custom colours','Logo embroidery or printing','Private labels']),
    ('work-trousers', 'Heavy Duty Cargo Trouser', 'heavy-duty-cargo-trouser', 'RS-WT-2004', 'A robust cargo trouser for construction and heavy industry.', 'Heavy-duty work trousers with reinforced knee panels and a multi-pocket layout.', '100% Cotton Canvas, 300 gsm', array['44','46','48','50','52','54','56','58'], array['Charcoal','Navy','Black','Sand'], array['Knee-pad pockets','Reinforced knee and hems','Multiple tool pockets'], array['Reinforcement options','Reflective details','Regional grading']),
    ('coveralls', 'Industrial Coverall', 'industrial-coverall', 'RS-CV-3010', 'A full-body coverall for maintenance and industrial environments.', 'A practical single-piece coverall with concealed closure and unrestricted shoulder movement.', '65% Polyester / 35% Cotton, 230 gsm', array['S','M','L','XL','2XL','3XL','4XL'], array['Navy','Royal Blue','Grey'], array['Concealed front closure','Action back','Multiple utility pockets'], array['Flame-retardant fabrics','Reflective tape','Custom branding']),
    ('hi-visibility', 'Hi-Vis Safety Jacket', 'hi-vis-safety-jacket', 'RS-HV-4021', 'A high-visibility outer jacket for road, rail and site work.', 'A fluorescent safety jacket with contrast lower panels and configurable reflective tape.', '100% Polyester Oxford with PU coating, 300D', array['S','M','L','XL','2XL','3XL','4XL'], array['Hi-Vis Yellow / Navy','Hi-Vis Orange / Navy'], array['Reflective tape','Water-resistant shell','Concealed hood'], array['Tape configurations','Lining options','Logo printing']),
    ('bib-overalls', 'Work Bib Overall', 'work-bib-overall', 'RS-BO-5008', 'An adjustable bib and brace overall with tool-ready pockets.', 'A practical bib overall with adjustable braces, reinforced knees and utility storage.', '65% Polyester / 35% Cotton Twill, 260 gsm', array['S','M','L','XL','2XL','3XL','4XL'], array['Navy','Black','Charcoal'], array['Adjustable braces','Chest tool pocket','Knee-pad pockets'], array['Contrast panels','Chest branding','Pocket configurations']),
    ('safety-vests', 'Reflective Safety Vest', 'reflective-safety-vest', 'RS-SV-6002', 'A lightweight reflective vest for site access and logistics.', 'A high-volume fluorescent safety vest with generous front and back branding areas.', '100% Polyester Knit or Tricot, 120 gsm', array['M','L','XL','2XL','3XL'], array['Hi-Vis Orange','Hi-Vis Yellow'], array['Reflective tape','Multiple closure options','Large branding areas'], array['Screen printing','Custom tape layouts','Pocket options']),
    ('softshell-jackets', 'Softshell Work Jacket', 'softshell-work-jacket', 'RS-SS-7015', 'A premium wind-resistant layer for corporate and outdoor workwear.', 'A three-layer bonded softshell jacket with clean panels for professional branding.', '3-Layer Bonded Softshell, 320 gsm', array['S','M','L','XL','2XL','3XL','4XL'], array['Black','Navy','Grey'], array['Fleece backing','Water-repellent finish','Articulated sleeves'], array['Custom colours','Embroidery','Hood options']),
    ('work-shirts', 'Professional Work Shirt', 'professional-work-shirt', 'RS-WS-8003', 'A durable work shirt for technical and corporate uniforms.', 'An easy-care uniform shirt designed for frequent laundering and professional presentation.', '65% Polyester / 35% Cotton Poplin, 130 gsm', array['S','M','L','XL','2XL','3XL','4XL'], array['Grey','Navy','White','Light Blue'], array['Fused collar and cuffs','Chest tool pocket','Easy-care finish'], array['Custom colours','Embroidered logos','Branded buttons'])
) as seed(category_slug, name, slug, sku, short_description, description, material, available_sizes, available_colors, features, customization_options)
join public.categories c on c.slug = seed.category_slug
on conflict (sku) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('product-images', 'product-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('category-images', 'category-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('inquiry-attachments', 'inquiry-attachments', false, 10485760, array['application/pdf','image/jpeg','image/png','application/postscript'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public views catalog images" on storage.objects
for select to public using (bucket_id in ('product-images', 'category-images'));
create policy "Admins upload catalog images" on storage.objects
for insert to authenticated with check (
  bucket_id in ('product-images', 'category-images') and public.is_admin()
);
create policy "Admins update catalog images" on storage.objects
for update to authenticated using (
  bucket_id in ('product-images', 'category-images') and public.is_admin()
) with check (
  bucket_id in ('product-images', 'category-images') and public.is_admin()
);
create policy "Admins delete catalog images" on storage.objects
for delete to authenticated using (
  bucket_id in ('product-images', 'category-images') and public.is_admin()
);
create policy "Admins read private inquiry files" on storage.objects
for select to authenticated using (
  bucket_id = 'inquiry-attachments' and public.is_admin()
);
create policy "Admins delete private inquiry files" on storage.objects
for delete to authenticated using (
  bucket_id = 'inquiry-attachments' and public.is_admin()
);
