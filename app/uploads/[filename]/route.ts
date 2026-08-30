import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import path from "node:path"

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { filename } = await params

  // filename viene de un segmento de ruta de Next (ya sin "/"), pero igual
  // se valida el formato antes de tocar el filesystem — nada de traversal.
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(filename)) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  const ext = filename.split(".").pop() as string

  try {
    const data = await readFile(path.join(UPLOAD_DIR, filename))
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }
}
