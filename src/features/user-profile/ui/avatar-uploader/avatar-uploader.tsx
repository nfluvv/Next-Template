"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/ui"

import { getAvatarUploadSignature, saveAvatarUrl } from "../../api/avatar"

type AvatarUploaderProps = {
  currentImage: string | null
  fallback: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export const AvatarUploader = ({
  currentImage,
  fallback,
}: AvatarUploaderProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = "" // сброс инпута — повторный выбор того же файла снова сработает

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Можно загружать только изображения")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Максимальный размер файла — 2MB")
      return
    }

    setIsUploading(true)

    try {
      const signatureResult = await getAvatarUploadSignature()
      if (!signatureResult.success) {
        toast.error(signatureResult.error)
        return
      }

      const {
        timestamp,
        signature,
        apiKey,
        cloudName,
        folder,
        publicId,
        transformation,
      } = signatureResult.data

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("timestamp", String(timestamp))
      formData.append("signature", signature)
      formData.append("folder", folder)
      formData.append("public_id", publicId)
      formData.append("overwrite", "true")
      formData.append("invalidate", "true")
      formData.append("transformation", transformation)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!uploadRes.ok) {
        throw new Error("Не удалось загрузить файл в Cloudinary")
      }

      const uploaded = await uploadRes.json()

      const saveResult = await saveAvatarUrl(uploaded.secure_url)
      if (!saveResult.success) {
        toast.error(saveResult.error)
        return
      }

      setPreview(uploaded.secure_url)
      toast.success("Аватар обновлён")
      router.refresh()
    } catch {
      toast.error("Не удалось загрузить аватар")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={preview ?? undefined} alt="" />
        <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
      </Avatar>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Загружаем..." : "Изменить аватар"}
        </Button>
      </div>
    </div>
  )
}
