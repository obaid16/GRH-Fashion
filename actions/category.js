"use server";

import connectDB from "../lib/db";
import Category from "../models/Category";
import { revalidatePath } from "next/cache";

// Get All Categories
export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Create Category
export async function createCategory(formData) {
  try {
    await connectDB();
    const name = formData.name;
    const slug = formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const image = formData.image || "";
    const description = formData.description || "";
    const banner = formData.banner || "";
    const isFeatured = formData.isFeatured === true;

    // Check slug uniqueness
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return { success: false, error: "A category with this slug already exists." };
    }

    const newCategory = await Category.create({
      name,
      slug,
      image,
      description,
      banner,
      isFeatured,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, category: JSON.parse(JSON.stringify(newCategory)) };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message || "Failed to create category." };
  }
}

// Update Category
export async function updateCategory(categoryId, formData) {
  try {
    await connectDB();
    const category = await Category.findById(categoryId);
    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const name = formData.name;
    const slug = formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const image = formData.image;
    const description = formData.description;
    const banner = formData.banner;
    const isFeatured = formData.isFeatured === true;

    // Check slug uniqueness if updated
    if (slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return { success: false, error: "A category with this slug already exists." };
      }
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { name, slug, image, description, banner, isFeatured },
      { new: true }
    );

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, category: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: error.message || "Failed to update category" };
  }
}

// Delete Category
export async function deleteCategory(categoryId) {
  try {
    await connectDB();
    await Category.findByIdAndDelete(categoryId);
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
