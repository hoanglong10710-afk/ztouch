import { Pencil, Eye, Trash2 } from "lucide-react";
import type { Card } from "@/types/card";
import { Button } from "@/components/ui/button";
import QRCodeDialog from "@/components/QRCodeDialog";
import ShareButton from "@/components/ShareButton";

type Props = {
  card: Card;
  onEdit: (id: string) => void;
  onView: (publicId: string) => void;
  onDelete: (id: string) => void;
};

export default function CardItem({ card, onEdit, onView, onDelete }: Props) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${card.public_id}`
      : "";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow">
      <h2 className="text-3xl font-bold text-foreground">{card.title}</h2>

      <p className="mt-3 text-foreground">
        <b>Public ID:</b> {card.public_id}
      </p>

      <p className="text-foreground">
        <b>Loại:</b> {card.profile_type}
      </p>

      <p className="text-foreground">
        <b>Trạng thái:</b> {card.status}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
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

        <Button type="button" variant="destructive" onClick={() => onDelete(card.id)}>
          <Trash2 className="size-4" />
          Xóa
        </Button>
      </div>
    </div>
  );
}
