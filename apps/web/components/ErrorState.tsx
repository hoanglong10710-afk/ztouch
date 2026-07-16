"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
};

// Shared fallback UI for route-level error.tsx boundaries. Never renders
// error.message/stack -- only the generic copy passed in by the caller, so a
// production error (which may carry sensitive details) can't leak to the page.
export default function ErrorState({
  error,
  reset,
  title = "Đã có lỗi xảy ra",
  message = "Vui lòng thử lại.",
}: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        <p className="mt-3 text-muted-foreground">{message}</p>

        <Button type="button" size="lg" className="mt-6" onClick={reset}>
          Thử lại
        </Button>
      </div>
    </main>
  );
}
