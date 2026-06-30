"use server";

import connectDB from "../lib/db";
import Collection from "../models/Collection";
import { revalidatePath } from "next/cache";

// Get All Collections
export async function getCollections() {
  try {
    await connectDB();
    const collections = await Collection.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(collections));
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

// Create Collection
export async function createCollection(formData) {
  try {
    await connectDB();
    const name = formData.name;
    const slug = formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.description || "";
    const image = formData.image || "";
    const isFeatured = formData.isFeatured === true;

    // Check slug uniqueness
    const existing = await Collection.findOne({ slug });
    if (existing) {
      return { success: false, error: "A collection with this slug already exists." };
    }

    const newColl = await Collection.create({ name, slug, description, image, isFeatured });

    revalidatePath("/admin/collections");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, collection: JSON.parse(JSON.stringify(newColl)) };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error: error.message || "Failed to create collection." };
  }
}

// Update Collection
export async function updateCollection(collectionId, formData) {
  try {
    await connectDB();
    const coll = await Collection.findById(collectionId);
    if (!coll) {
      return { success: false, error: "Collection not found" };
    }

    const name = formData.name;
    const slug = formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.description;
    const image = formData.image;
    const isFeatured = formData.isFeatured === true;

    // Check slug uniqueness if changed
    if (slug !== coll.slug) {
      const existing = await Collection.findOne({ slug });
      if (existing) {
        return { success: false, error: "A collection with this slug already exists." };
      }
    }

    const updated = await Collection.findByIdAndUpdate(
      collectionId,
      { name, slug, description, image, isFeatured },
      { new: true }
    );

    revalidatePath("/admin/collections");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, collection: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { success: false, error: error.message || "Failed to update collection" };
  }
}

// Delete Collection
export async function deleteCollection(collectionId) {
  try {
    await connectDB();
    await Collection.findByIdAndDelete(collectionId);
    revalidatePath("/admin/collections");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}
