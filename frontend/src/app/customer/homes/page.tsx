"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { formatCurrency, formatDate } from "@/lib/format";
import { listHomes } from "@/lib/queries";
import type { Home } from "@/types/database";

function yesNo(value: boolean | null) {
  if (value === null) return "-";
  return value ? "Yes" : "No";
}

export default function CustomerHomesPage() {
  const [rows, setRows] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listHomes()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load homes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="customer" title="Homes" eyebrow="Home insurance">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Purchase Date</th><th>Value</th><th>Area</th><th>Security</th><th>Fire Notify</th><th>Basement</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.home_id}>
                  <td>{row.home_type ?? "-"}</td>
                  <td>{formatDate(row.purchase_date)}</td>
                  <td>{formatCurrency(row.purchase_value)}</td>
                  <td>{row.area_sq_ft ? `${row.area_sq_ft} sq ft` : "-"}</td>
                  <td>{yesNo(row.home_security_system)}</td>
                  <td>{yesNo(row.auto_fire_notification)}</td>
                  <td>{yesNo(row.basement)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
