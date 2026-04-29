# Insurance Web Application

Next.js + Supabase frontend scaffold for the insurance application handoff spec.

The current backend contract uses the converted Part I Supabase tables:
`hwl_app_profile`, `hwl_customer`, `hwl_employee`, `hwl_auto_policy`, `hwl_home_policy`,
`hwl_vehicle`, `hwl_driver`, `hwl_home`, `hwl_claim`, `hwl_auto_invoice`,
`hwl_home_invoice`, `hwl_auto_payment`, and `hwl_home_payment`.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Run `npm install`.
4. Run `npm run dev`.

The frontend only uses the Supabase anon key. Role and row-level permissions are enforced by Supabase RLS.
