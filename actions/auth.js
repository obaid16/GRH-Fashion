"use server";

import connectDB from "../lib/db";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ensureAdminAndDbSeeded } from "../lib/seed";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_token_key_for_grh_fashion_2026";

// Login Action
export async function adminLogin(formData) {
  try {
    // Self-healing database check
    await ensureAdminAndDbSeeded();

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, error: "Please enter all fields" };
    }

    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return { success: false, error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "strict",
    });

    return {
      success: true,
      user: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Login server action error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// Get Current User Action
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_session");
    
    if (!tokenCookie) {
      return null;
    }

    const token = tokenCookie.value;
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions,
    };
  } catch (error) {
    return null;
  }
}

// Logout Action
export async function adminLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

// Change Password Action
export async function changeAdminPassword(oldPassword, newPassword) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const admin = await Admin.findById(session.id);
    if (!admin) {
      return { success: false, error: "Admin not found" };
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return { success: false, error: "Current password does not match" };
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNew;
    await admin.save();

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Failed to change password" };
  }
}

// Register New Admin (Super Admin only)
export async function registerAdmin(adminData) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "Super Admin") {
      return { success: false, error: "Unauthorized. Super Admin permissions required." };
    }

    const { name, email, password, role, permissions } = adminData;

    await connectDB();

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return { success: false, error: "An admin with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      permissions: permissions || [],
    });

    return { success: true };
  } catch (error) {
    console.error("Register admin error:", error);
    return { success: false, error: "Failed to register admin." };
  }
}

// Delete Admin (Super Admin only)
export async function deleteAdmin(adminId) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "Super Admin") {
      return { success: false, error: "Unauthorized." };
    }

    if (session.id === adminId) {
      return { success: false, error: "You cannot delete your own admin account." };
    }

    await connectDB();
    await Admin.findByIdAndDelete(adminId);
    return { success: true };
  } catch (error) {
    console.error("Delete admin error:", error);
    return { success: false, error: "Failed to delete admin." };
  }
}

// Get All Admins
export async function getAllAdmins() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return [];
    }

    await connectDB();
    const admins = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    console.error("Get admins error:", error);
    return [];
  }
}
