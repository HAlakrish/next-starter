/* Create a Salt and Hash a Password */

/**
 * This module provides functions to salt and hash passwords, as well as to verify them.
 * It uses the Web Crypto API to generate a random salt and hash the password using SHA-256.
 * This is compatible with Edge Runtime.
 */

/**
 * Salt and hash a password using SHA-256 with Web Crypto API.
 * The salt is generated randomly and prepended to the hash.
 *
 * @param {string} password - The plaintext password to be salted and hashed.
 * @returns {Promise<string>} - The salted and hashed password in the format "salt:hash".
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  // Generate a random salt (16 bytes)
  const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
  const salt = Array.from(saltBuffer, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  // Convert password to Uint8Array
  const passwordBuffer = new TextEncoder().encode(password + salt);

  // Hash the password with the salt using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", passwordBuffer);
  const hash = Array.from(new Uint8Array(hashBuffer), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  // Return the combined salt and hash
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a salted hash using Web Crypto API.
 *
 * @param {string} password - The plaintext password to verify.
 * @param {string} storedHash - The stored hash in the format "salt:hash".
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    // Split the stored hash into salt and hash
    const [salt, hash] = storedHash.split(":");

    if (!salt || !hash) {
      return false;
    }

    // Convert password to Uint8Array
    const passwordBuffer = new TextEncoder().encode(password + salt);

    // Hash the provided password with the same salt
    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordBuffer);
    const hashToVerify = Array.from(new Uint8Array(hashBuffer), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    // Compare the hashes using a constant-time comparison
    return timingSafeEqual(hash, hashToVerify);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export default {
  saltAndHashPassword,
  verifyPassword,
};
