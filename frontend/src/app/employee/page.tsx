"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { MetricCard } from "@/components/MetricCard";
import { listCustomers, listEmployeeClaims, listEmployeePolicies, listInvoices } from "@/lib/queries";

export default function EmployeeDashboard() {
  const [metrics, setMetrics] = useState({ customers: 0, policies: 0, claims: 0, invoices: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [customers, policies, claims, invoices] = await Promise.all([
        listCustomers(),
        listEmployeePolicies(),
        listEmployeeClaims(),
        listInvoices("employee")
      ]);
      setMetrics({ customers: customers.length, policies: policies.length, claims: claims.length, invoices: invoices.length });
    }

    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="employee" title="Employee dashboard" eyebrow="Operations">
      <DataState loading={loading} error={error}>
        <div className="grid metrics">
          <MetricCard label="Customers" value={metrics.customers} />
          <MetricCard label="Policies" value={metrics.policies} tone="green" />
          <MetricCard label="Claims" value={metrics.claims} tone="amber" />
          <MetricCard label="Invoices" value={metrics.invoices} tone="red" />
        </div>
      </DataState>
    </AppShell>
  );
}
