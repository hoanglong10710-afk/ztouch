import { Pencil, Eye, Trash2 } from "lucide-react";
import type { Card } from "@/types/card";
import type { CardViewStats } from "@/lib/analytics/get-card-view-stats";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import QRCodeDialog from "@/components/QRCodeDialog";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";
import { PROFILE_TYPE_LABELS } from "@/lib/profile-type";

type Props = {
  card: Card;
  stats?: CardViewStats;
  highlighted?: boolean;
  onEdit: (id: string) => void;
  onView: (publicId: string) => void;
  onDelete: (id: string) => void;
};

const STAT_ITEMS: { key: keyof CardViewStats; label: string }[] = [
  { key: "totalViews", label: "Tổng lượt xem" },
  { key: "today", label: "Hôm nay" },
  { key: "last7Days", label: "7 ngày" },
  { key: "last30Days", label: "30 ngày" },
];

export default function CardItem({ card, stats, highlighted, onEdit, onView, onDelete }: Props) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${card.public_id}`
      : "";

  const title = card.title || "Hồ sơ chưa đặt tên";

  return (
    <article
      aria-label={title}
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow sm:p-6",
        highlighted && "border-primary shadow-md ring-2 ring-primary"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>

        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
            card.is_public ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {card.is_public ? "🟢 Công khai" : "🔒 Riêng tư"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <span aria-label={`Mã công khai ${card.public_id}`} className="inline-flex items-center gap-1">
          <span aria-hidden="true" className="text-xs">
            ID
          </span>
          <span aria-hidden="true" className="font-mono text-xs text-foreground">
            {card.public_id}
          </span>
        </span>

        <span aria-hidden="true">·</span>

        <span>{PROFILE_TYPE_LABELS[card.profile_type]}</span>
      </div>

      {stats && (
        <dl className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-muted/50 p-3 text-center sm:gap-3">
          {STAT_ITEMS.map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center">
              <dd className="order-1 text-base font-semibold text-foreground sm:text-lg">
                {stats[key]}
              </dd>
              <dt className="order-2 mt-0.5 text-[0.65rem] text-muted-foreground sm:text-xs">
                {label}
              </dt>
            </div>
          ))}
        </dl>
      )}

      <Separator className="mt-4 sm:mt-6" />

      <div className="mt-4 space-y-2">
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
          aria-label={`Xóa hồ sơ ${title}`}
        >
          <Trash2 className="size-4" />
          Xóa
        </Button>
      </div>
    </article>
  );
}
