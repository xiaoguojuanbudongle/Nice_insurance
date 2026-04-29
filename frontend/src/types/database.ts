export type UserRole = "customer" | "employee";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export type Customer = {
  customer_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  address: string | null;
  gender: string | null;
  marital_status: string | null;
  cust_type: string | null;
  date_of_birth: string | null;
  created_at: string;
};

export type Employee = {
  employee_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  job_title: string | null;
  created_at: string;
};

export type InsuranceProduct = {
  product_id: string;
  product_name: string;
  product_type: string;
  description: string | null;
  base_premium: number;
  is_active: boolean;
};

export type Policy = {
  policy_id: string;
  source: "auto" | "home";
  customer_id?: string;
  product_id?: string;
  policy_number: string;
  policy_type: string;
  status: string;
  start_date: string;
  end_date: string;
  premium_amount: number;
  coverage_amount: number;
  created_at?: string;
  insurance_products?: Pick<InsuranceProduct, "product_name"> | null;
  customers?: Pick<Customer, "full_name" | "email"> | null;
};

export type Claim = {
  claim_id: string;
  policy_source?: "auto" | "home";
  policy_id: string;
  customer_id: string;
  assigned_employee_id: string | null;
  claim_number: string;
  claim_amount: number;
  description: string | null;
  status: "submitted" | "under_review" | "approved" | "rejected" | "paid";
  submitted_at: string;
  updated_at: string;
  policies?: Pick<Policy, "policy_number" | "policy_type"> | null;
  customers?: Pick<Customer, "full_name" | "email"> | null;
};

export type Invoice = {
  invoice_id: string;
  source: "auto" | "home";
  policy_id: string;
  customer_id: string;
  invoice_number: string;
  amount: number;
  status: "unpaid" | "paid" | "overdue";
  due_date: string;
  created_at: string;
  policies?: Pick<Policy, "policy_number"> | null;
  customers?: Pick<Customer, "full_name" | "email"> | null;
};

export type Payment = {
  payment_id: string;
  source?: "auto" | "home";
  invoice_id: string;
  customer_id: string;
  amount: number;
  payment_date: string;
  method: "PayPal" | "Credit" | "Debit" | "Check" | "credit_card" | "bank_transfer" | "check" | "cash";
  status: "completed" | "failed" | "pending";
};

export type ClaimHistory = {
  history_id: string;
  claim_id: string;
  status: string;
  note: string | null;
  changed_by: string;
  changed_at: string;
};

export type Vehicle = {
  vehicle_id: string;
  policy_id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string | null;
  display: string;
  drivers?: Driver[];
};

export type Driver = {
  license_no: string;
  vin: string;
  full_name: string;
  age: number;
};

export type Home = {
  home_id: string;
  policy_id: string;
  purchase_date: string | null;
  purchase_value: number;
  area_sq_ft: number;
  home_type: string | null;
  auto_fire_notification: boolean | null;
  home_security_system: boolean | null;
  swimming_pool: string | null;
  basement: boolean | null;
};
