import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">Không tìm thấy hồ sơ</h1>

        <p className="mt-3 text-muted-foreground">
          Hồ sơ này không tồn tại hoặc đã bị gỡ bỏ.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-secondary px-6 py-3 font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
