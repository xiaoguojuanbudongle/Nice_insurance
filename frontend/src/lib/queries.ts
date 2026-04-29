import {
  mockGetCurrentProfile,
  mockListCustomerClaims,
  mockListCustomerPolicies,
  mockListCustomers,
  mockListEmployeeClaims,
  mockListEmployeePolicies,
  mockListHomes,
  mockListInvoices,
  mockListPayments,
  mockListVehicles
} from "@/lib/mock";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Claim, Customer, Driver, Home, Invoice, Payment, Policy, Profile, Vehicle } from "@/types/database";

type Row = Record<string, unknown>;

function str(row: Row, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = row[key];
    if (value !== null && value !== undefined && value !== "") return String(value);
  }
  return fallback;
}

function num(row: Row, keys: string[], fallback = 0) {
  const value = str(row, keys);
  return value ? Number(value) : fallback;
}

function nestedName(value: unknown, fallback = "-") {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Row;
  return str(row, ["full_name", "customer_name", "name", "email"], fallback);
}

function normalizeCustomer(row: Row): Customer {
  const firstName = str(row, ["cust_fname"]);
  const lastName = str(row, ["cust_lname"]);
  const address = [str(row, ["street"]), str(row, ["city"]), str(row, ["state"]), str(row, ["zip_code"])]
    .filter(Boolean)
    .join(", ");

  return {
    customer_id: str(row, ["cust_id"]),
    user_id: str(row, ["user_id"]),
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim() || str(row, ["full_name"], "Customer"),
    email: str(row, ["email"]),
    phone: str(row, ["phone"]) || null,
    street: str(row, ["street"]) || null,
    city: str(row, ["city"]) || null,
    state: str(row, ["state"]) || null,
    zip_code: str(row, ["zip_code"]) || null,
    address: address || null,
    gender: str(row, ["gender"]) || null,
    marital_status: str(row, ["marital_status"]) || null,
    cust_type: str(row, ["cust_type"]) || null,
    date_of_birth: str(row, ["date_of_birth", "dob"]) || null,
    created_at: str(row, ["created_at"], new Date().toISOString())
  };
}

function normalizePolicy(row: Row, source: "auto" | "home"): Policy {
  const numberPrefix = source === "auto" ? "AUTO" : "HOME";
  const policyId = str(row, ["policy_id"]);
  const rawStatus = str(row, ["policy_status"], "C");

  return {
    policy_id: policyId,
    source,
    customer_id: str(row, ["cust_id"]),
    product_id: source,
    policy_number: str(row, ["policy_number", `${source}_policy_number`], `${numberPrefix}-${policyId.slice(0, 8)}`),
    policy_type: source,
    status: rawStatus === "E" ? "expired" : rawStatus === "C" ? "current" : rawStatus,
    start_date: str(row, ["start_date"]),
    end_date: str(row, ["end_date"]),
    premium_amount: num(row, ["premium"]),
    coverage_amount: num(row, ["coverage_amount", "insured_value", "home_purchase_value"], 0),
    created_at: str(row, ["created_at"], new Date().toISOString()),
    insurance_products: { product_name: source === "auto" ? "Auto Insurance" : "Home Insurance" },
    customers: { full_name: nestedName(row.hwl_customer ?? row.customer), email: "" }
  };
}

function normalizeClaim(row: Row): Claim {
  const source = str(row, ["claim_type"], "auto") === "home" ? "home" : "auto";
  const claimId = str(row, ["claim_id"]);

  return {
    claim_id: claimId,
    policy_source: source,
    policy_id: str(row, ["auto_policy_id", "home_policy_id"]),
    customer_id: str(row, ["cust_id"]),
    assigned_employee_id: str(row, ["assigned_emp_id"]) || null,
    claim_number: str(row, ["claim_number"], `CLM-${claimId.slice(0, 8)}`),
    claim_amount: num(row, ["claim_amount", "amount"]),
    description: str(row, ["description", "claim_description"]) || null,
    status: str(row, ["claim_status"], "submitted") as Claim["status"],
    submitted_at: str(row, ["submitted_at", "created_at"], new Date().toISOString()),
    updated_at: str(row, ["updated_at"], new Date().toISOString()),
    policies: {
      policy_number: str(row, ["policy_number"], str(row, ["auto_policy_id", "home_policy_id"]).slice(0, 12)),
      policy_type: source
    },
    customers: { full_name: nestedName(row.hwl_customer ?? row.customer), email: "" }
  };
}

function normalizeInvoice(row: Row, source: "auto" | "home"): Invoice {
  const invoiceId = str(row, ["invoice_id"]);
  const policyId = str(row, ["policy_id"]);

  return {
    invoice_id: invoiceId,
    source,
    policy_id: policyId,
    customer_id: str(row, ["cust_id"]),
    invoice_number: str(row, ["invoice_number"], `INV-${invoiceId.slice(0, 8)}`),
    amount: num(row, ["amount", "invoice_amount"]),
    status: str(row, ["invoice_status"], "unpaid") as Invoice["status"],
    due_date: str(row, ["due_date"]),
    created_at: str(row, ["invoice_date", "created_at"], new Date().toISOString()),
    policies: { policy_number: str(row, ["policy_number"], policyId.slice(0, 12)) },
    customers: { full_name: nestedName(row.hwl_customer ?? row.customer), email: "" }
  };
}

function normalizePayment(row: Row, source: "auto" | "home"): Payment {
  const paymentId = str(row, ["payment_id"]);

  return {
    payment_id: paymentId,
    source,
    invoice_id: str(row, ["invoice_id"]),
    customer_id: str(row, ["cust_id"]),
    amount: num(row, ["amount", "payment_amount"]),
    payment_date: str(row, ["payment_date", "created_at"], new Date().toISOString()),
    method: str(row, ["pay_method", "method"], "Credit") as Payment["method"],
    status: str(row, ["status", "payment_status"], "completed") as Payment["status"]
  };
}

function normalizeVehicle(row: Row): Vehicle {
  const display = str(row, ["make_model_year"]);
  const parts = display.split(/\s+/);
  return {
    vehicle_id: str(row, ["vin"]),
    policy_id: str(row, ["policy_id"]),
    vin: str(row, ["vin"]),
    make: parts[0] ?? "",
    model: parts.slice(1, -1).join(" "),
    year: Number(parts.at(-1)) || 0,
    status: str(row, ["veh_status"]) || null,
    display
  };
}

function normalizeDriver(row: Row): Driver {
  const firstName = str(row, ["driver_fname"]);
  const lastName = str(row, ["driver_lname"]);

  return {
    license_no: str(row, ["license_no"]),
    vin: str(row, ["vin"]),
    full_name: `${firstName} ${lastName}`.trim(),
    age: num(row, ["age"])
  };
}

function normalizeHome(row: Row): Home {
  return {
    home_id: str(row, ["home_id", "id"]),
    policy_id: str(row, ["home_policy_id", "policy_id"]),
    purchase_date: str(row, ["purchase_date", "home_purchase_date"]) || null,
    purchase_value: num(row, ["purchase_value"]),
    area_sq_ft: num(row, ["area_sqft"]),
    home_type: str(row, ["home_type"]) || null,
    auto_fire_notification: Boolean(row.auto_fire_notif ?? false),
    home_security_system: Boolean(row.security_system ?? false),
    swimming_pool: str(row, ["swimming_pool", "pool"]) || null,
    basement: Boolean(row.basement ?? false)
  };
}

async function selectAll(table: string) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return (data ?? []) as Row[];
}

async function selectTwoTables<T>(left: string, right: string, mapLeft: (row: Row) => T, mapRight: (row: Row) => T) {
  const [leftRows, rightRows] = await Promise.all([selectAll(left), selectAll(right)]);
  return [...leftRows.map(mapLeft), ...rightRows.map(mapRight)];
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!hasSupabaseEnv) return mockGetCurrentProfile();

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult.user) return null;

  const { data, error } = await supabase.from("hwl_app_profile").select("*").eq("user_id", userResult.user.id).single();
  if (error) throw error;

  const row = data as Row;
  return {
    id: str(row, ["user_id"], userResult.user.id),
    role: str(row, ["role"], "customer") as Profile["role"],
    full_name: str(row, ["full_name", "name"], userResult.user.email ?? ""),
    email: str(row, ["email"], userResult.user.email ?? ""),
    phone: str(row, ["phone", "phone_number"]) || null,
    created_at: str(row, ["created_at"], new Date().toISOString())
  };
}

export async function listCustomerPolicies() {
  if (!hasSupabaseEnv) return mockListCustomerPolicies();
  return selectTwoTables("hwl_auto_policy", "hwl_home_policy", (row) => normalizePolicy(row, "auto"), (row) => normalizePolicy(row, "home"));
}

export async function listCustomerAutoPolicies() {
  const policies = await listCustomerPolicies();
  return policies.filter((policy) => policy.source === "auto");
}

export async function listCustomerHomePolicies() {
  const policies = await listCustomerPolicies();
  return policies.filter((policy) => policy.source === "home");
}

export async function listEmployeePolicies() {
  if (!hasSupabaseEnv) return mockListEmployeePolicies();
  return listCustomerPolicies();
}

export async function listEmployeeAutoPolicies() {
  const policies = await listEmployeePolicies();
  return policies.filter((policy) => policy.source === "auto");
}

export async function listEmployeeHomePolicies() {
  const policies = await listEmployeePolicies();
  return policies.filter((policy) => policy.source === "home");
}

export async function listCustomerClaims() {
  if (!hasSupabaseEnv) return mockListCustomerClaims();
  return (await selectAll("hwl_claim")).map(normalizeClaim);
}

export async function listEmployeeClaims() {
  if (!hasSupabaseEnv) return mockListEmployeeClaims();
  return listCustomerClaims();
}

export async function listInvoices(scope: "customer" | "employee") {
  if (!hasSupabaseEnv) return mockListInvoices(scope);
  return selectTwoTables("hwl_auto_invoice", "hwl_home_invoice", (row) => normalizeInvoice(row, "auto"), (row) => normalizeInvoice(row, "home"));
}

export async function listPayments() {
  if (!hasSupabaseEnv) return mockListPayments();
  return selectTwoTables("hwl_auto_payment", "hwl_home_payment", (row) => normalizePayment(row, "auto"), (row) => normalizePayment(row, "home"));
}

export async function listCustomers() {
  if (!hasSupabaseEnv) return mockListCustomers();
  return (await selectAll("hwl_customer")).map(normalizeCustomer);
}

export async function getCurrentCustomer() {
  if (!hasSupabaseEnv) {
    const profile = await mockGetCurrentProfile();
    const customers = await mockListCustomers();
    return customers.find((customer) => customer.user_id === profile?.id) ?? null;
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult.user) return null;

  const { data, error } = await supabase.from("hwl_customer").select("*").eq("user_id", userResult.user.id).single();
  if (error) throw error;
  return normalizeCustomer(data as Row);
}

export async function listVehicles() {
  if (!hasSupabaseEnv) return mockListVehicles();
  const [vehicles, drivers] = await Promise.all([selectAll("hwl_vehicle"), selectAll("hwl_driver")]);
  const normalizedDrivers = drivers.map(normalizeDriver);
  return vehicles.map((row) => {
    const vehicle = normalizeVehicle(row);
    return {
      ...vehicle,
      drivers: normalizedDrivers.filter((driver) => driver.vin === vehicle.vin)
    };
  });
}

export async function listHomes() {
  if (!hasSupabaseEnv) return mockListHomes();
  return (await selectAll("hwl_home")).map(normalizeHome);
}
