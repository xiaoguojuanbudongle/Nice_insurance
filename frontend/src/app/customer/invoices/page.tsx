"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DataState } from "@/components/DataState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { mockRpc } from "@/lib/mock";
import { listInvoices } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import type { Invoice } from "@/types/database";

export default function CustomerInvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setRows(await listInvoices("customer"));
  }

  useEffect(() => {
    load()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load invoices."))
      .finally(() => setLoading(false));
  }, []);

  async function payInvoice(invoice: Invoice) {
    const params = {
      p_invoice_id: invoice.invoice_id,
      p_pay_method: "Credit"
    };
    const rpcError = await runRpc(invoice.source === "home" ? "pay_home_invoice" : "pay_auto_invoice", params);

    setMessage(rpcError ? rpcError.message : `Payment submitted for ${invoice.invoice_number}.`);
    if (!rpcError) await load();
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
    <AppShell role="customer" title="Invoices" eyebrow="Billing">
      {message ? <p className="form-message">{message}</p> : null}
      <DataState loading={loading} error={error} empty={rows.length === 0}>
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Policy</th><th>Amount</th><th>Status</th><th>Due</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.invoice_id}>
                  <td>{row.invoice_number}</td>
                  <td>{row.policies?.policy_number ?? "-"}</td>
                  <td>{formatCurrency(row.amount)}</td>
                  <td><StatusBadge value={row.status} /></td>
                  <td>{formatDate(row.due_date)}</td>
                  <td>{row.status === "unpaid" ? <button className="secondary-button" onClick={() => payInvoice(row)}>Pay</button> : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DataState>
    </AppShell>
  );
}
