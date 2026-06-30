"use client";

import { useState, useEffect } from "react";
import { Search, User, MapPin, Ban, Trash2, ShieldCheck, Mail, Phone, Calendar, ShoppingBag, X } from "lucide-react";
import { getCustomers, toggleBlockCustomer, deleteCustomer, getCustomerOrderHistory } from "@/actions/customer";

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Selection details state
  const [selectedCust, setSelectedCust] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await getCustomers(search);
    if (res.success) {
      setCustomers(res.customers);
      if (selectedCust) {
        const refreshed = res.customers.find(c => c._id === selectedCust._id);
        setSelectedCust(refreshed || null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  // Load selected customer history
  const handleSelectCustomer = async (cust) => {
    setSelectedCust(cust);
    setHistoryLoading(true);
    const history = await getCustomerOrderHistory(cust._id);
    setOrderHistory(history);
    setHistoryLoading(false);
  };

  const handleBlockToggle = async (cust) => {
    const action = cust.isBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} client ${cust.name}?`)) return;
    const res = await toggleBlockCustomer(cust._id);
    if (res.success) {
      fetchCustomers();
    } else {
      alert(res.error || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer record? Inquiries linked to this customer will remain in the database.")) return;
    const res = await deleteCustomer(id);
    if (res.success) {
      if (selectedCust?._id === id) setSelectedCust(null);
      fetchCustomers();
    } else {
      alert(res.error || "Failed to delete");
    }
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
        <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Clients Database</h1>
        <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Audit customer details and order histories</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search clients name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-brand-ivory focus:outline-none w-full font-inter"
          />
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Customers Table */}
        <div className="lg:col-span-2 bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying clients records...</p>
            </div>
          ) : customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Client</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Inquiries</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Total Spend</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Member Since</th>
                    <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Status</th>
                    <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-inter">
                  {customers.map((c) => (
                    <tr
                      key={c._id}
                      onClick={() => handleSelectCustomer(c)}
                      className={`cursor-pointer hover:bg-white/2 transition-colors ${
                        selectedCust?._id === c._id ? "bg-brand-gold/5" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center border border-brand-gold/30">
                            <span className="font-poppins text-xs font-semibold text-brand-gold">{c.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-brand-ivory">{c.name}</h4>
                            <span className="text-[10px] text-brand-gray block mt-0.5">{c.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-brand-ivory">{c.totalOrders || 0}</td>
                      <td className="p-4 text-xs font-semibold text-brand-gold">{formatCurrency(c.totalSpend || 0)}</td>
                      <td className="p-4 text-xs text-brand-gray">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-poppins uppercase tracking-wider font-semibold border ${
                          c.isBlocked
                            ? "bg-red-950/20 border-red-500/30 text-red-400"
                            : "bg-green-950/20 border-green-500/30 text-green-400"
                        }`}>
                          {c.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleBlockToggle(c)}
                            title={c.isBlocked ? "Unblock Client" : "Block Client"}
                            className={`p-1.5 rounded hover:bg-white/5 transition-colors ${
                              c.isBlocked ? "text-green-400" : "text-brand-gray hover:text-red-400"
                            }`}
                          >
                            {c.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            title="Delete Client Record"
                            className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest">
              No customer records found.
            </div>
          )}
        </div>

        {/* Right Side: Customer Detailed Side View */}
        <div className="lg:col-span-1">
          {selectedCust ? (
            <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl p-6 backdrop-blur-md space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-bold font-playfair">
                    {selectedCust.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-poppins font-semibold text-brand-ivory">{selectedCust.name}</h3>
                    <span className={`text-[9px] font-poppins uppercase tracking-wider font-semibold ${
                      selectedCust.isBlocked ? "text-red-400" : "text-green-400"
                    }`}>{selectedCust.isBlocked ? "Access Revoked" : "Authorized Client"}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCust(null)}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 text-brand-gray hover:text-brand-ivory transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-brand-gray">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="text-brand-ivory select-all">{selectedCust.email}</span>
                </div>
                {selectedCust.phone && (
                  <div className="flex items-center gap-3 text-xs text-brand-gray">
                    <Phone className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-ivory select-all">{selectedCust.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-brand-gray">
                  <Calendar className="w-4 h-4 text-brand-gold" />
                  <span>Joined on {new Date(selectedCust.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-white/5 pt-4">
                <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Default Address
                </span>
                {selectedCust.address && selectedCust.address.address ? (
                  <p className="text-xs text-brand-gray leading-relaxed p-3 bg-white/2 border border-white/5 rounded-lg">
                    {selectedCust.address.address}<br />
                    {selectedCust.address.city}, {selectedCust.address.state} - {selectedCust.address.zip}<br />
                    {selectedCust.address.country || "India"}
                  </p>
                ) : (
                  <p className="text-xs text-brand-gray/60 italic">No address details stored.</p>
                )}
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="bg-[#161515] p-3 rounded-lg border border-white/5">
                  <span className="block text-[8px] font-poppins text-brand-gray uppercase tracking-widest">Total Inquiries</span>
                  <span className="block text-lg font-playfair text-brand-ivory mt-1 font-semibold">{selectedCust.totalOrders}</span>
                </div>
                <div className="bg-[#161515] p-3 rounded-lg border border-white/5">
                  <span className="block text-[8px] font-poppins text-brand-gray uppercase tracking-widest">Total Spend</span>
                  <span className="block text-lg font-playfair text-brand-gold mt-1 font-semibold">{formatCurrency(selectedCust.totalSpend)}</span>
                </div>
              </div>

              {/* Order History List */}
              <div className="border-t border-white/5 pt-4">
                <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" /> Commission history
                </span>
                
                {historyLoading ? (
                  <div className="text-center py-4 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider">Syncing orders...</span>
                  </div>
                ) : orderHistory.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {orderHistory.map((order) => (
                      <div key={order._id} className="p-3 bg-white/2 border border-white/5 hover:border-brand-gold/20 rounded-lg flex items-center justify-between transition-colors">
                        <div>
                          <span className="block text-xs font-semibold text-brand-gold">{order.orderId}</span>
                          <span className="block text-[9px] text-brand-gray mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-brand-ivory font-semibold">{formatCurrency(order.finalAmount)}</span>
                          <span className="block text-[8px] font-poppins uppercase tracking-wider font-semibold text-brand-gold mt-0.5">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-gray/60 italic">No orders found.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0F0E0E]/40 border border-white/5 border-dashed rounded-xl p-8 text-center text-xs font-poppins text-brand-gray uppercase tracking-widest">
              Select a client to view address profile and pipeline logs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
