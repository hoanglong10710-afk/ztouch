"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

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
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-[420px] rounded-2xl bg-white shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center">
          SUNPEO
        </h1>

        <h2 className="text-2xl font-bold text-center text-blue-600 mt-1">
          Z-TOUCH
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Smart NFC Rescue System
        </p>

        <button
          onClick={login}
          className="mt-10 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
        >
          Đăng nhập bằng Google
        </button>

        <div className="mt-8 space-y-2 text-gray-600">
          <p>👶 Trẻ nhỏ</p>
          <p>🧓 Người cao tuổi</p>
          <p>❤️ Người bệnh</p>
          <p>🌐 Gen Z</p>
        </div>
      </div>
    </main>
  );
}
