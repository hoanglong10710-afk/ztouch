import { describe, it, expect } from "vitest";
import { classifySource, classifyReferrer, classifyDevice } from "./classify";

describe("classifySource", () => {
  it("classifies qr", () => {
    expect(classifySource("qr")).toBe("qr");
  });

  it("classifies nfc", () => {
    expect(classifySource("nfc")).toBe("nfc");
  });

  it("classifies a missing param as link", () => {
    expect(classifySource(undefined)).toBe("link");
  });

  it("classifies an unrecognized value as unknown", () => {
    expect(classifySource("email")).toBe("unknown");
  });

  it("classifies an empty string as unknown", () => {
    expect(classifySource("")).toBe("unknown");
  });

  it("classifies a repeated query param (array) as unknown", () => {
    expect(classifySource(["qr", "nfc"])).toBe("unknown");
  });
});

describe("classifyReferrer", () => {
  it("classifies a missing referer as direct", () => {
    expect(classifyReferrer(null)).toBe("direct");
  });

  it("classifies an empty referer as direct", () => {
    expect(classifyReferrer("")).toBe("direct");
  });

  it.each([
    "https://www.google.com/search?q=x",
    "https://google.com.vn/",
  ])("classifies %s as google", (referer) => {
    expect(classifyReferrer(referer)).toBe("google");
  });

  it.each([
    "https://www.facebook.com/",
    "https://m.facebook.com/",
    "https://l.facebook.com/l.php",
    "https://fb.me/xyz",
  ])("classifies %s as facebook", (referer) => {
    expect(classifyReferrer(referer)).toBe("facebook");
  });

  it.each(["https://www.instagram.com/", "https://l.instagram.com/"])(
    "classifies %s as instagram",
    (referer) => {
      expect(classifyReferrer(referer)).toBe("instagram");
    }
  );

  it.each(["https://zalo.me/", "https://h5.zaloapp.com/"])(
    "classifies %s as zalo",
    (referer) => {
      expect(classifyReferrer(referer)).toBe("zalo");
    }
  );

  it("classifies an unrecognized host as other", () => {
    expect(classifyReferrer("https://news.ycombinator.com/")).toBe("other");
  });

  it("classifies an unparseable referer as other", () => {
    expect(classifyReferrer("not-a-url")).toBe("other");
  });
});

describe("classifyDevice", () => {
  const IPHONE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
  const IPAD_UA =
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
  const ANDROID_PHONE_UA =
    "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 Mobile Safari/537.36";
  const ANDROID_TABLET_UA =
    "Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36 Safari/537.36";
  const DESKTOP_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

  it("classifies a missing User-Agent as desktop", () => {
    expect(classifyDevice(null)).toBe("desktop");
  });

  it("classifies iPhone as mobile", () => {
    expect(classifyDevice(IPHONE_UA)).toBe("mobile");
  });

  it("classifies iPad as tablet", () => {
    expect(classifyDevice(IPAD_UA)).toBe("tablet");
  });

  it("classifies an Android phone as mobile", () => {
    expect(classifyDevice(ANDROID_PHONE_UA)).toBe("mobile");
  });

  it("classifies an Android tablet as tablet", () => {
    expect(classifyDevice(ANDROID_TABLET_UA)).toBe("tablet");
  });

  it("classifies a desktop browser as desktop", () => {
    expect(classifyDevice(DESKTOP_UA)).toBe("desktop");
  });
});
