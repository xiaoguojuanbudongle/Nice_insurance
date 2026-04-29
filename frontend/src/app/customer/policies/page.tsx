"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { listCustomerPolicies } from "@/lib/queries";
import type { Policy } from "@/types/database";

export default function CustomerPoliciesPage() {
  const [rows, setRows] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCustomerPolicies()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load policies."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="customer" title="Policies" eyebrow="Coverage">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Policy</th><th>Product</th><th>Type</th><th>Status</th><th>Term</th><th>Premium</th><th>Coverage</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.policy_id}>
                  <td>{row.policy_number}</td>
                  <td>{row.insurance_products?.product_name ?? "-"}</td>
                  <td>{row.policy_type}</td>
                  <td><StatusBadge value={row.status} /></td>
                  <td>{formatDate(row.start_date)} - {formatDate(row.end_date)}</td>
                  <td>{formatCurrency(row.premium_amount)}</td>
                  <td>{formatCurrency(row.coverage_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
