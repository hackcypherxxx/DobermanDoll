import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Tracking API", () => {
  it("should reject invalid tracking token", async () => {
    const res = await request(app).get("/api/v1/orders/track/invalidtoken123");
    expect(res.status).toBe(404);
  });
});
