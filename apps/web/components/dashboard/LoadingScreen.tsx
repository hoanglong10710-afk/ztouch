import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-muted"
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" aria-hidden="true" />
        <span>Đang tải...</span>
      </div>
    </main>
  );
}
