-- Business Analysis SQL Queries based on the converted Part I HWL schema.

-- Q1. Table joins with at least 3 tables
-- Business purpose: Which customers have current auto policies, insured vehicles,
-- and registered drivers?
select
  c.cust_fname || ' ' || c.cust_lname as customer_name,
  ap.policy_id as auto_policy_id,
  v.vin as vehicle_vin,
  v.make_model_year as vehicle,
  d.driver_fname || ' ' || d.driver_lname as driver_name,
  d.age as driver_age,
  to_char(ap.premium, 'FM$999,999,990.00') as annual_premium
from public.hwl_customer c
join public.hwl_auto_policy ap on ap.cust_id = c.cust_id
join public.hwl_vehicle v on v.policy_id = ap.policy_id
join public.hwl_driver d on d.vin = v.vin
where ap.policy_status = 'C'
order by ap.premium desc, customer_name;

-- Q2. Multi-row subquery
-- Business purpose: Which customers have unpaid or overdue auto invoices?
select
  c.cust_fname || ' ' || c.cust_lname as customer_name,
  c.email as customer_email,
  count(ai.invoice_id) as open_invoice_count,
  to_char(sum(ai.amount), 'FM$999,999,990.00') as total_open_amount
from public.hwl_customer c
join public.hwl_auto_policy ap on ap.cust_id = c.cust_id
join public.hwl_auto_invoice ai on ai.policy_id = ap.policy_id
where c.cust_id in (
  select ap2.cust_id
  from public.hwl_auto_policy ap2
  join public.hwl_auto_invoice ai2 on ai2.policy_id = ap2.policy_id
  where ai2.invoice_status in ('unpaid', 'overdue')
)
and ai.invoice_status in ('unpaid', 'overdue')
group by c.cust_id, c.cust_fname, c.cust_lname, c.email
order by sum(ai.amount) desc;

-- Q3. Correlated subquery
-- Business purpose: Which claims are above the average claim amount for the same
-- claim type?
select
  cl.claim_id as claim_id,
  c.cust_fname || ' ' || c.cust_lname as customer_name,
  initcap(cl.claim_type) as claim_type,
  to_char(cl.claim_amount, 'FM$999,999,990.00') as claim_amount,
  cl.claim_status as claim_status
from public.hwl_claim cl
join public.hwl_customer c on c.cust_id = cl.cust_id
where cl.claim_amount > (
  select avg(cl2.claim_amount)
  from public.hwl_claim cl2
  where cl2.claim_type = cl.claim_type
)
order by cl.claim_amount desc;

-- Q4. SET operator query
-- Business purpose: Which policies need employee attention because they have
-- either an open invoice or an active claim?
select
  'AUTO-' || ap.policy_id as policy_key,
  'Open Auto Invoice' as attention_reason
from public.hwl_auto_policy ap
where ap.policy_id in (
  select policy_id
  from public.hwl_auto_invoice
  where invoice_status in ('unpaid', 'overdue')
)
union
select
  'AUTO-' || cl.auto_policy_id as policy_key,
  'Auto Claim Exists' as attention_reason
from public.hwl_claim cl
where cl.claim_type = 'auto'
union
select
  'HOME-' || cl.home_policy_id as policy_key,
  'Home Claim Exists' as attention_reason
from public.hwl_claim cl
where cl.claim_type = 'home'
order by policy_key, attention_reason;

-- Q5. WITH clause
-- Business purpose: What is the monthly claim count and claim amount summary?
with monthly_claims as (
  select
    date_trunc('month', submitted_at)::date as claim_month,
    count(*) as claim_count,
    sum(claim_amount) as total_claim_amount,
    avg(claim_amount) as average_claim_amount
  from public.hwl_claim
  group by date_trunc('month', submitted_at)::date
)
select
  to_char(claim_month, 'YYYY-MM') as claim_month,
  claim_count as claim_count,
  to_char(total_claim_amount, 'FM$999,999,990.00') as total_claim_amount,
  to_char(average_claim_amount, 'FM$999,999,990.00') as average_claim_amount
from monthly_claims
order by claim_month desc;

-- Q6. TOP-N query
-- Business purpose: Who are the top 5 customers by total policy premium across
-- both auto and home insurance?
select
  c.cust_fname || ' ' || c.cust_lname as customer_name,
  c.email as customer_email,
  count(*) as policy_count,
  to_char(sum(policy_premium), 'FM$999,999,990.00') as total_annual_premium
from public.hwl_customer c
join (
  select cust_id, premium as policy_premium
  from public.hwl_auto_policy
  union all
  select cust_id, premium as policy_premium
  from public.hwl_home_policy
) policies on policies.cust_id = c.cust_id
group by c.cust_id, c.cust_fname, c.cust_lname, c.email
order by sum(policy_premium) desc
limit 5;

-- ============================================================
-- Frontend RPC wrappers for the Employee Analytics page
-- ============================================================

create or replace function public.analytics_policies_with_customer_product()
returns table (
  customer_name text,
  auto_policy_id integer,
  vehicle_vin text,
  vehicle text,
  driver_name text,
  driver_age integer,
  annual_premium text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  select
    (c.cust_fname || ' ' || c.cust_lname)::text as customer_name,
    ap.policy_id as auto_policy_id,
    v.vin::text as vehicle_vin,
    v.make_model_year::text as vehicle,
    (d.driver_fname || ' ' || d.driver_lname)::text as driver_name,
    d.age as driver_age,
    to_char(ap.premium, 'FM$999,999,990.00') as annual_premium
  from public.hwl_customer c
  join public.hwl_auto_policy ap on ap.cust_id = c.cust_id
  join public.hwl_vehicle v on v.policy_id = ap.policy_id
  join public.hwl_driver d on d.vin = v.vin
  where ap.policy_status = 'C'
  order by ap.premium desc, customer_name;
end;
$$;

create or replace function public.analytics_customers_with_unpaid_invoices()
returns table (
  customer_name text,
  customer_email text,
  open_invoice_count bigint,
  total_open_amount text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  select
    (c.cust_fname || ' ' || c.cust_lname)::text as customer_name,
    c.email::text as customer_email,
    count(ai.invoice_id) as open_invoice_count,
    to_char(sum(ai.amount), 'FM$999,999,990.00') as total_open_amount
  from public.hwl_customer c
  join public.hwl_auto_policy ap on ap.cust_id = c.cust_id
  join public.hwl_auto_invoice ai on ai.policy_id = ap.policy_id
  where c.cust_id in (
    select ap2.cust_id
    from public.hwl_auto_policy ap2
    join public.hwl_auto_invoice ai2 on ai2.policy_id = ap2.policy_id
    where ai2.invoice_status in ('unpaid', 'overdue')
  )
  and ai.invoice_status in ('unpaid', 'overdue')
  group by c.cust_id, c.cust_fname, c.cust_lname, c.email
  order by sum(ai.amount) desc;
end;
$$;

create or replace function public.analytics_claims_above_average()
returns table (
  claim_id integer,
  customer_name text,
  claim_type text,
  claim_amount text,
  claim_status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  select
    cl.claim_id as claim_id,
    (c.cust_fname || ' ' || c.cust_lname)::text as customer_name,
    initcap(cl.claim_type)::text as claim_type,
    to_char(cl.claim_amount, 'FM$999,999,990.00') as claim_amount,
    cl.claim_status::text as claim_status
  from public.hwl_claim cl
  join public.hwl_customer c on c.cust_id = cl.cust_id
  where cl.claim_amount > (
    select avg(cl2.claim_amount)
    from public.hwl_claim cl2
    where cl2.claim_type = cl.claim_type
  )
  order by cl.claim_amount desc;
end;
$$;

create or replace function public.analytics_auto_home_policy_union()
returns table (
  policy_key text,
  attention_reason text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  select
    ('AUTO-' || ap.policy_id)::text as policy_key,
    'Open Auto Invoice'::text as attention_reason
  from public.hwl_auto_policy ap
  where ap.policy_id in (
    select policy_id
    from public.hwl_auto_invoice
    where invoice_status in ('unpaid', 'overdue')
  )
  union
  select
    ('AUTO-' || cl.auto_policy_id)::text as policy_key,
    'Auto Claim Exists'::text as attention_reason
  from public.hwl_claim cl
  where cl.claim_type = 'auto'
  union
  select
    ('HOME-' || cl.home_policy_id)::text as policy_key,
    'Home Claim Exists'::text as attention_reason
  from public.hwl_claim cl
  where cl.claim_type = 'home'
  order by policy_key, attention_reason;
end;
$$;

create or replace function public.analytics_monthly_claim_summary()
returns table (
  claim_month text,
  claim_count bigint,
  total_claim_amount text,
  average_claim_amount text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  with monthly_claims as (
    select
      date_trunc('month', submitted_at)::date as claim_month,
      count(*) as claim_count,
      sum(claim_amount) as total_claim_amount,
      avg(claim_amount) as average_claim_amount
    from public.hwl_claim
    group by date_trunc('month', submitted_at)::date
  )
  select
    to_char(mc.claim_month, 'YYYY-MM') as claim_month,
    mc.claim_count as claim_count,
    to_char(mc.total_claim_amount, 'FM$999,999,990.00') as total_claim_amount,
    to_char(mc.average_claim_amount, 'FM$999,999,990.00') as average_claim_amount
  from monthly_claims mc
  order by mc.claim_month desc;
end;
$$;

create or replace function public.analytics_top_customers_by_premium()
returns table (
  customer_name text,
  customer_email text,
  policy_count bigint,
  total_annual_premium text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employee() then
    raise exception 'Employee role required' using errcode = '42501';
  end if;

  return query
  select
    (c.cust_fname || ' ' || c.cust_lname)::text as customer_name,
    c.email::text as customer_email,
    count(*) as policy_count,
    to_char(sum(policy_premium), 'FM$999,999,990.00') as total_annual_premium
  from public.hwl_customer c
  join (
    select cust_id, premium as policy_premium
    from public.hwl_auto_policy
    union all
    select cust_id, premium as policy_premium
    from public.hwl_home_policy
  ) policies on policies.cust_id = c.cust_id
  group by c.cust_id, c.cust_fname, c.cust_lname, c.email
  order by sum(policy_premium) desc
  limit 5;
end;
$$;

grant execute on function public.analytics_policies_with_customer_product() to authenticated;
grant execute on function public.analytics_customers_with_unpaid_invoices() to authenticated;
grant execute on function public.analytics_claims_above_average() to authenticated;
grant execute on function public.analytics_auto_home_policy_union() to authenticated;
grant execute on function public.analytics_monthly_claim_summary() to authenticated;
grant execute on function public.analytics_top_customers_by_premium() to authenticated;
