"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import EditForm from "./EditForm";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { validateCard, hasErrors } from "@/lib/validation/card";
import { updateCard as updateCardAction } from "./actions";
import { toast } from "@/components/ui/toast";
import type { Card } from "@/types/card";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [card, setCard] = useState<Card | null>(null);
  const [initialCard, setInitialCard] = useState<Card | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const userId = user.id;
    let ignore = false;

    async function loadCard() {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .eq("owner_id", userId)
        .single();

      if (ignore) return;

      if (error) {
        toast.error(error.message);
        return;
      }

      setCard(data as Card);
      setInitialCard(data as Card);
      setLoading(false);
    }

    loadCard();

    return () => {
      ignore = true;
    };
  }, [authLoading, user, id]);

  async function saveCard() {
    if (!card) return;

    setSaving(true);

    const result = await updateCardAction(id, card);

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setInitialCard(card);
    toast.success("✅ Đã lưu thành công!");
  }

  const errors = useMemo(() => (card ? validateCard(card) : {}), [card]);
  const isDirty = useMemo(
    () => JSON.stringify(card) !== JSON.stringify(initialCard),
    [card, initialCard]
  );
  const canSave = isDirty && !hasErrors(errors) && !saving;

  if (authLoading || loading || !card) {
    return <LoadingScreen />;
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-10">
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-lg bg-gray-200 px-4 py-2 sm:mb-6"
      >
        ← Quay lại
      </button>

      <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-4xl">✏️ Chỉnh sửa hồ sơ</h1>

      <EditForm card={card} setCard={setCard} errors={errors} />

      <Button
        onClick={saveCard}
        disabled={!canSave}
        size="lg"
        className="mt-6 w-full sm:w-auto"
      >
        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
      </Button>
    </main>
  );
}
