"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { PolicyTable } from "@/components/PolicyTable";
import { listEmployeeAutoPolicies } from "@/lib/queries";
import type { Policy } from "@/types/database";

export default function EmployeeAutoPoliciesPage() {
  const [rows, setRows] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listEmployeeAutoPolicies()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load auto policies."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="employee" title="Auto Policies" eyebrow="Book of business">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <PolicyTable rows={rows} role="employee" />
      </DataState>
    </AppShell>
  );
}
