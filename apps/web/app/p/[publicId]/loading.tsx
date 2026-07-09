export default function Loading() {
  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-xl p-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-36 w-36 animate-pulse rounded-full bg-muted" />
            <div className="mt-6 h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="mt-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
