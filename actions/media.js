"use server";

import connectDB from "../lib/db";
import Media from "../models/Media";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get Media Files
export async function getMedia(options = {}) {
  try {
    await connectDB();
    const { folder = "/", search = "" } = options;

    const query = { folder };

    if (search) {
      delete query.folder; // Search globally if text is inputted
      query.name = { $regex: search, $options: "i" };
    }

    const files = await Media.find(query).sort({ createdAt: -1 });

    // Distinct list of folders for folder-explorer structure
    const allFolders = await Media.distinct("folder");
    const folderList = allFolders.filter(f => f !== "/");

    return {
      success: true,
      files: JSON.parse(JSON.stringify(files)),
      folders: folderList,
    };
  } catch (error) {
    console.error("Error fetching media:", error);
    return { success: false, error: "Failed to fetch media library items" };
  }
}

// Add Media item (primarily called after a successful client upload)
export async function createMedia(mediaData) {
  try {
    await connectDB();
    const newMedia = new Media(mediaData);
    await newMedia.save();
    revalidatePath("/admin/media");
    return { success: true, media: JSON.parse(JSON.stringify(newMedia)) };
  } catch (error) {
    console.error("Error saving media metadata:", error);
    return { success: false, error: "Failed to log media file" };
  }
}

// Rename Media item
export async function renameMedia(id, newName) {
  try {
    await connectDB();
    const media = await Media.findById(id);
    if (!media) {
      return { success: false, error: "File not found" };
    }

    // Keep extension if rename did not provide one
    const ext = media.name.split(".").pop();
    let finalName = newName;
    if (!newName.endsWith(`.${ext}`)) {
      finalName = `${newName}.${ext}`;
    }

    media.name = finalName;
    await media.save();
    revalidatePath("/admin/media");
    return { success: true, media: JSON.parse(JSON.stringify(media)) };
  } catch (error) {
    console.error("Error renaming media:", error);
    return { success: false, error: "Failed to rename file" };
  }
}

// Delete Media item (from DB + Cloudinary)
export async function deleteMedia(id) {
  try {
    await connectDB();
    const media = await Media.findById(id);
    if (!media) {
      return { success: false, error: "File not found" };
    }

    // Delete from Cloudinary
    if (media.publicId) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(media.publicId, (error, result) => {
          if (error) {
            console.error("Cloudinary delete error:", error);
            resolve(); // Still proceed to delete from DB even if Cloudinary fails
          } else {
            resolve(result);
          }
        });
      });
    }

    await Media.findByIdAndDelete(id);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Error deleting media item:", error);
    return { success: false, error: "Failed to delete file from storage" };
  }
}
