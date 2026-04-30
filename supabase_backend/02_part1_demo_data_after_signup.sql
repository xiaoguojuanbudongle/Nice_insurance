-- Demo data for the Part I based Supabase schema.
--
-- Run order:
-- 1. Run 01_part1_schema_supabase.sql
-- 2. Create these Auth users:
--    customer1@example.com / Password123!
--    customer2@example.com / Password123!
--    employee1@example.com / Password123!
-- 3. Run this file.

-- Promote employee account.
update public.hwl_app_profile
set role = 'employee',
    full_name = 'Emma Johnson',
    phone = '212-555-0198'
where email = 'employee1@example.com';

delete from public.hwl_customer
where email = 'employee1@example.com';

insert into public.hwl_employee (
  emp_id, user_id, emp_fname, emp_lname, email, phone, department, job_title
)
select 501, user_id, 'Emma', 'Johnson', email, '212-555-0198', 'Claims', 'Claims Specialist'
from public.hwl_app_profile
where email = 'employee1@example.com'
on conflict (emp_id) do update
set user_id = excluded.user_id,
    emp_fname = excluded.emp_fname,
    emp_lname = excluded.emp_lname,
    email = excluded.email,
    phone = excluded.phone,
    department = excluded.department,
    job_title = excluded.job_title;

-- Customer profile details.
update public.hwl_app_profile
set full_name = 'Alice Chen',
    phone = '917-555-0101'
where email = 'customer1@example.com';

update public.hwl_customer
set cust_fname = 'Alice',
    cust_lname = 'Chen',
    street = '15 Washington Square N',
    city = 'New York',
    state = 'NY',
    zip_code = '10003',
    gender = 'F',
    marital_status = 'S',
    cust_type = 'B',
    phone = '917-555-0101'
where email = 'customer1@example.com';

update public.hwl_app_profile
set full_name = 'Brian Smith',
    phone = '646-555-0135'
where email = 'customer2@example.com';

update public.hwl_customer
set cust_fname = 'Brian',
    cust_lname = 'Smith',
    street = '721 Broadway',
    city = 'New York',
    state = 'NY',
    zip_code = '10003',
    gender = 'M',
    marital_status = 'M',
    cust_type = 'A',
    phone = '646-555-0135'
where email = 'customer2@example.com';

-- Auto policies.
insert into public.hwl_auto_policy (
  policy_id, cust_id, start_date, end_date, premium, policy_status
)
select 1001, cust_id, date '2026-01-01', date '2026-12-31', 1280.00, 'C'
from public.hwl_customer
where email = 'customer1@example.com'
on conflict (policy_id) do nothing;

insert into public.hwl_auto_policy (
  policy_id, cust_id, start_date, end_date, premium, policy_status
)
select 1002, cust_id, date '2026-03-01', date '2027-02-28', 1450.00, 'C'
from public.hwl_customer
where email = 'customer2@example.com'
on conflict (policy_id) do nothing;

-- Home policy.
insert into public.hwl_home_policy (
  policy_id, cust_id, start_date, end_date, premium, policy_status
)
select 2001, cust_id, date '2026-02-01', date '2027-01-31', 2100.00, 'C'
from public.hwl_customer
where email = 'customer1@example.com'
on conflict (policy_id) do nothing;

-- Vehicles and drivers.
insert into public.hwl_vehicle (vin, policy_id, make_model_year, veh_status)
values
  ('1HGCM82633A004352', 1001, '2021 Honda Accord', 'O'),
  ('5YJ3E1EA7KF317000', 1002, '2022 Tesla Model 3', 'F')
on conflict (vin) do nothing;

insert into public.hwl_driver (license_no, vin, driver_fname, driver_lname, age)
values
  ('NYD1001001', '1HGCM82633A004352', 'Alice', 'Chen', 26),
  ('NYD2001001', '5YJ3E1EA7KF317000', 'Brian', 'Smith', 28)
on conflict (license_no) do nothing;

-- Home details.
insert into public.hwl_home (
  home_id, policy_id, purchase_date, purchase_value, area_sqft, home_type,
  auto_fire_notif, security_system, swimming_pool, basement
)
values (
  3001, 2001, date '2022-06-15', 780000.00, 950, 'C',
  1, 1, null, 0
)
on conflict (home_id) do nothing;

-- Invoices.
insert into public.hwl_auto_invoice (
  invoice_id, policy_id, invoice_date, due_date, amount, invoice_status
)
values
  (4001, 1001, date '2026-04-15', date '2026-05-15', 1280.00, 'unpaid'),
  (4002, 1002, date '2026-03-01', date '2026-04-01', 1450.00, 'overdue')
on conflict (invoice_id) do nothing;

insert into public.hwl_home_invoice (
  invoice_id, policy_id, invoice_date, due_date, amount, invoice_status
)
values
  (5001, 2001, date '2026-04-20', date '2026-05-20', 2100.00, 'paid')
on conflict (invoice_id) do nothing;

insert into public.hwl_home_payment (payment_id, invoice_id, payment_date, pay_method)
values (6001, 5001, date '2026-04-29', 'Credit')
on conflict (payment_id) do nothing;

-- One claim for employee review demo.
insert into public.hwl_claim (
  claim_id, claim_type, auto_policy_id, home_policy_id, cust_id,
  assigned_emp_id, claim_amount, description, claim_status, submitted_at
)
select
  7001, 'auto', 1001, null, c.cust_id,
  501, 3200.00, 'Rear bumper damage after a minor accident.',
  'under_review', timestamptz '2026-04-20 09:30:00-04'
from public.hwl_customer c
where c.email = 'customer1@example.com'
on conflict (claim_id) do nothing;

insert into public.hwl_claim_history (
  history_id, claim_id, claim_status, note, changed_by, changed_at
)
select 8001, 7001, 'submitted', 'Initial demo claim submitted.', p.user_id,
       timestamptz '2026-04-20 09:30:00-04'
from public.hwl_app_profile p
where p.email = 'customer1@example.com'
on conflict (history_id) do nothing;

insert into public.hwl_claim_history (
  history_id, claim_id, claim_status, note, changed_by, changed_at
)
select 8002, 7001, 'under_review', 'Employee opened the claim for review.', p.user_id,
       timestamptz '2026-04-21 14:10:00-04'
from public.hwl_app_profile p
where p.email = 'employee1@example.com'
on conflict (history_id) do nothing;

-- Second lower auto claim so the correlated subquery analysis has a meaningful result.
insert into public.hwl_claim (
  claim_id, claim_type, auto_policy_id, home_policy_id, cust_id,
  assigned_emp_id, claim_amount, description, claim_status, submitted_at
)
select
  7002, 'auto', 1002, null, c.cust_id,
  501, 800.00, 'Windshield replacement claim.',
  'submitted', timestamptz '2026-04-22 11:00:00-04'
from public.hwl_customer c
where c.email = 'customer2@example.com'
on conflict (claim_id) do nothing;
