/* eslint-disable @next/next/no-img-element */
"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useClient } from "@/hooks/useClient"
import { IconCamera } from "@tabler/icons-react"
import { Spinner } from "./Spinner"
import { getMxcUrl } from "@/lib/utils"

export function UploadImageButton({
  imageSrcs,
  setImageSrcs,
}: {
  imageSrcs: string | string[]
  setImageSrcs:
    | Dispatch<SetStateAction<string[]>>
    | Dispatch<SetStateAction<string>>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const client = useClient()
  // console.log("file", file)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setLoading(true)
    }
  }

  useEffect(() => {
    try {
      file &&
        client?.uploadFile(file).then((result: any) => {
          console.log("result", result)
          if (typeof imageSrcs === "string") {
            const newImageSrc = getMxcUrl(result.content_uri)
            console.log("newImageSrc", newImageSrc)
            ;(setImageSrcs as Dispatch<SetStateAction<string>>)(newImageSrc)
          } else {
            const newImageSrcs = [...imageSrcs, getMxcUrl(result.content_uri)]
            console.log("newImageSrcs", newImageSrcs)
            ;(setImageSrcs as Dispatch<SetStateAction<string[]>>)(newImageSrcs)
          }
          setFile(null)
          setLoading(false)
        })
      // if (!result) return
    } catch (error) {
      console.error("error", error)
    }
  }, [file, imageSrcs, setImageSrcs, client])

  return (
    <div className="">
      <label
        htmlFor="image"
        className="border-primary flex cursor-pointer items-center justify-center rounded-[100%] border border-dashed px-2 py-1 text-[#9572ff]">
        {loading ? (
          <Spinner className="text-primary h-4 w-4 animate-spin fill-[#9572ff]" />
        ) : (
          <IconCamera size={16} />
        )}
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        id="image"
        className="hidden"
      />
    </div>
  )
}
