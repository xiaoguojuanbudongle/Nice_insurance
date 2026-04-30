"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { mockRpc } from "@/lib/mock";
import { listCustomerClaims, listCustomerPolicies } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Claim, Policy } from "@/types/database";

export default function CustomerClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyId, setPolicyId] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [claimRows, policyRows] = await Promise.all([listCustomerClaims(), listCustomerPolicies()]);
    setClaims(claimRows);
    setPolicies(policyRows);
    setPolicyId((current) => current || policyRows[0]?.policy_id || "");
  }

  useEffect(() => {
    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load claims."))
      .finally(() => setLoading(false));
  }, []);

  async function submitClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const params = {
      p_policy_id: hasSupabaseEnv ? Number(policyId) : policyId,
      p_claim_amount: Number(claimAmount),
      p_description: description
    };

    const selectedPolicy = policies.find((policy) => policy.policy_id === policyId);
    const rpcName = selectedPolicy?.source === "home" ? "submit_home_claim" : "submit_auto_claim";
    const rpcError = await runRpc(rpcName, params);

    if (rpcError instanceof Error) {
      setMessage(rpcError.message);
      return;
    }

    setClaimAmount("");
    setDescription("");
    setMessage("Claim submitted.");
    await load();
  }

  async function runRpc(functionName: string, params: Record<string, unknown>) {
    if (!hasSupabaseEnv) {
      try {
        await mockRpc(functionName, params);
        return null;
      } catch (error) {
        return error instanceof Error ? error : new Error("Mock RPC failed.");
      }
    }

    const { error } = await supabase.rpc(functionName, params);
    return error;
  }

  return (
    <AppShell role="customer" title="Claims" eyebrow="Submit and track">
      <div className="grid">
        <section className="panel">
          <h2>Submit claim</h2>
          <form className="form-stack" onSubmit={submitClaim}>
            <div className="form-row">
              <label>
                Policy
                <select value={policyId} onChange={(event) => setPolicyId(event.target.value)} required>
                  {policies.map((policy) => (
                    <option key={policy.policy_id} value={policy.policy_id}>{policy.policy_number}</option>
                  ))}
                </select>
              </label>
              <label>
                Claim amount
                <input type="number" min="0" step="0.01" value={claimAmount} onChange={(event) => setClaimAmount(event.target.value)} required />
              </label>
            </div>
            <label>
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
            </label>
            {message ? <p className="form-message">{message}</p> : null}
            <button className="primary-button">Submit claim</button>
          </form>
        </section>
        <DataState loading={loading} error={error} empty={claims.length === 0}>
          <section className="panel table-wrap">
            <table>
              <thead><tr><th>Claim</th><th>Policy</th><th>Amount</th><th>Status</th><th>Submitted</th><th>Description</th></tr></thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.claim_id}>
                    <td>{claim.claim_number}</td>
                    <td>{claim.policies?.policy_number ?? "-"}</td>
                    <td>{formatCurrency(claim.claim_amount)}</td>
                    <td><StatusBadge value={claim.status} /></td>
                    <td>{formatDate(claim.submitted_at)}</td>
                    <td>{claim.description ?? "-"}</td>
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
