import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Policy, UserRole } from "@/types/database";

type PolicyTableProps = {
  rows: Policy[];
  role: UserRole;
};

export function PolicyTable({ rows, role }: PolicyTableProps) {
  return (
    <section className="panel table-wrap">
      <table>
        <thead>
          <tr>
            <th>Policy</th>
            {role === "employee" ? <th>Customer</th> : null}
            <th>Type</th>
            <th>Status</th>
            <th>Term</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.source}-${row.policy_id}`}>
              <td>{row.policy_number}</td>
              {role === "employee" ? <td>{row.customers?.full_name ?? "-"}</td> : null}
              <td>{row.policy_type}</td>
              <td><StatusBadge value={row.status} /></td>
              <td>{formatDate(row.start_date)} - {formatDate(row.end_date)}</td>
              <td>{formatCurrency(row.premium_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
