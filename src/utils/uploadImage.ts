
export const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data?.url) {
        throw new Error("Image upload failed");
    }

    return data.url; // e.g., "/images/image-1746986772235.webp"
};
