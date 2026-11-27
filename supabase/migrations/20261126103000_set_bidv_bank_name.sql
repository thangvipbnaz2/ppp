update public.settings
set value = jsonb_set(value, '{bank}', '"BIDV"'::jsonb, true),
    updated_at = now()
where key = 'bank_info'
  and coalesce(value->>'bank', '') = '';
