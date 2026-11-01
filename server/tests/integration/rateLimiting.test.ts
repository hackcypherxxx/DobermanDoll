import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Rate Limiting", () => {
  it("should allow normal requests and include rate limit headers", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.headers["ratelimit"]).toBeDefined();
  });
});
