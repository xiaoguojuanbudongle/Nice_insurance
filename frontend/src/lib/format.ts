export function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function humanize(value: string | null | undefined) {
  if (!value) return "-";
  return value.replaceAll("_", " ");
}
