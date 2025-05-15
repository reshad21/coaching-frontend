import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import profileImg from "@/assets/default.jpg";

interface ImageUploadProps {
  name: string;
  fileTypes?: string;
  defaultUrl?: string;
}

export const ImageUpload = ({
  name,
  fileTypes = "image/jpeg,image/png,image/gif,image/jpg,image/webp",
  defaultUrl,
}: ImageUploadProps) => {
  const { setValue } = useFormContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const defaultImage = defaultUrl ? `http://localhost:3000${defaultUrl}` : profileImg;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setValue(name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
        Upload Profile Picture
      </label>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-300 shadow-sm">
          <img
            src={selectedImage || defaultImage}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Choose File
          </Button>
          <span className="text-sm text-gray-600 truncate">{fileName}</span>
          <input
            id="image-upload"
            type="file"
            accept={fileTypes}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">Supported formats: JPEG, PNG, GIF. Max size 800KB.</p>
    </div>
  );
};
