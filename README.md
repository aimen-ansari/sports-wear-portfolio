# RION APPARELS

RION APPARELS is a React 19 and TanStack Start application built with Vite, TypeScript, Tailwind CSS 4, and Supabase.

## Local Setup

1. Use Node 22 and npm 11.
2. Run `npm install`.
3. Create `.env.local` from `.env.example` and add the public Supabase project values.
4. Run `npm run dev`.

Never commit `.env`, `.env.local`, a Supabase service-role key, or an email-provider API key.

## Environment Variables

Browser/build environment:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=https://rionapparels.site
VITE_CONTACT_EMAIL=inquiry@rionapparels.site
VITE_CONTACT_PHONE=923338600603
VITE_CONTACT_ADDRESS=Sialkot, Punjab, Pakistan
VITE_CONTACT_HOURS=Monday - Saturday, 09:00 - 18:00 (GMT+5)
VITE_WHATSAPP_NUMBER=923338600603
VITE_FACEBOOK_URL=
VITE_INSTAGRAM_URL=
VITE_LINKEDIN_URL=
```

The repository includes `.env.production` with only the public values required by the deployed
browser build. Keep local overrides in `.env.local`. Never add server credentials or email-provider
keys to either browser environment file.

Supabase Edge Function secrets:

```text
RESEND_API_KEY=re_...
INQUIRY_TO_EMAIL=inquiry@rionapparels.site
INQUIRY_FROM_EMAIL=RION APPARELS <inquiries@your-verified-domain.com>
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://rionapparels.site
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to hosted Supabase Edge
Functions. None of the Edge Function secrets may use a `VITE_` prefix, and the service-role key must
never be added to the website environment.

## Database And Storage

The complete migration is `supabase/migrations/20260809000000_rion_sports_admin.sql`. It creates:

- `categories`, `products`, `inquiries`, and `admin_users`
- Automatic `updated_at` triggers
- Eight initial product categories and eight active, featured product programmes
- RLS policies and the security-definer `is_admin()` authorization function
- Durable inquiry rate limiting and notification-delivery status
- Public `product-images` and `category-images` buckets
- Private `inquiry-attachments` bucket
- Storage policies for public catalog reads and admin-only catalog writes

Apply it with the Supabase CLI after linking the repository:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Alternatively, execute the migration once in the Supabase SQL Editor. Do not disable RLS.

## Admin Account

There is no public registration route.

1. In Supabase Dashboard, open **Authentication > Users** and create the admin user with a strong password.
2. Copy the Auth user UUID.
3. Add the approved account in the SQL Editor:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_UUID', 'admin@rionapparels.site');
```

4. Sign in at `/admin/login`.

The product rows are seeded without image URLs because storage URLs are project-specific. After the
first login, upload the existing catalog photography through **Admin > Products** and category
photography through **Admin > Categories**.

An authenticated user not present in `admin_users` is redirected and all admin database/storage operations are denied by RLS. Password reset links must allow `${SITE_URL}/admin/login` in **Authentication > URL Configuration > Redirect URLs**.

## Inquiry Edge Function

The function at `supabase/functions/submit-inquiry/index.ts` validates the public form, uploads a private attachment, writes the inquiry with the service role, and sends independent Resend notifications to the business and customer.

Values in `.env.local` or `.env.example` are not available to the hosted function. Configure the
function environment with Supabase secrets before deploying.

Set secrets and deploy:

```bash
npx supabase secrets set RESEND_API_KEY=re_...
npx supabase secrets set INQUIRY_TO_EMAIL=inquiry@rionapparels.site
npx supabase secrets set "INQUIRY_FROM_EMAIL=RION APPARELS <inquiries@your-verified-domain.com>"
npx supabase secrets set SITE_URL=https://rionapparels.site
npx supabase functions deploy submit-inquiry
```

Keep JWT verification enabled. Public clients invoke the function with the project anon JWT; only the function has permission to insert inquiries or upload private attachments.

## Resend Setup

1. Add and verify the sending domain in Resend.
2. Create an API key restricted to sending email.
3. Use a sender on that verified domain for `INQUIRY_FROM_EMAIL`.
4. Set `INQUIRY_TO_EMAIL` to the RION APPARELS business inbox.
5. Set the Edge Function secrets and deploy the function.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run check
```

Live Supabase authentication, CRUD, storage, and email delivery require a configured Supabase project and Resend account; local static checks do not substitute for those external integration tests.
