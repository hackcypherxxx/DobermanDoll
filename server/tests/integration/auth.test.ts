import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../src/app.js";
import { Admin } from "../../src/modules/auth/admin.model.js";
import argon2 from "argon2";

describe("Auth API", () => {
  beforeAll(async () => {
    // Seed a test admin directly into the in-memory DB
    const passwordHash = await argon2.hash("TestPassword123!");
    await Admin.create({
      email: "testadmin@example.com",
      passwordHash,
      name: "Test Admin",
      role: "SUPER_ADMIN",
    });
  });

  it("should reject login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "testadmin@example.com", password: "WrongPassword!" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should login successfully and set cookies", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "testadmin@example.com", password: "TestPassword123!" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Check for HTTP-only cookies
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("accessToken=");
    expect(cookies[1]).toContain("refreshToken=");
    expect(cookies[0]).toContain("HttpOnly");
  });

  it("should reject unauthenticated access to /me", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authenticated");
  });
});
