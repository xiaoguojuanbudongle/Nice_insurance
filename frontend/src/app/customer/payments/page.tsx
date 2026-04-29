"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, humanize } from "@/lib/format";
import { listPayments } from "@/lib/queries";
import type { Payment } from "@/types/database";

export default function CustomerPaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPayments()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load payments."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="customer" title="Payments" eyebrow="History">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Payment</th><th>Invoice</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.payment_id}>
                  <td>{row.payment_id.slice(0, 8)}</td>
                  <td>{row.invoice_id.slice(0, 8)}</td>
                  <td>{formatCurrency(row.amount)}</td>
                  <td>{humanize(row.method)}</td>
                  <td><StatusBadge value={row.status} /></td>
                  <td>{formatDate(row.payment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
