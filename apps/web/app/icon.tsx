import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Minimal brand mark (Primary #2563EB from docs/08_UI.md) until a real logo
// exists -- generated in code so no binary asset pipeline is needed.
export default function Icon() {
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
          fontSize: 120,
          fontWeight: 700,
        }}
      >
        Z
      </div>
    ),
    { ...size }
  );
}
