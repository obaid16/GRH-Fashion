"use server";

import connectDB from "../lib/db";
import Review from "../models/Review";
import { revalidatePath } from "next/cache";

// Get All Reviews
export async function getReviews(status = "") {
  try {
    await connectDB();
    const query = {};
    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return { success: true, reviews: JSON.parse(JSON.stringify(reviews)) };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

// Update Review Status (Approve / Reject)
export async function updateReviewStatus(id, status) {
  try {
    await connectDB();
    const review = await Review.findById(id);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    review.status = status;
    await review.save();
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, review: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, error: "Failed to update review status" };
  }
}

// Toggle Featured Review on Homepage
export async function toggleFeaturedReview(id) {
  try {
    await connectDB();
    const review = await Review.findById(id);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    review.isFeatured = !review.isFeatured;
    await review.save();
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, review: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    console.error("Error toggling featured review:", error);
    return { success: false, error: "Failed to update review featured state" };
  }
}

// Delete Review
export async function deleteReview(id) {
  try {
    await connectDB();
    await Review.findByIdAndDelete(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}
