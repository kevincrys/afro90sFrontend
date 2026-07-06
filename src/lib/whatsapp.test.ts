import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
  buildWhatsAppContactUrl,
  getWhatsAppNumber,
  isWhatsAppConfigured,
} from "@/lib/whatsapp";

const sampleOrder = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  fullPrice: 99.8,
  items: [{ productId: "p1", productName: "Óculos Vintage", quantity: 2, unitPrice: 49.9 }],
  customer: {
    name: "Maria Silva",
    address: "Rua A, 1",
    postalCode: "01310-100",
    tel: "11999999999",
  },
};

describe("whatsapp", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads digits-only phone from env", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "+55 11 99999-9999");
    expect(getWhatsAppNumber()).toBe("5511999999999");
    expect(isWhatsAppConfigured()).toBe(true);
  });

  it("builds wa.me URL with order id and total", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5511999999999");
    const url = buildWhatsAppOrderUrl(sampleOrder);
    expect(url).toMatch(/^https:\/\/wa\.me\/5511999999999\?text=/);
    expect(decodeURIComponent(url!.split("text=")[1])).toContain(sampleOrder.id);
  });

  it("buildWhatsAppOrderMessage includes customer tel", () => {
    const message = buildWhatsAppOrderMessage(sampleOrder);
    expect(message).toContain("Maria Silva");
    expect(message).toContain("11999999999");
  });

  it("buildWhatsAppOrderMessage lists item names", () => {
    const message = buildWhatsAppOrderMessage(sampleOrder);
    expect(message).toContain("Óculos Vintage");
    expect(message).toContain("x2");
  });

  it("buildWhatsAppContactUrl opens wa.me with default message", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5511999999999");
    const url = buildWhatsAppContactUrl();
    expect(url).toMatch(/^https:\/\/wa\.me\/5511999999999\?text=/);
  });
});
