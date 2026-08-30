import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

const MAX_BYTES = 5 * 1024 * 1024

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminKey = cookieStore.get("admin_key")?.value
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) return true
  return Boolean(cookieStore.get("user_token")?.value)
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "falta el archivo" }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: "solo se aceptan imágenes JPEG, PNG o WEBP" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "la imagen no puede pesar más de 5MB" }, { status: 400 })
  }

  const filename = `${randomUUID()}.${ext}`
  await mkdir(UPLOAD_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)

  return NextResponse.json({ path: `/uploads/${filename}` })
}
