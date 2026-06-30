"use server";

import connectDB from "../lib/db";
import Product from "../models/Product";
import Category from "../models/Category";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Review from "../models/Review";

export async function getDashboardStats() {
  try {
    await connectDB();

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      totalCategories,
      totalOrders,
      totalCustomers,
      recentOrders,
      recentReviews,
      allOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "Published" }),
      Product.countDocuments({ stock: 0 }),
      Category.countDocuments(),
      Order.countDocuments(),
      Customer.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Review.find().populate("product").sort({ createdAt: -1 }).limit(4),
      Order.find({ status: { $ne: "Cancelled" } })
    ]);

    // Calculate revenue (only count paid orders or non-cancelled orders)
    let totalRevenue = 0;
    allOrders.forEach(o => {
      totalRevenue += o.finalAmount || 0;
    });

    // Mock Sales Chart Data by month
    const monthlyDataMap = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach(m => {
      monthlyDataMap[m] = { month: m, revenue: 0, orders: 0 };
    });

    // Populate actual order data into monthly map
    allOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const monthName = months[date.getMonth()];
      if (monthlyDataMap[monthName]) {
        monthlyDataMap[monthName].revenue += o.finalAmount || 0;
        monthlyDataMap[monthName].orders += 1;
      }
    });

    const monthlySales = Object.values(monthlyDataMap);

    // Order status break down
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
      Returned: 0
    };

    const statusList = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    statusList.forEach(s => {
      if (statusCounts[s._id] !== undefined) {
        statusCounts[s._id] = s.count;
      }
    });

    const orderStatuses = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    // Top Selling Products - Aggregate order items
    // Since we don't have extensive sales, let's query products and mock sales count if actual orders are few
    const topProductsAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", count: { $sum: "$items.quantity" }, name: { $first: "$items.name" }, price: { $first: "$items.price" }, image: { $first: "$items.image" } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);

    let topProducts = topProductsAgg.map(p => ({
      id: p._id ? p._id.toString() : "",
      name: p.name,
      price: p.price,
      image: p.image,
      sales: p.count
    }));

    if (topProducts.length === 0) {
      // Mock top products from Product collection if there are no order items yet
      const products = await Product.find({ status: "Published" }).limit(4);
      topProducts = products.map((p, i) => ({
        id: p._id ? p._id.toString() : "",
        name: p.name,
        price: p.price,
        image: p.thumbnail || p.images[0],
        sales: 25 - (i * 5)
      }));
    }

    // Recent Activities list
    const recentActivities = [];
    
    // Add orders activity
    recentOrders.forEach(o => {
      recentActivities.push({
        type: "order",
        message: `Order ${o.orderId} placed by ${o.customerDetails.name} for ₹${o.finalAmount.toLocaleString()}`,
        time: o.createdAt,
      });
    });

    // Add products activity
    const recentAddedProducts = await Product.find().sort({ createdAt: -1 }).limit(3);
    recentAddedProducts.forEach(p => {
      recentActivities.push({
        type: "product",
        message: `New product "${p.name}" added to "${p.category}"`,
        time: p.createdAt,
      });
    });

    // Sort activities by time
    recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return {
      stats: {
        totalProducts,
        activeProducts,
        outOfStock,
        totalCategories,
        totalOrders,
        totalRevenue,
        totalCustomers,
      },
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      recentReviews: JSON.parse(JSON.stringify(recentReviews)),
      recentActivities: JSON.parse(JSON.stringify(recentActivities.slice(0, 5))),
      monthlySales,
      orderStatuses,
      topProducts: JSON.parse(JSON.stringify(topProducts))
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      stats: { totalProducts: 0, activeProducts: 0, outOfStock: 0, totalCategories: 0, totalOrders: 0, totalRevenue: 0, totalCustomers: 0 },
      recentOrders: [],
      recentReviews: [],
      recentActivities: [],
      monthlySales: [],
      orderStatuses: [],
      topProducts: []
    };
  }
}
