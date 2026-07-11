import { HeartPulse, IdCard, Nfc, Plus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

type Benefit = {
  icon: typeof Nfc;
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: Nfc,
    title: "NFC",
    description: "Chạm điện thoại vào thẻ NFC để mở hồ sơ ngay lập tức.",
  },
  {
    icon: QrCode,
    title: "Mã QR",
    description: "Không có NFC? Quét mã QR cũng mở được hồ sơ.",
  },
  {
    icon: IdCard,
    title: "Hồ sơ số",
    description: "Lưu thông tin liên hệ và mạng xã hội ở một nơi duy nhất.",
  },
  {
    icon: HeartPulse,
    title: "Thông tin khẩn cấp",
    description: "Có thể thêm thông tin y tế cho các tình huống cần hỗ trợ.",
  },
];

type Props = {
  onCreateCard: () => void;
};

export default function EmptyState({ onCreateCard }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow">
      <h2 className="text-2xl font-semibold text-foreground">
        Chào mừng bạn đến với Z-TOUCH
      </h2>

      <p className="mt-2 text-muted-foreground">
        Hồ sơ Z-TOUCH là một trang thông tin số của bạn — chia sẻ số điện
        thoại, mạng xã hội và các liên kết chỉ bằng một lần chạm NFC hoặc quét
        mã QR.
      </p>

      <ul className="mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />

            <div>
              <p className="font-medium text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full sm:w-auto"
        onClick={onCreateCard}
      >
        <Plus className="size-4" />
        Tạo hồ sơ mới
      </Button>

      <p className="mt-3 text-xs text-muted-foreground">
        Bạn có thể tạo nhiều hồ sơ khác nhau trong cùng một tài khoản.
      </p>
    </div>
  );
}
