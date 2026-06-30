"use server";

import connectDB from "../lib/db";
import Blog from "../models/Blog";
import { revalidatePath } from "next/cache";

// Get All Blogs
export async function getBlogs(options = {}) {
  try {
    await connectDB();
    const query = {};

    if (options.status === "Published") {
      query.isPublished = true;
    } else if (options.status === "Draft") {
      query.isPublished = false;
    }

    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: "i" } },
        { content: { $regex: options.search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query).sort({ publishDate: -1 });
    return { success: true, blogs: JSON.parse(JSON.stringify(blogs)) };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, error: "Failed to fetch blogs" };
  }
}

// Create Blog Post
export async function createBlog(blogData) {
  try {
    await connectDB();

    const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return { success: false, error: "A blog post with this slug already exists" };
    }

    const newBlog = new Blog({
      ...blogData,
      slug,
    });

    await newBlog.save();
    revalidatePath("/admin/blog");
    return { success: true, blog: JSON.parse(JSON.stringify(newBlog)) };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error: error.message || "Failed to create blog post" };
  }
}

// Update Blog Post
export async function updateBlog(id, blogData) {
  try {
    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return { success: false, error: "Blog post not found" };
    }

    const slug = blogData.slug || blog.slug;
    if (slug !== blog.slug) {
      const existing = await Blog.findOne({ slug });
      if (existing) {
        return { success: false, error: "A blog post with this slug already exists" };
      }
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      { ...blogData, slug },
      { new: true }
    );

    revalidatePath("/admin/blog");
    return { success: true, blog: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: error.message || "Failed to update blog post" };
  }
}

// Delete Blog Post
export async function deleteBlog(id) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(id);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}
