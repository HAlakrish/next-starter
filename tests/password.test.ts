import { saltAndHashPassword, verifyPassword } from "../src/utils/password";

describe("password utils", () => {
  it("should hash and verify a password correctly", async () => {
    const password = "TestPassword123!";
    const hash = await saltAndHashPassword(password);
    expect(typeof hash).toBe("string");
    expect(hash).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should not verify an incorrect password", async () => {
    const password = "TestPassword123!";
    const wrongPassword = "WrongPassword!";
    const hash = await saltAndHashPassword(password);
    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it("should return false for malformed hash", async () => {
    const isValid = await verifyPassword("password", "malformedhash");
    expect(isValid).toBe(false);
  });
});
