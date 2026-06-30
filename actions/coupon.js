"use server";

import connectDB from "../lib/db";
import Coupon from "../models/Coupon";
import { revalidatePath } from "next/cache";

// Get All Coupons
export async function getCoupons() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return { success: true, coupons: JSON.parse(JSON.stringify(coupons)) };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return { success: false, error: "Failed to fetch coupons" };
  }
}

// Create Coupon
export async function createCoupon(couponData) {
  try {
    await connectDB();
    const code = couponData.code.toUpperCase().trim();

    // Check code uniqueness
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return { success: false, error: "Coupon code already exists" };
    }

    const newCoupon = new Coupon({
      ...couponData,
      code,
    });

    await newCoupon.save();
    revalidatePath("/admin/coupons");
    return { success: true, coupon: JSON.parse(JSON.stringify(newCoupon)) };
  } catch (error) {
    console.error("Error creating coupon:", error);
    return { success: false, error: error.message || "Failed to create coupon" };
  }
}

// Update Coupon
export async function updateCoupon(couponId, couponData) {
  try {
    await connectDB();
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return { success: false, error: "Coupon not found" };
    }

    const code = couponData.code ? couponData.code.toUpperCase().trim() : undefined;
    
    // Check code uniqueness if changed
    if (code && code !== coupon.code) {
      const existing = await Coupon.findOne({ code });
      if (existing) {
        return { success: false, error: "Coupon code already exists" };
      }
    }

    const updated = await Coupon.findByIdAndUpdate(
      couponId,
      { ...couponData, ...(code ? { code } : {}) },
      { new: true }
    );

    revalidatePath("/admin/coupons");
    return { success: true, coupon: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating coupon:", error);
    return { success: false, error: error.message || "Failed to update coupon" };
  }
}

// Delete Coupon
export async function deleteCoupon(couponId) {
  try {
    await connectDB();
    await Coupon.findByIdAndDelete(couponId);
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: "Failed to delete coupon" };
  }
}
