# Supabase Backend

This folder contains the Supabase/PostgreSQL backend for the NICE Insurance web application.

The backend is based on the Part I Oracle `HWL_*` schema, converted to PostgreSQL and extended for Part II web requirements:

- Supabase Auth mapping
- customer / employee roles
- Row Level Security (RLS)
- claim workflow
- payment RPC functions
- demo data
- 6 required business analysis SQL queries

## Files

| File | Purpose |
|---|---|
| `01_part1_schema_supabase.sql` | Creates the converted `hwl_*` tables, RLS policies, triggers, helper functions, and RPC business functions. |
| `02_part1_demo_data_after_signup.sql` | Inserts demo customers, employee, policies, invoices, payments, vehicles, home data, and claims after Auth users are created. |
| `03_part1_business_analysis_queries.sql` | Contains the 6 SQL queries required for the project report. |

## Setup Order

1. Create a Supabase project.
2. Run `01_part1_schema_supabase.sql` in Supabase SQL Editor.
3. Create these users in Supabase Authentication:

```text
customer1@example.com / Password123!
customer2@example.com / Password123!
employee1@example.com / Password123!
```

4. Run `02_part1_demo_data_after_signup.sql`.
5. Use `03_part1_business_analysis_queries.sql` for the report and analytics page.

## Frontend RPC Functions

Frontend can call these Supabase RPC functions:

```text
submit_auto_claim(p_policy_id, p_claim_amount, p_description)
submit_home_claim(p_policy_id, p_claim_amount, p_description)
review_claim(p_claim_id, p_new_status, p_note)
pay_auto_invoice(p_invoice_id, p_pay_method)
pay_home_invoice(p_invoice_id, p_pay_method)
```

Allowed claim statuses:

```text
under_review
approved
rejected
paid
```

Allowed payment methods:

```text
PayPal
Credit
Debit
Check
```

## Security Notes

- Do not commit Supabase database passwords.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.
- Frontend should only use the public anon/publishable key.
- RLS enforces real authorization in the database.
- RPC functions handle multi-step operations such as claim submission and invoice payment.

