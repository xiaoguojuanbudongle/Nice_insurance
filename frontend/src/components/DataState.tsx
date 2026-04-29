type DataStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
};

export function DataState({ loading, error, empty, emptyText = "No records found.", children }: DataStateProps) {
  if (loading) return <div className="state">Loading data...</div>;
  if (error) return <div className="state error">{error}</div>;
  if (empty) return <div className="state">{emptyText}</div>;
  return children;
}
