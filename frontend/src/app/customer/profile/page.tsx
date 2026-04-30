"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { mockUpdateCustomer } from "@/lib/mock";
import { getCurrentCustomer } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Customer } from "@/types/database";

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentCustomer()
      .then(setCustomer)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer) return;

    if (!hasSupabaseEnv) {
      await mockUpdateCustomer(customer);
      setMessage("Profile updated in mock storage.");
      return;
    }

    const { error: updateError } = await supabase
      .from("hwl_customer")
      .update({
        street: customer.street,
        city: customer.city,
        state: customer.state,
        zip_code: customer.zip_code,
        phone: customer.phone
      })
      .eq("cust_id", customer.customer_id);

    setMessage(updateError ? updateError.message : "Profile updated.");
  }

  function update(patch: Partial<Customer>) {
    if (!customer) return;
    setCustomer({ ...customer, ...patch });
  }

  return (
    <AppShell role="customer" title="Profile" eyebrow="Account">
      <DataState loading={loading} error={error} empty={!customer}>
        {customer ? (
          <section className="panel">
            <form className="form-stack" onSubmit={save}>
              <div className="form-row">
                <label>
                  First name
                  <input value={customer.first_name} disabled />
                </label>
                <label>
                  Last name
                  <input value={customer.last_name} disabled />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Email
                  <input type="email" value={customer.email} disabled />
                </label>
                <label>
                  Phone
                  <input value={customer.phone ?? ""} onChange={(event) => update({ phone: event.target.value })} />
                </label>
              </div>
              <label>
                Street
                <input value={customer.street ?? ""} onChange={(event) => update({ street: event.target.value })} />
              </label>
              <div className="form-row">
                <label>
                  City
                  <input value={customer.city ?? ""} onChange={(event) => update({ city: event.target.value })} />
                </label>
                <label>
                  State
                  <input value={customer.state ?? ""} onChange={(event) => update({ state: event.target.value })} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  ZIP code
                  <input value={customer.zip_code ?? ""} onChange={(event) => update({ zip_code: event.target.value })} />
                </label>
                <label>
                  Customer type
                  <select value={customer.cust_type ?? ""} disabled>
                    <option value="">Not set</option>
                    <option value="A">Auto</option>
                    <option value="H">Home</option>
                    <option value="B">Both</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Gender
                  <select value={customer.gender ?? ""} disabled>
                    <option value="">Not provided</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </label>
                <label>
                  Marital status
                  <select value={customer.marital_status ?? ""} disabled>
                    <option value="">Not set</option>
                    <option value="M">Married</option>
                    <option value="S">Single</option>
                    <option value="W">Widow/Widower</option>
                  </select>
                </label>
              </div>
              {message ? <p className="form-message">{message}</p> : null}
              <button className="primary-button">Save profile</button>
            </form>
          </section>
        ) : null}
      </DataState>
    </AppShell>
  );
}
