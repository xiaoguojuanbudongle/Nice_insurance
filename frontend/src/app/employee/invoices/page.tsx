"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { listInvoices } from "@/lib/queries";
import type { Invoice } from "@/types/database";

export default function EmployeeInvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setRows(await listInvoices("employee"));
  }

  useEffect(() => {
    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load invoices."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="employee" title="Invoices" eyebrow="Billing operations">
      <div className="grid">
        <DataState loading={loading} error={error} empty={rows.length === 0}>
          <section className="panel table-wrap">
            <table>
              <thead><tr><th>Invoice</th><th>Customer</th><th>Policy</th><th>Amount</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.invoice_id}>
                    <td>{row.invoice_number}</td>
                    <td>{row.customers?.full_name ?? "-"}</td>
                    <td>{row.policies?.policy_number ?? "-"}</td>
                    <td>{formatCurrency(row.amount)}</td>
                    <td><StatusBadge value={row.status} /></td>
                    <td>{formatDate(row.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </DataState>
      </div>
    </AppShell>
  );
}
