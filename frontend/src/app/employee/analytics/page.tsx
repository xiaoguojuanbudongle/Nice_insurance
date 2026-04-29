"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { mockRpc } from "@/lib/mock";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

const analyticsQueries = [
  {
    title: "Q1: Customers, auto policies, vehicles, and drivers",
    rpc: "analytics_policies_with_customer_product"
  },
  {
    title: "Q2: Unpaid or overdue auto invoices",
    rpc: "analytics_customers_with_unpaid_invoices"
  },
  {
    title: "Q3: Claims above average claim amount",
    rpc: "analytics_claims_above_average"
  },
  {
    title: "Q4: Policies needing attention",
    rpc: "analytics_auto_home_policy_union"
  },
  {
    title: "Q5: Monthly claim summary using WITH clause",
    rpc: "analytics_monthly_claim_summary"
  },
  {
    title: "Q6: Top customers by total premium",
    rpc: "analytics_top_customers_by_premium"
  }
];

type AnalyticsRows = Record<string, unknown>[];

export default function EmployeeAnalyticsPage() {
  const [results, setResults] = useState<Record<string, AnalyticsRows>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function runQuery(event: FormEvent<HTMLFormElement>, rpc: string) {
    event.preventDefault();
    const { data, error } = hasSupabaseEnv
      ? await supabase.rpc(rpc)
      : { data: await mockRpc(rpc), error: null };
    if (error) {
      setMessage(`${rpc}: ${error.message}`);
      return;
    }
    setMessage(null);
    setResults((current) => ({ ...current, [rpc]: (data ?? []) as AnalyticsRows }));
  }

  return (
    <AppShell role="employee" title="Analytics" eyebrow="SQL result views">
      <div className="grid">
        {message ? <p className="form-message">{message}</p> : null}
        {analyticsQueries.map((query) => {
          const rows = results[query.rpc] ?? [];
          const columns = rows[0] ? Object.keys(rows[0]) : [];

          return (
            <section className="panel" key={query.rpc}>
              <h2>{query.title}</h2>
              <form onSubmit={(event) => runQuery(event, query.rpc)}>
                <button className="secondary-button">Run</button>
              </form>
              {rows.length > 0 ? (
                <div className="table-wrap">
                  <table>
                    <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td key={column}>{String(row[column] ?? "-")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="muted">Ready to display RPC results.</p>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
