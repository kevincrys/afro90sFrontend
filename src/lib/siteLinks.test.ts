import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_INSTAGRAM_URL, getInstagramUrl } from "@/lib/siteLinks";

describe("getInstagramUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns default Afro90s profile when env is unset", () => {
    expect(getInstagramUrl()).toBe(DEFAULT_INSTAGRAM_URL);
  });

  it("prefers VITE_INSTAGRAM_URL when set", () => {
    vi.stubEnv("VITE_INSTAGRAM_URL", "https://instagram.com/custom");
    expect(getInstagramUrl()).toBe("https://instagram.com/custom");
  });
});
