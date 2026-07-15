import { Separator } from "@/components/ui/separator";

// Mirrors CardItem's structure/spacing exactly (rounded-2xl card, header
// row, metadata row, stats grid, separator, action rows) so swapping this
// out for real cards once they load causes no layout shift.
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted sm:h-9 sm:w-56" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-muted/50 p-3 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="h-5 w-8 animate-pulse rounded bg-muted-foreground/20 sm:h-6" />
            <div className="h-3 w-10 animate-pulse rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>

      <Separator className="mt-4 sm:mt-6" />

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-muted sm:w-24" />
          ))}
        </div>

        <div className="h-8 w-full animate-pulse rounded-lg bg-muted sm:w-24" />
      </div>
    </div>
  );
}

export default function CardListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-4 sm:space-y-6"
    >
      <span className="sr-only">Đang tải hồ sơ...</span>

      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
