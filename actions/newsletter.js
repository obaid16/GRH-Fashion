"use server";

import connectDB from "../lib/db";
import Newsletter from "../models/Newsletter";
import { revalidatePath } from "next/cache";

// Get All Subscribers
export async function getSubscribers() {
  try {
    await connectDB();
    const list = await Newsletter.find().sort({ createdAt: -1 });
    return { success: true, subscribers: JSON.parse(JSON.stringify(list)) };
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return { success: false, error: "Failed to load subscribers" };
  }
}

// Add subscriber (triggered by frontend newsletter form)
export async function addSubscriber(email) {
  try {
    await connectDB();
    const formattedEmail = email.toLowerCase().trim();

    if (!formattedEmail) {
      return { success: false, error: "Email is required" };
    }

    const existing = await Newsletter.findOne({ email: formattedEmail });
    if (existing) {
      return { success: true, message: "You are already subscribed!" };
    }

    await Newsletter.create({ email: formattedEmail });
    return { success: true, message: "Thank you for subscribing to GRH Atelier!" };
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

// Delete subscriber
export async function deleteSubscriber(id) {
  try {
    await connectDB();
    await Newsletter.findByIdAndDelete(id);
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, error: "Failed to delete subscriber" };
  }
}

// Export Subscribers to CSV String
export async function exportSubscribersToCSV() {
  try {
    await connectDB();
    const list = await Newsletter.find().sort({ createdAt: -1 });
    
    let csvContent = "Email,SubscribedAt\n";
    list.forEach((sub) => {
      csvContent += `${sub.email},"${new Date(sub.createdAt).toISOString()}"\n`;
    });

    return { success: true, csv: csvContent };
  } catch (error) {
    console.error("Error exporting subscribers:", error);
    return { success: false, error: "Failed to compile CSV" };
  }
}

// Send Broadcast simulation
export async function sendNewsletterBroadcast(subject, bodyText) {
  try {
    await connectDB();
    const list = await Newsletter.find();
    if (list.length === 0) {
      return { success: false, error: "No subscribers found to send to." };
    }

    console.log(`Sending email broadcast to ${list.length} users with subject: "${subject}"`);
    
    // Simulate SMTP dispatch delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return { success: true, count: list.length };
  } catch (error) {
    console.error("Error sending newsletter broadcast:", error);
    return { success: false, error: "Failed to dispatch broadcast newsletter." };
  }
}
