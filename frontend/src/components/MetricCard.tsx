type MetricCardProps = {
  label: string;
  value: string | number;
  tone?: "blue" | "green" | "amber" | "red";
};

export function MetricCard({ label, value, tone = "blue" }: MetricCardProps) {
  return (
    <section className={`metric metric-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </section>
  );
}
