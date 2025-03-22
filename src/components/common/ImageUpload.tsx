import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import profileImg from "@/assets/default.jpg"

interface ImageUploadProps {
  name: string
  fileTypes?: string
}

export const ImageUpload = ({ name, fileTypes = "image/jpeg,image/png,image/gif" }: ImageUploadProps) => {
  const { setValue } = useFormContext() 
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState("No file chosen")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setValue(name, file) 
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full">
      <label htmlFor="image-upload" className="block mb-2">Upload File</label>
      <div className="flex items-center gap-4 w-full">
        <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden bg-gray-100">
          <img src={selectedImage || profileImg} alt="Preview" />
        </div>
        <div className="flex-1 border rounded-lg w-full">
          <Button  type="button" variant="secondary" onClick={() => document.getElementById("image-upload")?.click()} className="h-full bg-[#1F2A37] text-white rounded-l-lg rounded-r-none">Choose file</Button>
          <span className="text-gray-500 w-full ps-2">{fileName}</span>
          <input id="image-upload" type="file" accept={fileTypes} className="hidden" onChange={handleImageChange} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">Max size of 800k</p>
    </div>
  )
}
