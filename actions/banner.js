"use server";

import connectDB from "../lib/db";
import Banner from "../models/Banner";
import { revalidatePath } from "next/cache";

// Get All Banners
export async function getBanners() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return { success: true, banners: JSON.parse(JSON.stringify(banners)) };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { success: false, error: "Failed to fetch banners" };
  }
}

// Create Banner
export async function createBanner(bannerData) {
  try {
    await connectDB();
    const newBanner = new Banner(bannerData);
    await newBanner.save();
    revalidatePath("/admin/banners");
    return { success: true, banner: JSON.parse(JSON.stringify(newBanner)) };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: error.message || "Failed to create banner" };
  }
}

// Update Banner
export async function updateBanner(id, bannerData) {
  try {
    await connectDB();
    const updated = await Banner.findByIdAndUpdate(id, bannerData, { new: true });
    revalidatePath("/admin/banners");
    return { success: true, banner: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: error.message || "Failed to update banner" };
  }
}

// Delete Banner
export async function deleteBanner(id) {
  try {
    await connectDB();
    await Banner.findByIdAndDelete(id);
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}
