import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Messages API", () => {
  it("should validate contact form payload", async () => {
    const res = await request(app).post("/api/v1/contact").send({});
    expect(res.status).toBe(400);
  });
});
