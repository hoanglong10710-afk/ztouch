"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { createCard as createCardAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { markFirstProfile } from "@/lib/onboarding/first-profile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CardItem from "@/components/dashboard/CardItem";
import EmptyState from "@/components/dashboard/EmptyState";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { getCardViewStats, type CardViewStats } from "@/lib/analytics/get-card-view-stats";
import type { Card } from "@/types/card";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [viewStats, setViewStats] = useState<Record<string, CardViewStats>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadCards(user.id).then(() => setCardsLoading(false));
  }, [authLoading, user]);

  async function loadCards(userId: string) {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCards(data as Card[]);
      setViewStats(await getCardViewStats(supabase, data.map((card) => card.id)));
    }
  }

  async function createCard() {
    if (!user) return;

    const result = await createCardAction();

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    markFirstProfile({ cardId: result.cardId, publicId: result.publicId });
    router.push(`/dashboard/edit/${result.cardId}`);
  }

  function deleteCard(id: string) {
    setDeleteTargetId(id);
  }

  async function confirmDeleteCard() {
    if (!user || !deleteTargetId) return;

    setDeleting(true);

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", deleteTargetId)
      .eq("owner_id", user.id);

    setDeleting(false);
    setDeleteTargetId(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadCards(user.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (authLoading || !user || cardsLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-10">

      <DashboardHeader userEmail={user.email} onCreateCard={createCard} />

      <div className="mt-6 space-y-4 sm:mt-10 sm:space-y-6">

        {cards.length === 0 ? (
          <EmptyState onCreateCard={createCard} />
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              stats={viewStats[card.id]}
              onEdit={(id) => router.push(`/dashboard/edit/${id}`)}
              onView={(publicId) => window.open(`/p/${publicId}`, "_blank")}
              onDelete={deleteCard}
            />
          ))
        )}

      </div>

      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="mt-8 sm:mt-12"
        onClick={logout}
      >
        <LogOut className="size-4" />
        Đăng xuất
      </Button>

      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa hồ sơ</DialogTitle>
            <DialogDescription>Bạn có chắc muốn xóa?</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
              disabled={deleting}
            >
              Hủy
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteCard}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
}
