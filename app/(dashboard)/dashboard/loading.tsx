export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-forge-800" />
      <div className="grid gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-forge-800" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-forge-800" />
    </div>
  );
}
