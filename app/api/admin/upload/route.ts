import { promises as fs } from "fs"
import path from "path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"
import { readInquiries, updateInquiry } from "@/lib/inquiries"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"])

const uploadDir = path.join(process.cwd(), "data", "uploads")

async function ensureDir() {
  await fs.mkdir(uploadDir, { recursive: true })
}

export async function GET(request: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const name = searchParams.get("f") || ""
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return NextResponse.json({ ok: false, message: "잘못된 파일명입니다." }, { status: 400 })
  }

  const filePath = path.join(uploadDir, name)
  try {
    const buf = await fs.readFile(filePath)
    const ext = name.toLowerCase()
    const type = ext.endsWith(".png") ? "image/png" : ext.endsWith(".webp") ? "image/webp" : "image/jpeg"
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ ok: false, message: "파일을 찾을 수 없습니다." }, { status: 404 })
  }
}

async function ocrBusinessCard(imagePath: string, mime: string): Promise<Record<string, string> | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const buf = await fs.readFile(imagePath)
  const b64 = buf.toString("base64")
  const dataUrl = `data:${mime};base64,${b64}`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract business card fields from this image. Return JSON only with keys: name, company, email, phone (use empty string if missing). Japanese/Korean/English mixed is OK.`,
            },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get("file")
  const inquiryId = typeof form.get("inquiryId") === "string" ? (form.get("inquiryId") as string) : ""
  const wantOcr = form.get("ocr") === "true"

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ ok: false, message: "파일이 필요합니다." }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, message: "파일은 5MB 이하만 허용됩니다." }, { status: 400 })
  }

  const mime = file.type || "application/octet-stream"
  if (!ALLOWED.has(mime)) {
    return NextResponse.json({ ok: false, message: "JPEG, PNG, WEBP만 업로드할 수 있습니다." }, { status: 400 })
  }

  const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg"
  const id = crypto.randomUUID()
  const filename = `${id}${ext}`

  await ensureDir()
  const arrayBuf = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuf)
  const filePath = path.join(uploadDir, filename)
  await fs.writeFile(filePath, buffer)

  let ocr: Record<string, string> | null = null
  if (wantOcr) {
    ocr = await ocrBusinessCard(filePath, mime)
  }

  if (inquiryId) {
    const inquiries = await readInquiries()
    if (inquiries.some((i) => i.id === inquiryId)) {
      await updateInquiry(inquiryId, { businessCardFile: filename })
    }
  }

  return NextResponse.json({
    ok: true,
    filename,
    url: `/api/admin/upload?f=${encodeURIComponent(filename)}`,
    ocr,
  })
}
