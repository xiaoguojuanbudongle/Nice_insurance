import { humanize } from "@/lib/format";

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return <span className={`status status-${value}`}>{humanize(value)}</span>;
}
