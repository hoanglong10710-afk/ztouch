"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/login",
      },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-center text-foreground">
          SUNPEO
        </h1>

        <h2 className="text-2xl font-bold text-center text-primary mt-1">
          Z-TOUCH
        </h2>

        <p className="text-center text-muted-foreground mt-4">
          Smart NFC Rescue System
        </p>

        <Button type="button" size="lg" className="mt-10 w-full" onClick={login}>
          Đăng nhập bằng Google
        </Button>

        <div className="mt-8 space-y-2 text-muted-foreground">
          <p>👶 Trẻ nhỏ</p>
          <p>🧓 Người cao tuổi</p>
          <p>❤️ Người bệnh</p>
          <p>🌐 Gen Z</p>
        </div>
      </div>
    </main>
  );
}
