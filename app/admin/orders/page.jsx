"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Clock,
  Printer,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  Trash2,
  Calendar,
  X,
  FileText,
} from "lucide-react";
import { getOrders, updateOrderStatus, updateOrderPaymentStatus, deleteOrder } from "@/actions/order";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  
  // Selection / Details state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDesc, setTimelineDesc] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getOrders({ search, status, paymentStatus });
    if (res.success) {
      setOrders(res.orders);
      // Refresh selected order details if open
      if (selectedOrder) {
        const refreshed = res.orders.find((o) => o._id === selectedOrder._id);
        setSelectedOrder(refreshed || null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [search, status, paymentStatus]);

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdateLoading(true);
    const res = await updateOrderStatus(selectedOrder._id, newStatus, {
      title: timelineTitle || `Status updated to ${newStatus}`,
      description: timelineDesc || `Order state transitioned to ${newStatus.toLowerCase()}.`,
    });
    if (res.success) {
      setTimelineTitle("");
      setTimelineDesc("");
      fetchOrders();
    } else {
      alert(res.error || "Failed to update status");
    }
    setUpdateLoading(false);
  };

  // Handle payment status update
  const handlePaymentStatusChange = async (newPayStatus) => {
    if (!selectedOrder) return;
    setUpdateLoading(true);
    const res = await updateOrderPaymentStatus(selectedOrder._id, newPayStatus);
    if (res.success) {
      fetchOrders();
    } else {
      alert(res.error || "Failed to update payment status");
    }
    setUpdateLoading(false);
  };

  // Delete Order
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order/inquiry?")) return;
    const res = await deleteOrder(id);
    if (res.success) {
      if (selectedOrder?._id === id) setSelectedOrder(null);
      fetchOrders();
    } else {
      alert(res.error || "Delete failed");
    }
  };

  // Invoice Printer Helper
  const printInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <strong>${item.name}</strong><br/>
          <small>Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #333; margin: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #AC8D5D; padding-bottom: 20px; }
            .logo { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: bold; color: #000; letter-spacing: 2px; }
            .invoice-details { text-align: right; }
            .billing-shipping { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: 30px; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #F8F6F2; padding: 10px; border-bottom: 1px solid #AC8D5D; text-align: left; font-size: 12px; text-transform: uppercase; }
            .totals { float: right; width: 300px; margin-top: 20px; }
            .totals table { margin-bottom: 0; }
            .totals td { padding: 8px 0; }
            .footer { margin-top: 100px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">GRH FASHION</div>
              <p>Atelier Luxury Couture & Bespoke Embroidery</p>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
          <div class="billing-shipping">
            <div>
              <h4>CLIENT DETAILS</h4>
              <p><strong>Name:</strong> ${order.customerDetails.name}</p>
              <p><strong>Email:</strong> ${order.customerDetails.email}</p>
              <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
            </div>
            <div>
              <h4>SHIPPING ADDRESS</h4>
              <p>${order.shippingAddress.address || "N/A"}</p>
              <p>${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""}</p>
              <p>Zip: ${order.shippingAddress.zip || "N/A"}</p>
              <p>Country: ${order.shippingAddress.country || "India"}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Details</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="width: 100%; display: inline-block;">
            <div class="totals">
              <table style="width: 100%;">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right;">₹${order.totalAmount.toLocaleString()}</td>
                </tr>
                ${order.discountAmount > 0 ? `
                <tr>
                  <td>Discount Code:</td>
                  <td style="text-align: right; color: red;">-₹${order.discountAmount.toLocaleString()}</td>
                </tr>` : ""}
                <tr style="border-top: 1px solid #ddd; font-weight: bold;">
                  <td style="padding-top: 10px; font-size: 16px;">Total Amount:</td>
                  <td style="text-align: right; padding-top: 10px; font-size: 16px; color: #AC8D5D;">₹${order.finalAmount.toLocaleString()}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing GRH Atelier. Your custom order is crafted on request with estimated timeline of 6-8 weeks.</p>
            <p>GRH Fashion | grh-fashion.vercel.app</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Orders & Inquiries</h1>
        <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Manage client custom design commissions & pipeline</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search Order ID, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-brand-ivory focus:outline-none w-full font-inter"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="">Order Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="">Payment: All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Orders list / detailed view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Orders list */}
        <div className="lg:col-span-2 bg-[#0F0E0E]/80 border border-white/5 rounded-xl backdrop-blur-md overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying orders pipeline...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Order ID</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Client details</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Payment</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Amount</th>
                    <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-inter">
                  {orders.map((o) => (
                    <tr
                      key={o._id}
                      onClick={() => setSelectedOrder(o)}
                      className={`cursor-pointer hover:bg-white/2 transition-colors ${
                        selectedOrder?._id === o._id ? "bg-brand-gold/5" : ""
                      }`}
                    >
                      <td className="p-4 text-xs font-semibold text-brand-gold">{o.orderId}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-brand-ivory font-medium">{o.customerDetails.name}</span>
                          <span className="text-[10px] text-brand-gray mt-0.5">{o.customerDetails.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-poppins uppercase tracking-wider font-semibold border ${
                          o.status === "Delivered"
                            ? "bg-green-950/20 border-green-500/30 text-green-400"
                            : o.status === "Pending"
                            ? "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                            : o.status === "Cancelled"
                            ? "bg-red-950/20 border-red-500/30 text-red-400"
                            : "bg-blue-950/20 border-blue-500/30 text-blue-400"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-medium ${
                          o.paymentStatus === "Paid" ? "text-green-400" : "text-yellow-400"
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-brand-ivory font-semibold">{formatCurrency(o.finalAmount)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(o._id);
                          }}
                          className="p-1 rounded hover:bg-red-500/10 text-brand-gray hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest">
              No orders or inquiries found.
            </div>
          )}
        </div>

        {/* Right Side: Order Detail Card */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl p-6 backdrop-blur-md space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Selected Order</span>
                  <h3 className="text-base font-playfair text-brand-gold font-bold">{selectedOrder.orderId}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => printInvoice(selectedOrder)}
                    title="Print Invoice"
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-brand-ivory transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-brand-gray hover:text-brand-ivory transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="bg-[#161515]/60 border border-white/5 p-4 rounded-lg space-y-4">
                <h4 className="text-[10px] font-poppins text-brand-gold uppercase tracking-widest">Pipeline Transition</h4>
                
                {/* Status Toggler */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-poppins text-brand-gray uppercase">Status</label>
                    <select
                      value={selectedOrder.status}
                      disabled={updateLoading}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full bg-[#0E0E0E] border border-white/5 rounded py-1 px-2 text-xs text-brand-ivory focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-poppins text-brand-gray uppercase">Payment</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      disabled={updateLoading}
                      onChange={(e) => handlePaymentStatusChange(e.target.value)}
                      className="w-full bg-[#0E0E0E] border border-white/5 rounded py-1 px-2 text-xs text-brand-ivory focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Timeline comments */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="block text-[8px] font-poppins text-brand-gray uppercase">Add Custom Timeline Event (Optional)</span>
                  <input
                    type="text"
                    placeholder="Event Title (e.g. Dispatched via BlueDart)"
                    value={timelineTitle}
                    onChange={(e) => setTimelineTitle(e.target.value)}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded p-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                  <textarea
                    placeholder="Brief description notes..."
                    rows="2"
                    value={timelineDesc}
                    onChange={(e) => setTimelineDesc(e.target.value)}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded p-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  ></textarea>
                </div>
              </div>

              {/* Client & Shipping Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Client Info</span>
                    <span className="block text-xs text-brand-ivory font-medium mt-0.5">{selectedOrder.customerDetails.name}</span>
                    <span className="block text-[10px] text-brand-gray">{selectedOrder.customerDetails.email}</span>
                    <span className="block text-[10px] text-brand-gray">{selectedOrder.customerDetails.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                  <MapPin className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Shipping Address</span>
                    <p className="text-xs text-brand-ivory leading-relaxed mt-0.5">
                      {selectedOrder.shippingAddress.address || "No address provided"}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-white/5 pt-4">
                <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider mb-3">Commissions Items</span>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-12 bg-white/5 border border-white/5 overflow-hidden rounded flex-shrink-0">
                        <img src={item.image || "/images/logo-new.png"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 font-inter">
                        <h4 className="text-xs text-brand-ivory truncate">{item.name}</h4>
                        <span className="block text-[9px] text-brand-gray mt-0.5">
                          Qty: {item.quantity} | Size: {item.size || "Default"} | Color: {item.color || "Default"}
                        </span>
                      </div>
                      <span className="text-xs text-brand-gold font-semibold font-inter">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="border-t border-white/5 pt-4 bg-[#161515]/30 p-4 rounded-lg space-y-2 font-inter text-xs text-brand-gray">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-brand-ivory">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount:</span>
                    <span>- {formatCurrency(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/5 pt-2 text-sm text-brand-ivory font-semibold">
                  <span>Final Total:</span>
                  <span className="text-brand-gold">{formatCurrency(selectedOrder.finalAmount)}</span>
                </div>
              </div>

              {/* Vertical Timeline Tracker */}
              <div className="border-t border-white/5 pt-4">
                <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider mb-4">Pipeline log</span>
                <div className="space-y-6 relative pl-4 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-px before:bg-white/10">
                  {selectedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[16px] top-1 w-2.5 h-2.5 rounded-full bg-brand-gold border-2 border-brand-black"></span>
                      <div className="font-poppins">
                        <span className="block text-xs font-semibold text-brand-ivory">{event.title}</span>
                        <span className="block text-[9px] text-brand-gold uppercase tracking-wider font-medium mt-0.5">
                          {new Date(event.timestamp).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <p className="text-[10px] text-brand-gray mt-1 leading-relaxed font-inter">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0F0E0E]/40 border border-white/5 border-dashed rounded-xl p-8 text-center text-xs font-poppins text-brand-gray uppercase tracking-widest">
              Select an inquiry to view details & timeline log
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
