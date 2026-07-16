"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  uploadAvatar,
  AvatarUploadError,
  MAX_AVATAR_SIZE_BYTES,
  ALLOWED_AVATAR_TYPES,
} from "@/lib/supabase/storage";

type Props = {
  cardId: string;
  avatarUrl: string | null;
  onUploaded: (url: string) => void;
};

// .png suffix matters: without it placehold.co serves image/svg+xml, which
// next/image refuses to optimize unless images.dangerouslyAllowSVG is set.
const FALLBACK_AVATAR = "https://placehold.co/200x200.png";

export default function AvatarUploader({ cardId, avatarUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setError("Ảnh vượt quá dung lượng tối đa 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const publicUrl = await uploadAvatar(cardId, file);
      onUploaded(publicUrl);
    } catch (err) {
      setError(err instanceof AvatarUploadError ? err.message : "Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setPreview(null);
    }
  }

  const displaySrc = avatarUrl || FALLBACK_AVATAR;

  return (
    <div className="space-y-1.5">
      <Label>Ảnh đại diện</Label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-input disabled:opacity-50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not eligible for next/image optimization
            <img
              src={preview}
              alt="Xem trước ảnh đại diện"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image src={displaySrc} alt="Ảnh đại diện" fill className="object-cover" />
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
              Đang tải...
            </div>
          )}
        </button>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            {uploading ? "Đang tải lên..." : "Đổi ảnh đại diện"}
          </button>
          <p className="text-xs text-muted-foreground">JPEG, PNG hoặc WebP, tối đa 5MB</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
