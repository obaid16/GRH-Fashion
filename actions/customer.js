"use server";

import connectDB from "../lib/db";
import Customer from "../models/Customer";
import Order from "../models/Order";
import { revalidatePath } from "next/cache";

// Get All Customers (aggregates their order counts and total spend dynamically)
export async function getCustomers(search = "") {
  try {
    await connectDB();
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    
    // Aggregate order data for each customer
    const customerListWithStats = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ customer: cust._id });
        let totalSpend = 0;
        orders.forEach(o => {
          if (o.status !== "Cancelled") {
            totalSpend += o.finalAmount || 0;
          }
        });
        
        return {
          ...cust.toObject(),
          totalOrders: orders.length,
          totalSpend,
        };
      })
    );

    return { success: true, customers: JSON.parse(JSON.stringify(customerListWithStats)) };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Failed to load customers" };
  }
}

// Toggle block customer
export async function toggleBlockCustomer(customerId) {
  try {
    await connectDB();
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    revalidatePath("/admin/customers");
    return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    console.error("Error blocking customer:", error);
    return { success: false, error: "Failed to block customer" };
  }
}

// Delete customer
export async function deleteCustomer(customerId) {
  try {
    await connectDB();
    await Customer.findByIdAndDelete(customerId);
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}

// Get customer detailed order history
export async function getCustomerOrderHistory(customerId) {
  try {
    await connectDB();
    const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching order history:", error);
    return [];
  }
}
