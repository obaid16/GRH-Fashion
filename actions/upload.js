"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFileToCloudinary(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      throw new Error("No file uploaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      // Use resource_type: "auto" to support both images and PDFs
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "grh_fashion_inquiries", resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve({ url: result.secure_url });
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Server action upload error:", error);
    throw error;
  }
}
