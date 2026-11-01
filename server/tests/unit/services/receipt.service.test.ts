import { describe, it, expect } from "vitest";
import { receiptService } from "../../../src/services/receipt.service.js";

describe("receiptService", () => {
  it("should generate a PDF buffer", async () => {
    const mockOrder: any = {
      orderNumber: "RD-2026-000001",
      customer: { name: "Test", email: "test@test.com" },
      items: [{ name: "Doll", quantity: 1, unitPrice: 100, lineTotal: 100 }],
      subtotal: 100, shippingFee: 15, total: 115,
    };
    const pdf = await receiptService.generateReceiptPdf(mockOrder);
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.length).toBeGreaterThan(0);
  });
});
