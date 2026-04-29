"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { listVehicles } from "@/lib/queries";
import type { Vehicle } from "@/types/database";

export default function CustomerVehiclesPage() {
  const [rows, setRows] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listVehicles()
      .then(setRows)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load vehicles."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell role="customer" title="Vehicles" eyebrow="Auto insurance">
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>VIN</th><th>Vehicle</th><th>Status</th><th>Drivers</th><th>Policy</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.vehicle_id}>
                  <td>{row.vin}</td>
                  <td>{row.display || [row.make, row.model, row.year || ""].filter(Boolean).join(" ")}</td>
                  <td>{row.status ?? "-"}</td>
                  <td>
                    {row.drivers && row.drivers.length > 0
                      ? row.drivers.map((driver) => `${driver.full_name} (${driver.age})`).join(", ")
                      : "-"}
                  </td>
                  <td>{row.policy_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
