import { describe, it, expect } from "vitest";
import { generateOrderNumber } from "../../../src/utils/generateOrderNumber.js";

describe("Order Service Utils", () => {
  it("should generate order numbers", () => {
    expect(generateOrderNumber(5)).toContain("000006");
  });
});
