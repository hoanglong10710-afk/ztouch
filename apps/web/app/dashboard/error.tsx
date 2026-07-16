"use client";

import ErrorState from "@/components/ErrorState";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Covers /dashboard and nested /dashboard/edit/[id] -- error.tsx boundaries
// apply to their whole segment subtree unless overridden more specifically.
export default function Error({ error, reset }: Props) {
  return (
    <ErrorState error={error} reset={reset} message="Không thể tải trang này. Vui lòng thử lại." />
  );
}
