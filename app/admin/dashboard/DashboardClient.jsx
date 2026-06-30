"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Users,
  IndianRupee,
  Activity,
  ArrowUpRight,
  Package,
  Calendar,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const COLORS = ["#AC8D5D", "#A9847A", "#6B6864", "#DED6C8", "#54514F", "#0F0E0E", "#1C1A19"];

export default function DashboardClient({ initialData }) {
  const [mounted, setMounted] = useState(false);
  const { stats, recentOrders, recentActivities, monthlySales, orderStatuses, topProducts } = initialData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair text-brand-ivory uppercase tracking-wider">Atelier Overview</h1>
          <p className="text-xs font-poppins text-brand-gray tracking-widest uppercase mt-1">Real-time statistics & editorial metrics</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-poppins text-brand-gold bg-brand-gold/10 px-4 py-2 border border-brand-gold/20 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 text-brand-gold">
              <IndianRupee className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-2xl font-playfair text-brand-ivory mb-1 font-semibold">{formatCurrency(stats.totalRevenue)}</h3>
          <span className="text-[10px] font-poppins text-brand-gold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% from last month
          </span>
        </motion.div>

        {/* Orders */}
        <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rosegold/5 rounded-full blur-2xl group-hover:bg-brand-rosegold/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-brand-ivory">
              <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-2xl font-playfair text-brand-ivory mb-1 font-semibold">{stats.totalOrders}</h3>
          <span className="text-[10px] font-poppins text-brand-gray flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" strokeWidth={1.5} /> Active requests pending
          </span>
        </motion.div>

        {/* Products */}
        <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-brand-ivory">
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-2xl font-playfair text-brand-ivory mb-1 font-semibold">{stats.totalProducts}</h3>
          <span className="text-[10px] font-poppins text-brand-gray">
            <span className="text-brand-gold">{stats.activeProducts}</span> active, <span className="text-red-400">{stats.outOfStock}</span> out of stock
          </span>
        </motion.div>

        {/* Customers */}
        <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Total Clients</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-brand-ivory">
              <Users className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-2xl font-playfair text-brand-ivory mb-1 font-semibold">{stats.totalCustomers}</h3>
          <span className="text-[10px] font-poppins text-brand-gray">
            Newsletter subscribers synced
          </span>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Analytics Chart */}
        <motion.div variants={cardVariants} className="lg:col-span-2 bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Sales & Revenue</span>
              <h4 className="text-base font-playfair text-brand-ivory uppercase tracking-wider mt-1">Monthly Analytics</h4>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AC8D5D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#AC8D5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="month" stroke="#54514F" fontSize={10} fontFamily="var(--font-poppins)" />
                  <YAxis stroke="#54514F" fontSize={10} fontFamily="var(--font-poppins)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F0E0E", borderColor: "#AC8D5D" }}
                    labelClassName="font-poppins text-brand-gold text-xs"
                    itemStyle={{ color: "#EFEBE3", fontFamily: "var(--font-inter)", fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#AC8D5D" fillOpacity={1} fill="url(#colorRev)" strokeWidth={1.5} name="Revenue (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-[#161515] animate-pulse rounded-lg"></div>
            )}
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md flex flex-col h-[400px]">
          <div>
            <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Order Pipeline</span>
            <h4 className="text-base font-playfair text-brand-ivory uppercase tracking-wider mt-1">Status Distribution</h4>
          </div>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center mt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatuses.filter(s => s.value > 0).length > 0 ? orderStatuses.filter(s => s.value > 0) : [{ name: "No Orders", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F0E0E", borderColor: "rgba(255,255,255,0.1)" }}
                    itemStyle={{ color: "#EFEBE3", fontSize: 11 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    formatter={(value) => <span className="text-[10px] text-brand-gray font-poppins">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-[#161515] animate-pulse rounded-lg"></div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Latest Orders & Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Orders */}
        <motion.div variants={cardVariants} className="xl:col-span-2 bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base font-playfair text-brand-ivory uppercase tracking-wider">Latest Inquiries</h4>
            <Link href="/admin/orders" className="flex items-center gap-1 text-[10px] font-poppins text-brand-gold uppercase tracking-wider hover:underline">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Inquiry ID</th>
                  <th className="pb-3 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Client</th>
                  <th className="pb-3 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Amount</th>
                  <th className="pb-3 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/2">
                      <td className="py-3.5 font-inter text-xs font-medium text-brand-gold">{order.orderId}</td>
                      <td className="py-3.5 font-inter text-xs text-brand-ivory">{order.customerDetails.name}</td>
                      <td className="py-3.5 font-inter text-xs text-brand-ivory">{formatCurrency(order.finalAmount)}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-poppins uppercase tracking-wider font-semibold border ${
                          order.status === "Delivered"
                            ? "bg-green-950/20 border-green-500/30 text-green-400"
                            : order.status === "Pending"
                            ? "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                            : order.status === "Cancelled"
                            ? "bg-red-950/20 border-red-500/30 text-red-400"
                            : "bg-blue-950/20 border-blue-500/30 text-blue-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-inter text-xs text-brand-gray">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-xs font-inter text-brand-gray">
                      No customer inquiries found. Seed database to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activities & Top Products */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
            <h4 className="text-base font-playfair text-brand-ivory uppercase tracking-wider mb-6">Top Creations</h4>
            <div className="space-y-4">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#161515] overflow-hidden border border-white/5 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-inter text-xs text-brand-ivory truncate">{p.name}</h5>
                    <span className="text-[9px] font-poppins text-brand-gray">{formatCurrency(p.price)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[9px] font-poppins text-brand-gold uppercase tracking-wider">
                    <Package className="w-3 h-3 text-brand-gold" />
                    <span>{p.sales} sales</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities Timeline */}
          <motion.div variants={cardVariants} className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
            <h4 className="text-base font-playfair text-brand-ivory uppercase tracking-wider mb-6">Recent Activity</h4>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${act.type === "order" ? "bg-brand-gold" : "bg-blue-400"}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-[11px] text-brand-ivory/80 leading-relaxed">{act.message}</p>
                      <span className="text-[9px] font-poppins text-brand-gray">
                        {new Date(act.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-inter text-brand-gray text-center py-4">No recent activities.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
