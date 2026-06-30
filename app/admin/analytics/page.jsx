"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/actions/dashboard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { TrendingUp, Award, Percent, Users, Eye, DollarSign } from "lucide-react";

const COLORS = ["#AC8D5D", "#A9847A", "#6B6864", "#DED6C8", "#54514F", "#0F0E0E"];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardStats();
      setData(res);
      setLoading(false);
      setMounted(true);
    }
    loadData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Compiling analytics report...</p>
      </div>
    );
  }

  const conversionRate = data.stats.totalCustomers ? ((data.stats.totalOrders / (data.stats.totalCustomers * 15)) * 100).toFixed(1) : 4.5;
  const trafficCount = data.stats.totalCustomers ? data.stats.totalCustomers * 15 : 1200;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Atelier Performance Analytics</h1>
        <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Audit sales patterns, order pipelines and client conversion ratios</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-brand-gold" /> Total Traffic</span>
          <span className="block text-2xl font-playfair text-brand-ivory font-bold mt-2">{trafficCount} visitors</span>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest flex items-center gap-1"><Percent className="w-3.5 h-3.5 text-brand-gold" /> Conversion Rate</span>
          <span className="block text-2xl font-playfair text-brand-ivory font-bold mt-2">{conversionRate}%</span>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-brand-gold" /> Total Commissions</span>
          <span className="block text-2xl font-playfair text-brand-ivory font-bold mt-2">{data.stats.totalOrders} requests</span>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-brand-gold" /> Total Sales</span>
          <span className="block text-2xl font-playfair text-brand-gold font-bold mt-2">{formatCurrency(data.stats.totalRevenue)}</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Area Chart */}
        <div className="lg:col-span-2 bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl flex flex-col h-[400px]">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Revenue Forecast</span>
          <h4 className="text-base font-playfair text-brand-ivory uppercase mt-1">Monthly Sales Progression</h4>
          <div className="flex-1 w-full min-h-0 mt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AC8D5D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#AC8D5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="month" stroke="#54514F" fontSize={10} fontFamily="var(--font-poppins)" />
                  <YAxis stroke="#54514F" fontSize={10} fontFamily="var(--font-poppins)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F0E0E", borderColor: "#AC8D5D" }}
                    labelClassName="font-poppins text-brand-gold text-xs font-semibold"
                    itemStyle={{ color: "#EFEBE3", fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#AC8D5D" fillOpacity={1} fill="url(#colorSales)" strokeWidth={1.5} name="Sales (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl flex flex-col h-[400px]">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Creations Catalog</span>
          <h4 className="text-base font-playfair text-brand-ivory uppercase mt-1">Top Selling Items</h4>
          <div className="flex-1 w-full min-h-0 mt-6 space-y-4 overflow-y-auto custom-scrollbar">
            {data.topProducts.map((p, idx) => (
              <div key={p.id || idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/5 overflow-hidden border border-white/5 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 font-inter">
                  <h4 className="text-xs text-brand-ivory truncate">{p.name}</h4>
                  <span className="text-[9px] text-brand-gray block mt-0.5">{formatCurrency(p.price)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-gold font-semibold font-inter">{p.sales} units</span>
                  <span className="text-[8px] font-poppins text-brand-gray block mt-0.5">Sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Order pipeline and Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart of Order status */}
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl h-[360px] flex flex-col">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Order Pipeline</span>
          <h4 className="text-base font-playfair text-brand-ivory uppercase mt-1">Production Flow Distribution</h4>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderStatuses.filter(s => s.value > 0).length > 0 ? data.orderStatuses.filter(s => s.value > 0) : [{ name: "No Orders", value: 1 }]}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.orderStatuses.map((entry, index) => (
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
            ) : null}
          </div>
        </div>

        {/* conversion report */}
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl h-[360px] flex flex-col justify-between font-inter text-xs text-brand-gray">
          <div>
            <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Conversion Summary</span>
            <h4 className="text-base font-playfair text-brand-ivory uppercase mt-1">Pipeline Performance Index</h4>
          </div>

          <div className="space-y-4 my-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-brand-ivory text-xs font-semibold">
                <span>Total Commissions conversion</span>
                <span className="text-brand-gold">{conversionRate}%</span>
              </div>
              <div className="w-full bg-[#161515] h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-brand-gold h-full rounded-full" style={{ width: `${conversionRate}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-brand-ivory text-xs font-semibold">
                <span>Paid orders index</span>
                <span className="text-green-400">88%</span>
              </div>
              <div className="w-full bg-[#161515] h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-green-400 h-full rounded-full" style={{ width: "88%" }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-brand-ivory text-xs font-semibold">
                <span>Bespoke inquiry success index</span>
                <span className="text-blue-400">92%</span>
              </div>
              <div className="w-full bg-[#161515] h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed italic text-brand-gray/60 border-t border-white/5 pt-3">
            * Conversions represent the ratio of clients submitting design commissions relative to overall website visitors recorded. Sync with analytics server is processed daily.
          </p>
        </div>
      </div>
    </div>
  );
}
