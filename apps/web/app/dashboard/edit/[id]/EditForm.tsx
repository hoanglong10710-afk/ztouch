"use client";

import type { Card, CardStringField } from "@/types/card";
import type { CardFormErrors } from "@/lib/validation/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import AvatarUploader from "@/components/dashboard/AvatarUploader";
import { PROFILE_TYPES, PROFILE_TYPE_LABELS } from "@/lib/profile-type";
import { cn } from "@/lib/utils";
import type {
  RescueFormValues,
  EmergencyContactFormValues,
  EmergencyContactFormErrors,
} from "@/lib/validation/rescue";
import {
  addEmergencyContact,
  deleteEmergencyContact,
  moveEmergencyContact,
  setPrimaryEmergencyContact,
} from "@/lib/rescue/emergency-contacts";

type RescueFieldDef = {
  name: keyof RescueFormValues;
  id: string;
  label: string;
  helper: string;
  placeholder?: string;
  rows?: number;
  wrapperClassName?: string;
};

const RESCUE_FIELDS: RescueFieldDef[] = [
  {
    name: "bloodType",
    id: "rescue_blood_type",
    label: "Nhóm máu",
    helper: "Ví dụ: A+, O-, AB+",
    placeholder: "VD: O+",
    wrapperClassName: "sm:max-w-xs",
  },
  {
    name: "allergies",
    id: "rescue_allergies",
    label: "Dị ứng",
    helper: "Liệt kê thuốc, thực phẩm hoặc chất bạn bị dị ứng, cách nhau bằng dấu phẩy.",
    rows: 3,
  },
  {
    name: "medicalConditions",
    id: "rescue_medical_conditions",
    label: "Tình trạng bệnh lý",
    helper: "Các bệnh mãn tính hoặc tình trạng cần lưu ý, ví dụ: tiểu đường, hen suyễn.",
    rows: 3,
  },
  {
    name: "medications",
    id: "rescue_medications",
    label: "Thuốc đang sử dụng",
    helper: "Tên thuốc và liều dùng hiện tại, nếu có.",
    rows: 3,
  },
];

type Props = {
  card: Card;
  setCard: (card: Card) => void;
  errors: CardFormErrors;
  rescueForm: RescueFormValues;
  setRescueForm: (values: RescueFormValues) => void;
  contacts: EmergencyContactFormValues[];
  setContacts: (contacts: EmergencyContactFormValues[]) => void;
  contactErrors: EmergencyContactFormErrors[];
};

type FieldDef = { name: CardStringField; label: string };

const BASIC_FIELDS: FieldDef[] = [
  { name: "title", label: "Tiêu đề" },
  { name: "display_name", label: "Tên hiển thị" },
  { name: "job_title", label: "Nghề nghiệp" },
  { name: "company", label: "Công ty" },
];

const CONTACT_FIELDS: FieldDef[] = [
  { name: "phone", label: "Điện thoại" },
  { name: "email", label: "Email" },
  { name: "website", label: "Website" },
  { name: "address", label: "Địa chỉ" },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { name: "facebook", label: "Facebook" },
  { name: "tiktok", label: "TikTok" },
  { name: "youtube", label: "Youtube" },
  { name: "instagram", label: "Instagram" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "github", label: "GitHub" },
];

export default function EditForm({
  card,
  setCard,
  errors,
  rescueForm,
  setRescueForm,
  contacts,
  setContacts,
  contactErrors,
}: Props) {
  function updateField(name: CardStringField, value: string) {
    setCard({
      ...card,
      [name]: value,
    });
  }

  function updateRescueField(name: keyof RescueFormValues, value: string) {
    setRescueForm({
      ...rescueForm,
      [name]: value,
    });
  }

  function updateContactField(
    index: number,
    field: "fullName" | "relationship" | "phone",
    value: string
  ) {
    setContacts(contacts.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact)));
  }

  function renderField({ name, label }: FieldDef) {
    const error = errors[name];

    return (
      <div key={name} className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>

        <Input
          id={name}
          value={card[name] || ""}
          aria-invalid={!!error}
          onChange={(e) => updateField(name, e.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  function renderRescueField({
    name,
    id,
    label,
    helper,
    placeholder,
    rows,
    wrapperClassName,
  }: RescueFieldDef) {
    const value = rescueForm[name];
    const hintId = `${id}_hint`;

    return (
      <div key={name} className={cn("space-y-1.5", wrapperClassName)}>
        <Label htmlFor={id}>{label}</Label>

        {rows ? (
          <Textarea
            id={id}
            rows={rows}
            value={value}
            placeholder={placeholder}
            aria-describedby={hintId}
            onChange={(e) => updateRescueField(name, e.target.value)}
          />
        ) : (
          <Input
            id={id}
            value={value}
            placeholder={placeholder}
            aria-describedby={hintId}
            onChange={(e) => updateRescueField(name, e.target.value)}
          />
        )}

        <p id={hintId} className="text-sm text-muted-foreground">
          {helper}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8 sm:mt-8 sm:space-y-10">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label id="profile_type_label">Loại hồ sơ</Label>

            <div
              role="radiogroup"
              aria-labelledby="profile_type_label"
              className="grid grid-cols-2 gap-2"
            >
              {PROFILE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={card.profile_type === type}
                  onClick={() => setCard({ ...card, profile_type: type })}
                  className={cn(
                    "rounded-lg border border-border p-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
                    card.profile_type === type && "border-primary ring-2 ring-primary"
                  )}
                >
                  {PROFILE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <AvatarUploader
            cardId={card.id}
            avatarUrl={card.avatar_url}
            onUploaded={(url) => updateField("avatar_url", url)}
          />

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="space-y-1">
              <Label htmlFor="is_public">Công khai hồ sơ</Label>
              <p className="text-sm text-muted-foreground">
                Khi tắt, hồ sơ sẽ không thể truy cập qua NFC, QR hoặc liên kết công khai.
              </p>
            </div>

            <Switch
              id="is_public"
              aria-label="Công khai hồ sơ"
              checked={card.is_public}
              onCheckedChange={(checked) => setCard({ ...card, is_public: checked })}
            />
          </div>

          {BASIC_FIELDS.map(renderField)}

          <div className="space-y-1.5">
            <Label htmlFor="bio">Giới thiệu</Label>

            <Textarea
              id="bio"
              rows={6}
              value={card.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Liên hệ</h2>

        <div className="space-y-6">{CONTACT_FIELDS.map(renderField)}</div>
      </section>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Mạng xã hội</h2>

        <div className="space-y-6">{SOCIAL_FIELDS.map(renderField)}</div>
      </section>

      {card.profile_type === "rescue" && (
        <>
          <Separator />

          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Thông tin y tế</h2>
              <p className="text-sm text-muted-foreground">
                Thông tin này giúp lực lượng cứu hộ xử lý tình huống khẩn cấp nhanh và chính xác
                hơn.
              </p>
            </div>

            <div className="space-y-6 rounded-lg border border-border p-4 sm:p-6">
              {RESCUE_FIELDS.map(renderRescueField)}
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Liên hệ khẩn cấp</h2>
              <p className="text-sm text-muted-foreground">
                Thêm người thân hoặc liên hệ tin cậy để lực lượng cứu hộ có thể liên lạc khi cần
                thiết. Liên hệ đầu tiên trong danh sách là liên hệ chính.
              </p>
            </div>

            <div className="space-y-4">
              {contacts.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Chưa có liên hệ khẩn cấp nào
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thêm ít nhất một liên hệ để người khác có thể liên lạc khi cần.
                  </p>
                </div>
              )}

              {contacts.map((contact, index) => {
                const fieldErrors = contactErrors[index] ?? {};
                const key = contact.id ?? `new-${index}`;

                return (
                  <div
                    key={key}
                    data-testid={`emergency-contact-${index}`}
                    className="space-y-4 rounded-lg border border-border p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                        Liên hệ {index + 1}
                        {contact.isPrimary && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Liên hệ chính
                          </span>
                        )}
                      </h3>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => setContacts(moveEmergencyContact(contacts, index, -1))}
                        >
                          Lên<span className="sr-only"> liên hệ {index + 1}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === contacts.length - 1}
                          onClick={() => setContacts(moveEmergencyContact(contacts, index, 1))}
                        >
                          Xuống<span className="sr-only"> liên hệ {index + 1}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor={`contact_${key}_full_name`}>Họ tên</Label>
                        <Input
                          id={`contact_${key}_full_name`}
                          value={contact.fullName}
                          aria-invalid={!!fieldErrors.fullName}
                          onChange={(e) => updateContactField(index, "fullName", e.target.value)}
                        />
                        {fieldErrors.fullName && (
                          <p className="text-sm text-destructive">{fieldErrors.fullName}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`contact_${key}_relationship`}>Mối quan hệ</Label>
                        <Input
                          id={`contact_${key}_relationship`}
                          value={contact.relationship}
                          placeholder="VD: Mẹ, vợ/chồng, bạn thân"
                          onChange={(e) =>
                            updateContactField(index, "relationship", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`contact_${key}_phone`}>Số điện thoại</Label>
                        <Input
                          id={`contact_${key}_phone`}
                          value={contact.phone}
                          aria-invalid={!!fieldErrors.phone}
                          onChange={(e) => updateContactField(index, "phone", e.target.value)}
                        />
                        {fieldErrors.phone && (
                          <p className="text-sm text-destructive">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant={contact.isPrimary ? "secondary" : "outline"}
                        size="sm"
                        disabled={contact.isPrimary}
                        onClick={() => setContacts(setPrimaryEmergencyContact(contacts, index))}
                      >
                        {contact.isPrimary ? "Liên hệ chính" : "Đặt làm liên hệ chính"}
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setContacts(deleteEmergencyContact(contacts, index))}
                      >
                        Xóa<span className="sr-only"> liên hệ {index + 1}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full border-dashed sm:w-auto"
                onClick={() => setContacts(addEmergencyContact(contacts))}
              >
                + Thêm liên hệ
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
