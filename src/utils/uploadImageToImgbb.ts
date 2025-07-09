/* eslint-disable @typescript-eslint/no-explicit-any */

const API_KEY = "ea784d7a26f75de5f19cf80483b1b128"; 
export const uploadImageToImgbb = async (file: File): Promise<string> => {

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result?.error?.message || "Image upload failed");
  }

  return result.data.url; 
};
