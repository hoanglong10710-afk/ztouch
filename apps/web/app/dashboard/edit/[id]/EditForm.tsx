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
import { PROFILE_TYPE_LABELS } from "@/lib/profile-type";
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

  return (
    <div className="mt-6 space-y-8 sm:mt-8 sm:space-y-10">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>Loại hồ sơ</Label>
            <p className="text-foreground">{PROFILE_TYPE_LABELS[card.profile_type]}</p>
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
            <h2 className="text-lg font-semibold">Thông tin y tế</h2>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="rescue_blood_type">Nhóm máu</Label>
                <Input
                  id="rescue_blood_type"
                  value={rescueForm.bloodType}
                  onChange={(e) => updateRescueField("bloodType", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_allergies">Dị ứng</Label>
                <Textarea
                  id="rescue_allergies"
                  rows={3}
                  value={rescueForm.allergies}
                  onChange={(e) => updateRescueField("allergies", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_medical_conditions">Tình trạng bệnh lý</Label>
                <Textarea
                  id="rescue_medical_conditions"
                  rows={3}
                  value={rescueForm.medicalConditions}
                  onChange={(e) => updateRescueField("medicalConditions", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_medications">Thuốc đang sử dụng</Label>
                <Textarea
                  id="rescue_medications"
                  rows={3}
                  value={rescueForm.medications}
                  onChange={(e) => updateRescueField("medications", e.target.value)}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <h2 className="text-lg font-semibold">Liên hệ khẩn cấp</h2>

            <div className="space-y-4">
              {contacts.map((contact, index) => {
                const fieldErrors = contactErrors[index] ?? {};
                const key = contact.id ?? `new-${index}`;

                return (
                  <div
                    key={key}
                    data-testid={`emergency-contact-${index}`}
                    className="space-y-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Liên hệ {index + 1}
                        {contact.isPrimary ? " · Liên hệ chính" : ""}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => setContacts(moveEmergencyContact(contacts, index, -1))}
                        >
                          Lên
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === contacts.length - 1}
                          onClick={() => setContacts(moveEmergencyContact(contacts, index, 1))}
                        >
                          Xuống
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
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

                    <div className="flex items-center justify-between gap-2">
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
                        Xóa
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
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
