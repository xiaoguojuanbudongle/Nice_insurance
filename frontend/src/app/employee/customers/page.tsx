"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { listCustomers } from "@/lib/queries";
import type { Customer } from "@/types/database";

export default function EmployeeCustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCustomers()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load customers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="employee" title="Customers" eyebrow="Directory">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Customer ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Gender</th><th>Marital</th><th>Type</th></tr></thead>
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
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
