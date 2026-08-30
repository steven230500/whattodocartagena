"use client"

import { useState } from "react"

interface ImageUploadFieldProps {
  name: string
  label: string
  defaultValue?: string
}

export function ImageUploadField({ name, label, defaultValue }: ImageUploadFieldProps) {
  const [imagePath, setImagePath] = useState(defaultValue ?? "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)

    const body = new FormData()
    body.append("file", file)

    try {
      const res = await fetch("/api/uploads", { method: "POST", body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo subir la imagen")
        return
      }
      setImagePath(data.path)
    } catch {
      setError("No se pudo subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input type="hidden" name={name} value={imagePath} />

      {imagePath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagePath}
          alt=""
          className="w-32 h-24 object-cover rounded-lg border border-border mb-2"
        />
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        className="block w-full text-sm text-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-coral file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-coral-dark disabled:opacity-50"
      />

      {uploading && <p className="text-xs text-muted-foreground mt-1">Subiendo...</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
