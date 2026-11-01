import { describe, it, expect } from "vitest";
import { formatCurrency } from "../../../src/utils/currency.js";

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency(135)).toBe("$135.00");
  });
});
