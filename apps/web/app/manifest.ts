import type { MetadataRoute } from "next";

// Colors match docs/08_UI.md's documented brand palette (Primary #2563EB,
// Background #F8FAFC) -- the shadcn theme in app/globals.css hasn't been
// updated to match yet (see CLAUDE.md's noted divergence), but the manifest
// is new code, so it follows the documented brand rather than the
// placeholder neutral theme.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Z-TOUCH",
    short_name: "Z-TOUCH",
    description: "Nền tảng hồ sơ số thông minh qua NFC và QR Code",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
