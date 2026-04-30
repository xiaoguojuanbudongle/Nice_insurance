"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { mockRpc } from "@/lib/mock";
import { listEmployeeClaims } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Claim } from "@/types/database";

type ClaimAction = "under_review" | "approved" | "rejected" | "paid";

export default function EmployeeClaimsPage() {
  const [rows, setRows] = useState<Claim[]>([]);
  const [note, setNote] = useState("Reviewed by employee.");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setRows(await listEmployeeClaims());
  }

  useEffect(() => {
    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load claims."))
      .finally(() => setLoading(false));
  }, []);

  async function runAction(newStatus: ClaimAction, claimId: string) {
    const params = {
      p_claim_id: hasSupabaseEnv ? Number(claimId) : claimId,
      p_new_status: newStatus,
      p_note: note
    };
    const rpcError = await runRpc(params);

    setMessage(rpcError ? rpcError.message : "Claim updated.");
    if (!rpcError) await load();
  }

  async function runRpc(params: Record<string, unknown>) {
    if (!hasSupabaseEnv) {
      try {
        await mockRpc("review_claim", params);
        return null;
      } catch (error) {
        return error instanceof Error ? error : new Error("Mock RPC failed.");
      }
    }

    const { error } = await supabase.rpc("review_claim", params);
    return error;
  }

  return (
    <AppShell role="employee" title="Claims" eyebrow="Review workflow">
      <div className="grid">
        <section className="panel">
          <label className="form-stack">
            Review note
            <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          {message ? <p className="form-message">{message}</p> : null}
        </section>
        <DataState loading={loading} error={error} empty={rows.length === 0}>
          <section className="panel table-wrap">
            <table>
              <thead><tr><th>Claim</th><th>Customer</th><th>Policy</th><th>Amount</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.claim_id}>
                    <td>{row.claim_number}</td>
                    <td>{row.customers?.full_name ?? "-"}</td>
                    <td>{row.policies?.policy_number ?? "-"}</td>
                    <td>{formatCurrency(row.claim_amount)}</td>
                    <td><StatusBadge value={row.status} /></td>
                    <td>{formatDate(row.submitted_at)}</td>
                    <td>
                      <div className="actions">
                        {row.status === "submitted" ? (
                          <button className="secondary-button" onClick={() => runAction("under_review", row.claim_id)}>Review</button>
                        ) : null}
                        {row.status === "under_review" ? (
                          <>
                            <button className="secondary-button" onClick={() => runAction("approved", row.claim_id)}>Approve</button>
                            <button className="danger-button" onClick={() => runAction("rejected", row.claim_id)}>Reject</button>
                          </>
                        ) : null}
                      </div>
                    </td>
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
