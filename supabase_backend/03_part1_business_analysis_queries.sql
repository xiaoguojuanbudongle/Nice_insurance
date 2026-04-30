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
