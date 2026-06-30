"use server";

import connectDB from "../lib/db";
import Order from "../models/Order";
import Customer from "../models/Customer";
import { revalidatePath } from "next/cache";

// Get All Orders with Filters
export async function getOrders(filters = {}) {
  try {
    await connectDB();
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
    if (filters.search) {
      query.$or = [
        { orderId: { $regex: filters.search, $options: "i" } },
        { "customerDetails.name": { $regex: filters.search, $options: "i" } },
        { "customerDetails.email": { $regex: filters.search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// Update Order Status (with automated timeline logging)
export async function updateOrderStatus(orderId, status, details = {}) {
  try {
    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    order.status = status;

    // Push timeline log
    const title = details.title || `Status updated to ${status}`;
    const description = details.description || `The order status was changed to ${status.toLowerCase()} by an administrator.`;
    
    order.timeline.push({
      status,
      title,
      description,
      timestamp: new Date(),
    });

    await order.save();
    revalidatePath("/admin/orders");
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// Update Payment Status
export async function updateOrderPaymentStatus(orderId, paymentStatus) {
  try {
    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    order.paymentStatus = paymentStatus;
    await order.save();
    revalidatePath("/admin/orders");
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Error updating order payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

// Create Order (primarily triggered when client submits an inquiry form)
export async function createOrder(inquiryData) {
  try {
    await connectDB();

    // 1. Generate elegant Order/Inquiry ID
    const count = await Order.countDocuments();
    const orderId = `GRH-${1000 + count + 1}`;

    // 2. Try to locate customer or create one
    let customerDoc = await Customer.findOne({ email: inquiryData.email.toLowerCase() });
    if (!customerDoc) {
      customerDoc = await Customer.create({
        name: inquiryData.name,
        email: inquiryData.email.toLowerCase(),
        phone: inquiryData.phone,
        address: {
          address: inquiryData.address || "",
          city: inquiryData.city || "",
          state: inquiryData.state || "",
          zip: inquiryData.zip || "",
          country: "India",
        },
      });
    }

    // 3. Formulate order items
    const items = inquiryData.items || [];
    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += (item.price || 0) * (item.quantity || 1);
    });

    const newOrder = new Order({
      orderId,
      customer: customerDoc._id,
      customerDetails: {
        name: inquiryData.name,
        email: inquiryData.email.toLowerCase(),
        phone: inquiryData.phone,
      },
      items,
      totalAmount,
      discountAmount: inquiryData.discountAmount || 0,
      finalAmount: Math.max(0, totalAmount - (inquiryData.discountAmount || 0)),
      status: "Pending",
      paymentStatus: "Pending",
      shippingAddress: {
        address: inquiryData.address || "",
        city: inquiryData.city || "",
        state: inquiryData.state || "",
        zip: inquiryData.zip || "",
        country: "India",
      },
      timeline: [
        {
          status: "Pending",
          title: "Inquiry Submitted",
          description: `Custom design request submitted by client ${inquiryData.name}. Atelier review pending.`,
        },
      ],
    });

    await newOrder.save();
    revalidatePath("/admin/orders");
    return { success: true, order: JSON.parse(JSON.stringify(newOrder)) };
  } catch (error) {
    console.error("Error creating inquiry order:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

// Delete Order
export async function deleteOrder(orderId) {
  try {
    await connectDB();
    await Order.findByIdAndDelete(orderId);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}
