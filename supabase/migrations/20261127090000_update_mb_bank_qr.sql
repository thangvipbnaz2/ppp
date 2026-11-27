update public.settings
set value = '{"bank":"MB Bank","branch":"","account_number":"922072005","account_name":"NGUYEN VAN THANG","qr_image":"/qr-thanh-toan.png"}'::jsonb,
    updated_at = now()
where key = 'bank_info';

insert into public.settings (key, value)
select
  'bank_info',
  '{"bank":"MB Bank","branch":"","account_number":"922072005","account_name":"NGUYEN VAN THANG","qr_image":"/qr-thanh-toan.png"}'::jsonb
where not exists (
  select 1 from public.settings where key = 'bank_info'
);
