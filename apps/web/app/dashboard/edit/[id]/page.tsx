"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EditForm from "./EditForm";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import type { Card } from "@/types/card";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCard() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .eq("owner_id", session.user.id)
        .single();

      if (ignore) return;

      if (error) {
        alert(error.message);
        return;
      }

      setCard(data as Card);
      setLoading(false);
    }

    loadCard();

    return () => {
      ignore = true;
    };
  }, []);

  async function saveCard() {
    if (!card) return;

    setSaving(true);

    const { error } = await supabase
      .from("cards")
      .update({
        title: card.title,
        display_name: card.display_name,
        bio: card.bio,
        job_title: card.job_title,
        company: card.company,
        phone: card.phone,
        email: card.email,
        website: card.website,
        facebook: card.facebook,
        tiktok: card.tiktok,
        youtube: card.youtube,
        instagram: card.instagram,
        linkedin: card.linkedin,
        github: card.github,
        address: card.address,
      })
      .eq("id", id)
      .eq("owner_id", card.owner_id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Đã lưu thành công!");
  }

  if (loading || !card) {
    return <LoadingScreen />;
  }

  return (
    <main className="mx-auto max-w-3xl p-10">
      <button
        onClick={() => router.back()}
        className="mb-6 rounded-lg bg-gray-200 px-4 py-2"
      >
        ← Quay lại
      </button>

      <h1 className="mb-8 text-4xl font-bold">✏️ Chỉnh sửa hồ sơ</h1>

      <EditForm card={card} setCard={setCard} />

      <button
        onClick={saveCard}
        disabled={saving}
        className="mt-6 rounded-xl bg-blue-600 px-8 py-4 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
      </button>
    </main>
  );
}
