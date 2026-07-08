import type { Card } from "@/types/card";

type Props = {
  card: Card;
  onEdit: (id: string) => void;
  onView: (publicId: string) => void;
  onDelete: (id: string) => void;
};

export default function CardItem({ card, onEdit, onView, onDelete }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow">
      <h2 className="text-3xl font-bold">📇 {card.title}</h2>

      <p className="mt-3">
        <b>Public ID:</b> {card.public_id}
      </p>

      <p>
        <b>Loại:</b> {card.profile_type}
      </p>

      <p>
        <b>Trạng thái:</b> {card.status}
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onEdit(card.id)}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          ✏️ Sửa
        </button>

        <button
          onClick={() => onView(card.public_id)}
          className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
        >
          👁 Xem
        </button>

        <button
          onClick={() => onDelete(card.id)}
          className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
        >
          🗑 Xóa
        </button>
      </div>
    </div>
  );
}
