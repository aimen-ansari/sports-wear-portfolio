do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = 'admin@rionapparels.site'
    and email_confirmed_at is not null
  order by created_at desc
  limit 1;

  if target_user_id is not null then
    delete from public.admin_users
    where lower(email) = 'admin@rionapparels.site'
      and user_id <> target_user_id;

    insert into public.admin_users (user_id, email)
    values (target_user_id, 'admin@rionapparels.site')
    on conflict (user_id) do update
    set email = excluded.email;
  end if;
end
$$;
