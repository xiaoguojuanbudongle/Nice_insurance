"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { PolicyTable } from "@/components/PolicyTable";
import { listCustomerAutoPolicies } from "@/lib/queries";
import type { Policy } from "@/types/database";

export default function CustomerAutoPoliciesPage() {
  const [rows, setRows] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCustomerAutoPolicies()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load auto policies."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="customer" title="Auto Policies" eyebrow="Auto insurance">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <PolicyTable rows={rows} role="customer" />
      </DataState>
    </AppShell>
  );
}
