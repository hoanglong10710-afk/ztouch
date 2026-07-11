"use client";

import QRCode from "react-qr-code";
import CopyButton from "@/components/CopyButton";

type Props = {
  url: string;
};

export default function QRCodePanel({ url }: Props) {
  return (
    <>
      <div className="flex justify-center rounded-lg bg-background p-4">
        <QRCode value={url} size={200} />
      </div>

      <p className="break-all text-center text-sm text-muted-foreground">{url}</p>

      <CopyButton value={url} />
    </>
  );
}
