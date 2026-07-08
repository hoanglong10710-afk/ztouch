"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import CardListItem from "@/components/dashboard/CardListItem";
import type { Card } from "@/types/card";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUser(session.user);

    await loadCards(session.user.id);

    setLoading(false);
  }

  async function loadCards(userId: string) {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCards(data as Card[]);
    }
  }

  async function createCard() {
    if (!user) return;

    const publicId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await supabase.from("cards").insert({
      owner_id: user.id,
      profile_type: "personal",
      title: "Hồ sơ mới",
      public_id: publicId,
      avatar_url: user.user_metadata.avatar_url,
      status: "active",
      is_public: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    await loadCards(user.id);

    alert("✅ Tạo hồ sơ thành công!");
  }

  async function deleteCard(id: string) {
    if (!user) return;
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadCards(user.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Đang tải...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-10">

      <h1 className="text-5xl font-bold">
        ☀️ SUNPEO ZTOUCH
      </h1>

      <p className="mt-8 text-2xl">
        Xin chào
      </p>

      <p className="mt-2 text-lg">
        {user.email}
      </p>

      <button
        onClick={createCard}
        className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-700"
      >
        + Tạo hồ sơ mới
      </button>

      <div className="mt-10 space-y-6">

        {cards.map((card) => (
          <CardListItem
            key={card.id}
            card={card}
            onEdit={(id) => router.push(`/dashboard/edit/${id}`)}
            onView={(publicId) => window.open(`/p/${publicId}`, "_blank")}
            onDelete={deleteCard}
          />
        ))}

      </div>

      <button
        onClick={logout}
        className="mt-12 rounded-xl bg-red-600 px-8 py-4 text-white hover:bg-red-700"
      >
        Đăng xuất
      </button>

    </main>
  );
}