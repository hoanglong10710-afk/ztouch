"use client";

import { QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/CopyButton";

type Props = {
  publicId: string;
};

export default function QRCodeDialog({ publicId }: Props) {
  const url = `${window.location.origin}/p/${publicId}`;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            <QrCodeIcon className="size-4" />
            QR
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mã QR hồ sơ</DialogTitle>
          <DialogDescription>
            Quét mã để mở trang hồ sơ công khai.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center rounded-lg bg-background p-4">
          <QRCode value={url} size={200} />
        </div>

        <p className="break-all text-center text-sm text-muted-foreground">
          {url}
        </p>

        <CopyButton value={url} />
      </DialogContent>
    </Dialog>
  );
}
