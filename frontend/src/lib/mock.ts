import type { Claim, Customer, Driver, Home, Invoice, Payment, Policy, Profile, UserRole, Vehicle } from "@/types/database";

const PASSWORD = "Password123!";
const SESSION_KEY = "insureops_mock_session";
const STORE_KEY = "insureops_mock_store";

type MockStore = {
  profiles: Profile[];
  customers: Customer[];
  policies: Policy[];
  vehicles: Vehicle[];
  drivers: Driver[];
  homes: Home[];
  claims: Claim[];
  invoices: Invoice[];
  payments: Payment[];
};

const now = "2026-04-29T12:00:00.000Z";

const seedStore: MockStore = {
  profiles: [
    { id: "profile-customer-1", role: "customer", full_name: "Customer One", email: "customer1@example.com", phone: "555-0101", created_at: now },
    { id: "profile-customer-2", role: "customer", full_name: "Customer Two", email: "customer2@example.com", phone: "555-0102", created_at: now },
    { id: "profile-employee-1", role: "employee", full_name: "Employee One", email: "employee1@example.com", phone: "555-0201", created_at: now }
  ],
  vehicles: [
    {
      vehicle_id: "vehicle-1",
      policy_id: "policy-auto-1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      status: "Owned",
      display: "Toyota Camry 2022"
    },
    {
      vehicle_id: "vehicle-2",
      policy_id: "policy-auto-2",
      vin: "2FMPK4J92MBA12345",
      make: "Ford",
      model: "Edge",
      year: 2021,
      status: "Financed",
      display: "Ford Edge 2021"
    }
  ],
  drivers: [
    {
      license_no: "D10001",
      vin: "1HGCM82633A004352",
      full_name: "Customer One",
      age: 35
    },
    {
      license_no: "D10002",
      vin: "2FMPK4J92MBA12345",
      full_name: "Customer Two",
      age: 38
    }
  ],
  homes: [
    {
      home_id: "home-1",
      policy_id: "policy-home-1",
      purchase_date: "2020-06-01",
      purchase_value: 420000,
      area_sq_ft: 1850,
      home_type: "Single Family",
      auto_fire_notification: true,
      home_security_system: true,
      swimming_pool: null,
      basement: true
    }
  ],
  customers: [
    {
      customer_id: "customer-1",
      user_id: "profile-customer-1",
      first_name: "Customer",
      last_name: "One",
      full_name: "Customer One",
      email: "customer1@example.com",
      phone: "555-0101",
      street: "100 Market Street",
      city: "San Francisco",
      state: "CA",
      zip_code: "94105",
      address: "100 Market Street, San Francisco, CA",
      gender: "F",
      marital_status: "S",
      cust_type: "B",
      date_of_birth: "1991-03-10",
      created_at: now
    },
    {
      customer_id: "customer-2",
      user_id: "profile-customer-2",
      first_name: "Customer",
      last_name: "Two",
      full_name: "Customer Two",
      email: "customer2@example.com",
      phone: "555-0102",
      street: "88 Lake Avenue",
      city: "Austin",
      state: "TX",
      zip_code: "78701",
      address: "88 Lake Avenue, Austin, TX",
      gender: "M",
      marital_status: "M",
      cust_type: "A",
      date_of_birth: "1987-09-22",
      created_at: now
    }
  ],
  policies: [
    {
      policy_id: "policy-auto-1",
      source: "auto",
      customer_id: "customer-1",
      product_id: "product-auto",
      policy_number: "AUTO-1001",
      policy_type: "auto",
      status: "active",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      premium_amount: 1280,
      coverage_amount: 75000,
      created_at: now,
      insurance_products: { product_name: "Safe Driver Auto" },
      customers: { full_name: "Customer One", email: "customer1@example.com" }
    },
    {
      policy_id: "policy-home-1",
      source: "home",
      customer_id: "customer-1",
      product_id: "product-home",
      policy_number: "HOME-2101",
      policy_type: "home",
      status: "active",
      start_date: "2026-02-01",
      end_date: "2027-01-31",
      premium_amount: 1850,
      coverage_amount: 350000,
      created_at: now,
      insurance_products: { product_name: "Home Shield" },
      customers: { full_name: "Customer One", email: "customer1@example.com" }
    },
    {
      policy_id: "policy-auto-2",
      source: "auto",
      customer_id: "customer-2",
      product_id: "product-auto",
      policy_number: "AUTO-1002",
      policy_type: "auto",
      status: "pending",
      start_date: "2026-05-01",
      end_date: "2027-04-30",
      premium_amount: 990,
      coverage_amount: 60000,
      created_at: now,
      insurance_products: { product_name: "Safe Driver Auto" },
      customers: { full_name: "Customer Two", email: "customer2@example.com" }
    }
  ],
  claims: [
    {
      claim_id: "claim-1",
      policy_id: "policy-auto-1",
      customer_id: "customer-1",
      assigned_employee_id: "employee-1",
      claim_number: "CLM-5001",
      claim_amount: 2400,
      description: "Rear bumper damage after a minor collision.",
      status: "submitted",
      submitted_at: "2026-04-12T10:00:00.000Z",
      updated_at: "2026-04-12T10:00:00.000Z",
      policies: { policy_number: "AUTO-1001", policy_type: "auto" },
      customers: { full_name: "Customer One", email: "customer1@example.com" }
    },
    {
      claim_id: "claim-2",
      policy_id: "policy-auto-2",
      customer_id: "customer-2",
      assigned_employee_id: "employee-1",
      claim_number: "CLM-5002",
      claim_amount: 7600,
      description: "Windshield and hood damage.",
      status: "under_review",
      submitted_at: "2026-04-15T14:30:00.000Z",
      updated_at: "2026-04-16T09:15:00.000Z",
      policies: { policy_number: "AUTO-1002", policy_type: "auto" },
      customers: { full_name: "Customer Two", email: "customer2@example.com" }
    }
  ],
  invoices: [
    {
      invoice_id: "invoice-1",
      source: "auto",
      policy_id: "policy-auto-1",
      customer_id: "customer-1",
      invoice_number: "INV-3001",
      amount: 320,
      status: "unpaid",
      due_date: "2026-05-15",
      created_at: now,
      policies: { policy_number: "AUTO-1001" },
      customers: { full_name: "Customer One", email: "customer1@example.com" }
    },
    {
      invoice_id: "invoice-2",
      source: "auto",
      policy_id: "policy-auto-2",
      customer_id: "customer-2",
      invoice_number: "INV-3002",
      amount: 250,
      status: "overdue",
      due_date: "2026-04-10",
      created_at: now,
      policies: { policy_number: "AUTO-1002" },
      customers: { full_name: "Customer Two", email: "customer2@example.com" }
    }
  ],
  payments: [
    {
      payment_id: "payment-1",
      source: "auto",
      invoice_id: "invoice-paid-1",
      customer_id: "customer-1",
      amount: 320,
      payment_date: "2026-03-15T09:00:00.000Z",
      method: "Credit",
      status: "completed"
    }
  ]
};

function readStore(): MockStore {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(seedStore));
    return structuredClone(seedStore);
  }

  const parsed = JSON.parse(raw) as Partial<MockStore>;
  const store: MockStore = {
    profiles: parsed.profiles ?? seedStore.profiles,
    customers: parsed.customers ?? seedStore.customers,
    policies: parsed.policies ?? seedStore.policies,
    vehicles: parsed.vehicles ?? seedStore.vehicles,
    drivers: parsed.drivers ?? seedStore.drivers,
    homes: parsed.homes ?? seedStore.homes,
    claims: parsed.claims ?? seedStore.claims,
    invoices: parsed.invoices ?? seedStore.invoices,
    payments: parsed.payments ?? seedStore.payments
  };

  localStorage.setItem(STORE_KEY, JSON.stringify(store));
  return store;
}

function writeStore(store: MockStore) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function currentProfile(store = readStore()) {
  const email = localStorage.getItem(SESSION_KEY);
  return store.profiles.find((profile) => profile.email === email) ?? null;
}

function currentCustomer(store = readStore()) {
  const profile = currentProfile(store);
  return profile ? store.customers.find((customer) => customer.user_id === profile.id) ?? null : null;
}

function requireProfile() {
  const profile = currentProfile();
  if (!profile) throw new Error("Please sign in with a demo account first.");
  return profile;
}

function attachPolicyInfo(store: MockStore, claim: Claim): Claim {
  const policy = store.policies.find((row) => row.policy_id === claim.policy_id);
  const customer = store.customers.find((row) => row.customer_id === claim.customer_id);
  return {
    ...claim,
    policies: policy ? { policy_number: policy.policy_number, policy_type: policy.policy_type } : claim.policies,
    customers: customer ? { full_name: customer.full_name, email: customer.email } : claim.customers
  };
}

export async function mockSignIn(email: string, password: string) {
  const store = readStore();
  const profile = store.profiles.find((row) => row.email?.toLowerCase() === email.toLowerCase());
  if (!profile || password !== PASSWORD) throw new Error("Invalid mock account. Use Password123! for demo accounts.");
  localStorage.setItem(SESSION_KEY, profile.email ?? email);
  return profile;
}

export async function mockRegister(fullName: string, email: string, password: string) {
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const store = readStore();
  if (store.profiles.some((row) => row.email?.toLowerCase() === email.toLowerCase())) {
    throw new Error("This mock email already exists. Try signing in instead.");
  }

  const profile: Profile = {
    id: `profile-${crypto.randomUUID()}`,
    role: "customer",
    full_name: fullName,
    email,
    phone: null,
    created_at: new Date().toISOString()
  };
  const customer: Customer = {
    customer_id: `customer-${crypto.randomUUID()}`,
    user_id: profile.id,
    first_name: fullName.split(" ")[0] ?? fullName,
    last_name: fullName.split(" ").slice(1).join(" "),
    full_name: fullName,
    email,
    phone: null,
    street: null,
    city: null,
    state: null,
    zip_code: null,
    address: null,
    gender: null,
    marital_status: null,
    cust_type: "A",
    date_of_birth: null,
    created_at: profile.created_at
  };

  store.profiles.push(profile);
  store.customers.push(customer);
  writeStore(store);
  localStorage.setItem(SESSION_KEY, email);
  return profile;
}

export async function mockSignOut() {
  localStorage.removeItem(SESSION_KEY);
}

export async function mockResetDemoData() {
  localStorage.setItem(STORE_KEY, JSON.stringify(seedStore));
}

export async function mockGetCurrentProfile() {
  return currentProfile();
}

export async function mockUpdateProfile(update: Pick<Profile, "id" | "full_name" | "phone">) {
  const store = readStore();
  const profile = store.profiles.find((row) => row.id === update.id);
  if (!profile) throw new Error("Profile not found.");
  profile.full_name = update.full_name;
  profile.phone = update.phone;

  const customer = store.customers.find((row) => row.user_id === update.id);
  if (customer) {
    customer.full_name = update.full_name ?? customer.full_name;
    customer.phone = update.phone;
  }

  writeStore(store);
}

export async function mockUpdateCustomer(update: Customer) {
  const store = readStore();
  const index = store.customers.findIndex((customer) => customer.customer_id === update.customer_id);
  if (index === -1) throw new Error("Customer not found.");
  store.customers[index] = update;
  writeStore(store);
}

export async function mockListCustomerPolicies() {
  const store = readStore();
  const customer = currentCustomer(store);
  return customer ? store.policies.filter((row) => row.customer_id === customer.customer_id) : [];
}

export async function mockListEmployeePolicies() {
  requireProfile();
  return readStore().policies;
}

export async function mockListCustomerClaims() {
  const store = readStore();
  const customer = currentCustomer(store);
  return customer ? store.claims.filter((row) => row.customer_id === customer.customer_id).map((row) => attachPolicyInfo(store, row)) : [];
}

export async function mockListEmployeeClaims() {
  const store = readStore();
  requireProfile();
  return store.claims.map((row) => attachPolicyInfo(store, row));
}

export async function mockListInvoices(scope: UserRole) {
  const store = readStore();
  if (scope === "employee") return store.invoices;
  const customer = currentCustomer(store);
  return customer ? store.invoices.filter((row) => row.customer_id === customer.customer_id) : [];
}

export async function mockListPayments() {
  const store = readStore();
  const customer = currentCustomer(store);
  return customer ? store.payments.filter((row) => row.customer_id === customer.customer_id) : [];
}

export async function mockListCustomers() {
  requireProfile();
  return readStore().customers;
}

export async function mockListVehicles() {
  const store = readStore();
  const policies = await mockListCustomerPolicies();
  const policyIds = new Set(policies.filter((policy) => policy.source === "auto").map((policy) => policy.policy_id));
  return store.vehicles
    .filter((vehicle) => policyIds.has(vehicle.policy_id))
    .map((vehicle) => ({
      ...vehicle,
      drivers: store.drivers.filter((driver) => driver.vin === vehicle.vin)
    }));
}

export async function mockListHomes() {
  const store = readStore();
  const policies = await mockListCustomerPolicies();
  const policyIds = new Set(policies.filter((policy) => policy.source === "home").map((policy) => policy.policy_id));
  return store.homes.filter((home) => policyIds.has(home.policy_id));
}

export async function mockRpc(functionName: string, params?: Record<string, unknown>) {
  const store = readStore();

  if (functionName === "submit_claim" || functionName === "submit_auto_claim" || functionName === "submit_home_claim") {
    const policy = store.policies.find((row) => row.policy_id === params?.p_policy_id);
    if (!policy) throw new Error("Policy not found.");
    const claim: Claim = {
      claim_id: `claim-${crypto.randomUUID()}`,
      policy_source: policy.source,
      policy_id: policy.policy_id,
      customer_id: policy.customer_id ?? "",
      assigned_employee_id: null,
      claim_number: `CLM-${5000 + store.claims.length + 1}`,
      claim_amount: Number(params?.p_claim_amount ?? 0),
      description: String(params?.p_description ?? ""),
      status: "submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.claims.unshift(attachPolicyInfo(store, claim));
    writeStore(store);
    return claim;
  }

  if (functionName === "review_claim" || ["start_claim_review", "approve_claim", "reject_claim"].includes(functionName)) {
    const claim = store.claims.find((row) => row.claim_id === params?.p_claim_id);
    if (!claim) throw new Error("Claim not found.");
    const statusByFunction = {
      start_claim_review: "under_review",
      approve_claim: "approved",
      reject_claim: "rejected"
    } as const;
    const nextStatus =
      functionName === "review_claim"
        ? String(params?.p_new_status ?? "under_review")
        : statusByFunction[functionName as keyof typeof statusByFunction];
    claim.status = nextStatus as Claim["status"];
    claim.updated_at = new Date().toISOString();
    writeStore(store);
    return claim;
  }

  if (functionName === "pay_invoice" || functionName === "pay_auto_invoice" || functionName === "pay_home_invoice") {
    const invoice = store.invoices.find((row) => row.invoice_id === params?.p_invoice_id);
    if (!invoice) throw new Error("Invoice not found.");
    invoice.status = "paid";
    store.payments.unshift({
      payment_id: `payment-${crypto.randomUUID()}`,
      invoice_id: invoice.invoice_id,
      customer_id: invoice.customer_id,
      amount: Number(params?.p_amount ?? invoice.amount),
      payment_date: new Date().toISOString(),
      method: String(params?.p_pay_method ?? params?.p_method ?? "Credit") as Payment["method"],
      status: "completed"
    });
    writeStore(store);
    return invoice;
  }

  if (functionName === "generate_invoice") {
    const policy = store.policies.find((row) => row.policy_id === params?.p_policy_id);
    if (!policy) throw new Error("Policy not found.");
    const invoice: Invoice = {
      invoice_id: `invoice-${crypto.randomUUID()}`,
      source: policy.source,
      policy_id: policy.policy_id,
      customer_id: policy.customer_id ?? "",
      invoice_number: `INV-${3000 + store.invoices.length + 1}`,
      amount: policy.premium_amount,
      status: "unpaid",
      due_date: String(params?.p_due_date ?? new Date().toISOString().slice(0, 10)),
      created_at: new Date().toISOString(),
      policies: { policy_number: policy.policy_number },
      customers: policy.customers
    };
    store.invoices.unshift(invoice);
    writeStore(store);
    return invoice;
  }

  if (functionName.startsWith("analytics_")) {
    return mockAnalytics(functionName, store);
  }

  throw new Error(`Mock RPC not implemented: ${functionName}`);
}

function mockAnalytics(functionName: string, store: MockStore) {
  const unpaid = store.invoices.filter((invoice) => invoice.status !== "paid");

  const rows: Record<string, Record<string, unknown>[]> = {
    analytics_policies_with_customer_product: store.policies.map((policy) => ({
      policy_number: policy.policy_number,
      customer: policy.customers?.full_name,
      product: policy.insurance_products?.product_name,
      premium: policy.premium_amount,
      status: policy.status
    })),
    analytics_customers_with_unpaid_invoices: unpaid.map((invoice) => ({
      customer: invoice.customers?.full_name,
      invoice_number: invoice.invoice_number,
      amount: invoice.amount,
      due_date: invoice.due_date
    })),
    analytics_claims_above_average: store.claims.filter((claim) => claim.claim_amount > 4500).map((claim) => ({
      claim_number: claim.claim_number,
      customer: claim.customers?.full_name,
      amount: claim.claim_amount,
      status: claim.status
    })),
    analytics_auto_home_policy_union: store.policies.filter((policy) => ["auto", "home"].includes(policy.policy_type)).map((policy) => ({
      policy_type: policy.policy_type,
      policy_number: policy.policy_number,
      customer: policy.customers?.full_name
    })),
    analytics_monthly_claim_summary: [{ month: "2026-04", claim_count: store.claims.length, total_claim_amount: store.claims.reduce((sum, claim) => sum + claim.claim_amount, 0) }],
    analytics_top_customers_by_premium: store.customers.map((customer) => ({
      customer: customer.full_name,
      total_premium: store.policies.filter((policy) => policy.customer_id === customer.customer_id).reduce((sum, policy) => sum + policy.premium_amount, 0)
    })).sort((a, b) => Number(b.total_premium) - Number(a.total_premium)).slice(0, 5)
  };

  return rows[functionName] ?? [];
}
