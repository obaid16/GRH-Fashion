"use server";

import connectDB from "../lib/db";
import Homepage from "../models/Homepage";
import { ensureAdminAndDbSeeded } from "../lib/seed";
import { revalidatePath } from "next/cache";

// Get Homepage Content
export async function getHomepageData() {
  try {
    await connectDB();
    
    // Ensure database is seeded with layout configurations
    await ensureAdminAndDbSeeded();

    let data = await Homepage.findOne();
    if (!data) {
      // Re-query in case it was just seeded
      data = await Homepage.findOne();
    }

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return null;
  }
}

// Update Homepage Section
export async function updateHomepageSection(sectionName, sectionData) {
  try {
    await connectDB();
    
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return { success: false, error: "Homepage configuration not found. Seed first." };
    }

    homepage[sectionName] = {
      ...homepage[sectionName],
      ...sectionData,
    };

    await homepage.save();
    revalidatePath("/");
    return { success: true, homepage: JSON.parse(JSON.stringify(homepage)) };
  } catch (error) {
    console.error(`Error updating homepage section ${sectionName}:`, error);
    return { success: false, error: `Failed to update section ${sectionName}` };
  }
}

// Update Testimonials list directly
export async function updateHomepageTestimonials(testimonialsList) {
  try {
    await connectDB();
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return { success: false, error: "Homepage configuration not found." };
    }

    homepage.testimonials = testimonialsList;
    await homepage.save();
    revalidatePath("/");
    return { success: true, homepage: JSON.parse(JSON.stringify(homepage)) };
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return { success: false, error: "Failed to update testimonials." };
  }
}
