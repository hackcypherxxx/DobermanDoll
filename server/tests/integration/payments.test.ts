import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Payments API", () => {
  it("should reject unauthenticated payment confirmation", async () => {
    const res = await request(app).post("/api/v1/admin/orders/123/confirm-payment");
    expect(res.status).toBe(401);
  });
});
