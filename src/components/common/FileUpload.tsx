/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useFormContext, Controller, Control } from "react-hook-form";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  name: string;
  control: Control<any>;
  fileTypes?: string;
}

export const FileUpload = ({ name, control, fileTypes = "application/pdf" }: FileUploadProps) => {
  const { setValue } = useFormContext();
  const [fileName, setFileName] = useState("No file chosen");

  // Create a ref for the file input to trigger it programmatically
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Function to trigger file input on click
  const handleBrowseClick = () => {
    fileInputRef.current?.click(); // Trigger file input click programmatically
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <div className="border border-gray-300 rounded-lg p-4 text-center flex flex-col items-center justify-center">
          {/* Upload Icon */}
          <UploadCloud className="w-12 h-12 text-gray-500" />

          {/* Upload Text */}
          <p className="text-sm text-gray-500 mt-2">
            Drag files here to upload or{" "}
            <span
              onClick={handleBrowseClick} // Trigger file input on click
              className="text-blue-600 cursor-pointer"
            >
              browse for files
            </span>
          </p>

          {/* Hidden Input */}
          <input
            ref={fileInputRef} // Associate ref to file input
            type="file"
            accept={fileTypes}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFileName(file.name);
                setValue(name, file); // Pass the file directly to setValue
                onChange(file); // Pass the file to onChange
              }
            }}
          />
          {/* Display selected file name */}
          <p className="text-sm text-gray-500 mt-2">{fileName}</p>
        </div>
      )}
    />
  );
};
