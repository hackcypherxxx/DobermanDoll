import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Orders API", () => {
  it("should reject invalid order data", async () => {
    const res = await request(app).post("/api/v1/orders").send({ customer: {} });
    expect(res.status).toBe(400);
  });
});
