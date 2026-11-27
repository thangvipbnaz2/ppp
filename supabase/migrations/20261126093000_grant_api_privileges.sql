grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories, public.products, public.news_posts, public.settings to anon, authenticated;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

-- Giá 150.000đ từng được dùng làm giá mẫu. Không có bằng chứng giá thật thì chuyển về Liên hệ.
update public.products
set price_no_vat = null,
    price_with_vat = null,
    retail_price = null,
    regular_price = null,
    price_status = 'contact',
    updated_at = now()
where price_with_vat = 150000;

update public.products
set name = replace(replace(name, 'Blutooth', 'Bluetooth'), 'blutooth', 'Bluetooth'),
    category_original = replace(replace(coalesce(category_original, ''), 'Blutooth', 'Bluetooth'), 'blutooth', 'Bluetooth'),
    updated_at = now()
where name ilike '%blutooth%' or category_original ilike '%blutooth%';

update public.categories
set name = replace(replace(name, 'Blutooth', 'Bluetooth'), 'blutooth', 'Bluetooth')
where name ilike '%blutooth%';
