"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { MetricCard } from "@/components/MetricCard";
import { listCustomerClaims, listCustomerPolicies, listInvoices } from "@/lib/queries";

export default function CustomerDashboard() {
  const [metrics, setMetrics] = useState({ policies: 0, claims: 0, unpaid: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [policies, claims, invoices] = await Promise.all([
          listCustomerPolicies(),
          listCustomerClaims(),
          listInvoices("customer")
        ]);
        setMetrics({
          policies: policies.length,
          claims: claims.length,
          unpaid: invoices.filter((invoice) => invoice.status === "unpaid").length
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AppShell role="customer" title="Customer dashboard" eyebrow="My insurance">
      <DataState loading={loading} error={error}>
        <div className="grid metrics">
          <MetricCard label="Policies" value={metrics.policies} />
          <MetricCard label="Claims" value={metrics.claims} tone="amber" />
          <MetricCard label="Unpaid invoices" value={metrics.unpaid} tone="red" />
        </div>
      </DataState>
    </AppShell>
  );
}
