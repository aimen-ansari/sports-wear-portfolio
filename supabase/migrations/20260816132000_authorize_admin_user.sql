do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = 'admin@rionapparels.site'
  order by created_at desc
  limit 1;

  if target_user_id is null then
    raise exception 'Auth user admin@rionapparels.site does not exist';
  end if;

  delete from public.admin_users
  where lower(email) = 'admin@rionapparels.site'
    and user_id <> target_user_id;

  insert into public.admin_users (user_id, email)
  values (target_user_id, 'admin@rionapparels.site')
  on conflict (user_id) do update
  set email = excluded.email;
end
$$;
