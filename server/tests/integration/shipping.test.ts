import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Shipping API", () => {
  it("should reject unauthenticated shipping update", async () => {
    const res = await request(app).post("/api/v1/admin/orders/123/ship");
    expect(res.status).toBe(401);
  });
});
