"use client";

import type { Card, CardStringField } from "@/types/card";

type Props = {
  card: Card;
  setCard: (card: Card) => void;
};

const TEXT_FIELDS: { name: CardStringField; label: string }[] = [
  { name: "title", label: "Tiêu đề" },
  { name: "display_name", label: "Tên hiển thị" },
  { name: "job_title", label: "Nghề nghiệp" },
  { name: "company", label: "Công ty" },
  { name: "phone", label: "Điện thoại" },
  { name: "email", label: "Email" },
  { name: "website", label: "Website" },
  { name: "facebook", label: "Facebook" },
  { name: "tiktok", label: "TikTok" },
  { name: "youtube", label: "Youtube" },
  { name: "instagram", label: "Instagram" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "github", label: "GitHub" },
  { name: "address", label: "Địa chỉ" },
];

export default function EditForm({ card, setCard }: Props) {
  function updateField(name: CardStringField, value: string) {
    setCard({
      ...card,
      [name]: value,
    });
  }

  return (
    <div className="mt-8 space-y-6">
      {TEXT_FIELDS.map(({ name, label }) => (
        <div key={name}>
          <label className="mb-2 block font-semibold">{label}</label>

          <input
            className="w-full rounded-lg border p-3"
            value={card[name] || ""}
            onChange={(e) => updateField(name, e.target.value)}
          />
        </div>
      ))}

      <div>
        <label className="mb-2 block font-semibold">Giới thiệu</label>

        <textarea
          rows={6}
          className="w-full rounded-lg border p-3"
          value={card.bio || ""}
          onChange={(e) => updateField("bio", e.target.value)}
        />
      </div>
    </div>
  );
}
