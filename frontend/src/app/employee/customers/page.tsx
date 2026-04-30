"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { mockCreateCustomer, mockDeleteCustomer, mockUpdateCustomer } from "@/lib/mock";
import { listCustomers } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Customer } from "@/types/database";

type CustomerForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  gender: string;
  marital_status: string;
  cust_type: string;
};

const emptyForm: CustomerForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "NY",
  zip_code: "",
  gender: "",
  marital_status: "S",
  cust_type: "A"
};

export default function EmployeeCustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  useEffect(() => {
    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load customers."))
      .finally(() => setLoading(false));
  }, []);

  async function load() {
    setRows(await listCustomers());
  }

  function updateForm(patch: Partial<CustomerForm>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function editCustomer(customer: Customer) {
    setEditingId(customer.customer_id);
    setForm({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone ?? "",
      street: customer.street ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "NY",
      zip_code: customer.zip_code ?? "",
      gender: customer.gender ?? "",
      marital_status: customer.marital_status ?? "S",
      cust_type: customer.cust_type ?? "A"
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function payload() {
    return {
      cust_fname: form.first_name,
      cust_lname: form.last_name,
      email: form.email,
      phone: form.phone || null,
      street: form.street,
      city: form.city,
      state: form.state,
      zip_code: form.zip_code,
      gender: form.gender || null,
      marital_status: form.marital_status,
      cust_type: form.cust_type
    };
  }

  async function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      if (!hasSupabaseEnv) {
        if (editingId) {
          const current = rows.find((row) => row.customer_id === editingId);
          if (!current) throw new Error("Customer not found.");
          await mockUpdateCustomer({
            ...current,
            first_name: form.first_name,
            last_name: form.last_name,
            full_name: `${form.first_name} ${form.last_name}`.trim(),
            email: form.email,
            phone: form.phone || null,
            street: form.street,
            city: form.city,
            state: form.state,
            zip_code: form.zip_code,
            address: [form.street, form.city, form.state, form.zip_code].filter(Boolean).join(", ") || null,
            gender: form.gender || null,
            marital_status: form.marital_status,
            cust_type: form.cust_type
          });
        } else {
          await mockCreateCustomer({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone || null,
            street: form.street,
            city: form.city,
            state: form.state,
            zip_code: form.zip_code,
            gender: form.gender || null,
            marital_status: form.marital_status,
            cust_type: form.cust_type
          });
        }
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from("hwl_customer")
          .update(payload())
          .eq("cust_id", Number(editingId));
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("hwl_customer").insert(payload());
        if (insertError) throw insertError;
      }

      await load();
      resetForm();
      setMessage(editingId ? "Customer updated." : "Customer added.");
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save customer.");
    }
  }

  async function deleteCustomer(customer: Customer) {
    setMessage(null);
    try {
      if (!hasSupabaseEnv) {
        await mockDeleteCustomer(customer.customer_id);
      } else {
        const { error: deleteError } = await supabase.from("hwl_customer").delete().eq("cust_id", Number(customer.customer_id));
        if (deleteError) throw deleteError;
      }
      await load();
      if (editingId === customer.customer_id) resetForm();
      setMessage("Customer deleted.");
    } catch (deleteError) {
      setMessage(deleteError instanceof Error ? deleteError.message : "Unable to delete customer.");
    }
  }

  return (
    <AppShell role="employee" title="Customers" eyebrow="Directory">
      <section className="panel">
        <h2>{editingId ? "Edit customer" : "Add customer"}</h2>
        <form className="form-stack" onSubmit={saveCustomer}>
          <div className="form-row">
            <label>
              First name
              <input value={form.first_name} onChange={(event) => updateForm({ first_name: event.target.value })} required />
            </label>
            <label>
              Last name
              <input value={form.last_name} onChange={(event) => updateForm({ last_name: event.target.value })} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => updateForm({ email: event.target.value })} required />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(event) => updateForm({ phone: event.target.value })} />
            </label>
          </div>
          <label>
            Street
            <input value={form.street} onChange={(event) => updateForm({ street: event.target.value })} required />
          </label>
          <div className="form-row">
            <label>
              City
              <input value={form.city} onChange={(event) => updateForm({ city: event.target.value })} required />
            </label>
            <label>
              State
              <input value={form.state} maxLength={2} onChange={(event) => updateForm({ state: event.target.value.toUpperCase() })} required />
            </label>
            <label>
              ZIP
              <input value={form.zip_code} onChange={(event) => updateForm({ zip_code: event.target.value })} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Gender
              <select value={form.gender} onChange={(event) => updateForm({ gender: event.target.value })}>
                <option value="">Not provided</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </label>
            <label>
              Marital
              <select value={form.marital_status} onChange={(event) => updateForm({ marital_status: event.target.value })}>
                <option value="S">Single</option>
                <option value="M">Married</option>
                <option value="W">Widow/Widower</option>
              </select>
            </label>
            <label>
              Type
              <select value={form.cust_type} onChange={(event) => updateForm({ cust_type: event.target.value })}>
                <option value="A">Auto</option>
                <option value="H">Home</option>
                <option value="B">Both</option>
              </select>
            </label>
          </div>
          {message ? <p className="form-message">{message}</p> : null}
          <div className="actions">
            <button className="primary-button">{editingId ? "Save changes" : "Add customer"}</button>
            {editingId ? <button className="ghost-button" type="button" onClick={resetForm}>Cancel</button> : null}
          </div>
        </form>
      </section>
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Customer ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Gender</th><th>Marital</th><th>Type</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.customer_id}>
                  <td>{row.customer_id}</td>
                  <td>{row.full_name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone ?? "-"}</td>
                  <td>{row.address ?? "-"}</td>
                  <td>{row.gender ?? "-"}</td>
                  <td>{row.marital_status ?? "-"}</td>
                  <td>{row.cust_type ?? "-"}</td>
                  <td>
                    <div className="actions">
                      <button className="secondary-button" type="button" onClick={() => editCustomer(row)}>Edit</button>
                      <button className="danger-button" type="button" onClick={() => deleteCustomer(row)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
