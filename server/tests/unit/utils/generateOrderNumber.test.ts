import { describe, it, expect } from "vitest";
import { generateOrderNumber } from "../../../src/utils/generateOrderNumber.js";

describe("generateOrderNumber", () => {
  it("should format correctly", () => {
    const num = generateOrderNumber(0);
    expect(num).toMatch(/^RD-\d{4}-000001$/);
  });
});
