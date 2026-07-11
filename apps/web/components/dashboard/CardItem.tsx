import { Pencil, Eye, Trash2 } from "lucide-react";
import type { Card } from "@/types/card";
import type { CardViewStats } from "@/lib/analytics/get-card-view-stats";
import { Button } from "@/components/ui/button";
import QRCodeDialog from "@/components/QRCodeDialog";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";

type Props = {
  card: Card;
  stats?: CardViewStats;
  highlighted?: boolean;
  onEdit: (id: string) => void;
  onView: (publicId: string) => void;
  onDelete: (id: string) => void;
};

export default function CardItem({ card, stats, highlighted, onEdit, onView, onDelete }: Props) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${card.public_id}`
      : "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow sm:p-6",
        highlighted && "border-primary shadow-md ring-2 ring-primary"
      )}
    >
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{card.title}</h2>

      <p className="mt-3 text-foreground">
        <b>Public ID:</b> {card.public_id}
      </p>

      <p className="text-foreground">
        <b>Loại:</b> {card.profile_type}
      </p>

      <p className="text-foreground">
        {card.is_public ? "🟢 Công khai" : "🔒 Riêng tư"}
      </p>

      {stats && (
        <p className="mt-3 text-sm text-muted-foreground">
          <b>{stats.totalViews}</b> lượt xem tổng ·{" "}
          <b>{stats.today}</b> hôm nay ·{" "}
          <b>{stats.last7Days}</b> 7 ngày qua ·{" "}
          <b>{stats.last30Days}</b> 30 ngày qua
        </p>
      )}

      <div className="mt-4 space-y-2 sm:mt-6">
        <div className="grid grid-cols-2 gap-2 [&>button]:w-full sm:flex sm:flex-wrap sm:gap-3 sm:[&>button]:w-auto">
          <Button type="button" variant="secondary" onClick={() => onEdit(card.id)}>
            <Pencil className="size-4" />
            Sửa
          </Button>

          <Button type="button" variant="outline" onClick={() => onView(card.public_id)}>
            <Eye className="size-4" />
            Xem
          </Button>

          <QRCodeDialog publicId={card.public_id} />

          <ShareButton url={publicUrl} title={card.title ?? undefined} />
        </div>

        <Button
          type="button"
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => onDelete(card.id)}
        >
          <Trash2 className="size-4" />
          Xóa
        </Button>
      </div>
    </div>
  );
}
