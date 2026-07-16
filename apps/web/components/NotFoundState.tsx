import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  message: string;
  homeLabel?: string;
};

// Shared fallback UI for not-found.tsx boundaries -- keeps every "this
// doesn't exist" page on the same branded card layout instead of each route
// hand-rolling its own.
export default function NotFoundState({ title, message, homeLabel = "Về trang chủ" }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        <p className="mt-3 text-muted-foreground">{message}</p>

        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
          {homeLabel}
        </Link>
      </div>
    </main>
  );
}
