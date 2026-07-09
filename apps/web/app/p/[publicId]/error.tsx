"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">Đã có lỗi xảy ra</h1>

        <p className="mt-3 text-muted-foreground">
          Không thể tải hồ sơ này. Vui lòng thử lại.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-secondary px-6 py-3 font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
