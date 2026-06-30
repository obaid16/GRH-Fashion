"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Ticket, Calendar, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/actions/coupon";

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    const res = await getCoupons();
    if (res.success) {
      setCoupons(res.coupons);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openForm = (cp = null) => {
    setError("");
    if (cp) {
      setEditingId(cp._id);
    } else {
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleStatusToggle = async (cp) => {
    const res = await updateCoupon(cp._id, { isActive: !cp.isActive });
    if (res.success) {
      loadCoupons();
    } else {
      alert(res.error || "Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.target);
    const data = {
      code: formData.get("code"),
      discountType: formData.get("discountType"),
      discountValue: parseFloat(formData.get("discountValue")),
      minPurchase: parseFloat(formData.get("minPurchase") || 0),
      maxDiscount: formData.get("maxDiscount") ? parseFloat(formData.get("maxDiscount")) : undefined,
      usageLimit: formData.get("usageLimit") ? parseInt(formData.get("usageLimit")) : undefined,
      expiryDate: formData.get("expiryDate") ? new Date(formData.get("expiryDate")) : undefined,
      isAutoApply: formData.get("isAutoApply") === "true",
      isActive: formData.get("isActive") === "true",
    };

    if (!data.code || isNaN(data.discountValue)) {
      setError("Please specify a coupon code and discount value.");
      setFormLoading(false);
      return;
    }

    let res;
    if (editingId) {
      res = await updateCoupon(editingId, data);
    } else {
      res = await createCoupon(data);
    }

    if (res.success) {
      setIsOpen(false);
      loadCoupons();
    } else {
      setError(res.error || "Failed to save coupon");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const res = await deleteCoupon(id);
    if (res.success) {
      loadCoupons();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Coupons CMS</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Configure client discount codes & thresholds</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying coupons...</p>
          </div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Coupon Code</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Discount</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Usage Limit</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Min Purchase</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Expiry Date</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Status</th>
                  <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-inter">
                {coupons.map((c) => {
                  const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                  return (
                    <tr key={c._id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-brand-gold" />
                          <span className="text-xs font-semibold text-brand-ivory select-all">{c.code}</span>
                          {c.isAutoApply && (
                            <span className="px-1.5 py-0.2 rounded bg-brand-gold/10 text-brand-gold text-[7px] font-poppins uppercase tracking-wider font-semibold border border-brand-gold/20">Auto</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-brand-ivory font-medium">
                        {c.discountType === "Percentage" ? `${c.discountValue}% Off` : `${formatCurrency(c.discountValue)} Off`}
                      </td>
                      <td className="p-4 text-xs text-brand-gray">
                        {c.usageCount} / {c.usageLimit || "∞"}
                      </td>
                      <td className="p-4 text-xs text-brand-gray">{formatCurrency(c.minPurchase)}</td>
                      <td className="p-4 text-xs">
                        {c.expiryDate ? (
                          <span className={isExpired ? "text-red-400 font-medium" : "text-brand-gray"}>
                            {new Date(c.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {isExpired && " (Expired)"}
                          </span>
                        ) : (
                          <span className="text-brand-gray">No Expiry</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleStatusToggle(c)}
                          className="flex items-center text-brand-gray hover:text-brand-ivory transition-colors"
                        >
                          {c.isActive ? (
                            <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                              <ToggleRight className="w-6 h-6 text-green-400" /> Active
                            </span>
                          ) : (
                            <span className="text-xs text-brand-gray flex items-center gap-1.5">
                              <ToggleLeft className="w-6 h-6 text-brand-gray" /> Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openForm(c)}
                            title="Edit"
                            className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-brand-ivory transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            title="Delete"
                            className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest">
            No coupon codes found. Click Add Coupon to begin.
          </div>
        )}
      </div>

      {/* Modal Dialog for Coupon Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          <div className="w-full max-w-lg bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-poppins text-brand-ivory font-semibold uppercase tracking-wider">
                {editingId ? "Edit Coupon Settings" : "Generate Coupon"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-brand-gray hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 mx-6 mt-6 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-inter rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Coupon Code</label>
                  <input
                    type="text"
                    name="code"
                    defaultValue={coupons.find(c => c._id === editingId)?.code || ""}
                    required
                    placeholder="e.g. GRHBRIDE20"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Discount Type</label>
                  <select
                    name="discountType"
                    defaultValue={coupons.find(c => c._id === editingId)?.discountType || "Percentage"}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Cash (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Discount Value</label>
                  <input
                    type="number"
                    name="discountValue"
                    step="0.01"
                    defaultValue={coupons.find(c => c._id === editingId)?.discountValue || ""}
                    required
                    placeholder="e.g. 15"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Min Order (₹)</label>
                  <input
                    type="number"
                    name="minPurchase"
                    step="0.01"
                    defaultValue={coupons.find(c => c._id === editingId)?.minPurchase || 0}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Max Discount (₹)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    defaultValue={coupons.find(c => c._id === editingId)?.maxDiscount || ""}
                    placeholder="e.g. 5000"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={coupons.find(c => c._id === editingId)?.expiryDate ? new Date(coupons.find(c => c._id === editingId).expiryDate).toISOString().substring(0, 10) : ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Usage Limit (Times)</label>
                  <input
                    type="number"
                    name="usageLimit"
                    defaultValue={coupons.find(c => c._id === editingId)?.usageLimit || ""}
                    placeholder="e.g. 100"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                  <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Auto Apply</span>
                  <select
                    name="isAutoApply"
                    defaultValue={coupons.find(c => c._id === editingId)?.isAutoApply ? "true" : "false"}
                    className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                  <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Active Status</span>
                  <select
                    name="isActive"
                    defaultValue={coupons.find(c => c._id === editingId)?.isActive !== false ? "true" : "false"}
                    className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Generating..." : "Save Coupon"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-poppins font-semibold uppercase tracking-wider text-brand-ivory transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
