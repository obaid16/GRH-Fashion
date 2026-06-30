"use server";

import connectDB from "../lib/db";
import Setting from "../models/Setting";
import { ensureAdminAndDbSeeded } from "../lib/seed";
import { revalidatePath } from "next/cache";

// Get All Settings
export async function getSettings() {
  try {
    await connectDB();
    await ensureAdminAndDbSeeded(); // Auto-seeding check

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.findOne();
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

// Update Global Settings
export async function updateSettings(settingsData) {
  try {
    await connectDB();
    const settings = await Setting.findOne();
    if (!settings) {
      return { success: false, error: "Settings configuration not found" };
    }

    // Merge nested updates
    const updated = await Setting.findByIdAndUpdate(
      settings._id,
      {
        ...settingsData,
        socialLinks: {
          ...settings.socialLinks,
          ...settingsData.socialLinks,
        },
        contactDetails: {
          ...settings.contactDetails,
          ...settingsData.contactDetails,
        },
        seoDefaults: {
          ...settings.seoDefaults,
          ...settingsData.seoDefaults,
        },
        smtp: {
          ...settings.smtp,
          ...settingsData.smtp,
        },
        paymentKeys: {
          ...settings.paymentKeys,
          ...settingsData.paymentKeys,
        },
      },
      { new: true }
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, settings: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message || "Failed to save settings" };
  }
}
