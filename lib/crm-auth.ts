import { timingSafeEqual } from "crypto"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const COOKIE_NAME = "crm_session"

function getJwtSecret() {
  const secret = process.env.CRM_JWT_SECRET || (process.env.NODE_ENV !== "production" ? "dev-crm-jwt-secret-change-me" : "")
  if (!secret) throw new Error("CRM_JWT_SECRET is required in production")
  return new TextEncoder().encode(secret)
}

export { COOKIE_NAME }

export function getAdminUsername() {
  return (
    process.env.CRM_ADMIN_USERNAME?.trim() ||
    process.env.CRM_ADMIN_ID?.trim() ||
    process.env.ADMIN_USERNAME?.trim() ||
    "admin"
  )
}

function safeEqualString(a: string, b: string) {
  const left = Buffer.from(a, "utf8")
  const right = Buffer.from(b, "utf8")
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function verifyAdminUsername(username: string): Promise<boolean> {
  return safeEqualString(username.trim(), getAdminUsername())
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.CRM_ADMIN_PASSWORD_HASH
  const plain = process.env.CRM_ADMIN_PASSWORD

  if (hash) {
    try {
      return await bcrypt.compare(password, hash)
    } catch {
      return false
    }
  }

  if (plain) {
    return safeEqualString(password, plain)
  }

  if (process.env.NODE_ENV !== "production") {
    return password === "admin1234"
  }

  return false
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const userOk = await verifyAdminUsername(username)
  const passOk = await verifyAdminPassword(password)
  return userOk && passOk
}

export async function signCrmSessionToken() {
  const secret = getJwtSecret()
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("crm-admin")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
  return token
}

export async function verifyCrmSessionToken(token: string | undefined): Promise<{ role: string } | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    if (payload.role !== "admin") return null
    return { role: "admin" }
  } catch {
    return null
  }
}

export function crmSessionCookieOptions(expires: Date) {
  const secure = process.env.NODE_ENV === "production"
  return {
    httpOnly: true as const,
    secure,
    sameSite: "lax" as const,
    path: "/",
    expires,
  }
}
