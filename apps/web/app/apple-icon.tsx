import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same minimal brand mark as app/icon.tsx, sized for iOS home-screen
// bookmarks (apple-touch-icon's conventional 180x180).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563EB",
          color: "#FFFFFF",
          fontSize: 112,
          fontWeight: 700,
        }}
      >
        Z
      </div>
    ),
    { ...size }
  );
}
