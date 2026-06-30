"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, Trash2, MessageSquare, Star, Sparkles, Heart } from "lucide-react";
import { getReviews, updateReviewStatus, toggleFeaturedReview, deleteReview } from "@/actions/review";

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const loadReviews = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    const res = await getReviews(filterStatus);
    if (res.success) {
      setReviews(res.reviews);
    }
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleStatusUpdate = async (id, status) => {
    const res = await updateReviewStatus(id, status);
    if (res.success) {
      loadReviews(true);
    } else {
      alert(res.error || "Action failed");
    }
  };

  const handleFeaturedToggle = async (id) => {
    const res = await toggleFeaturedReview(id);
    if (res.success) {
      loadReviews(true);
    } else {
      alert(res.error || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    const res = await deleteReview(id);
    if (res.success) {
      loadReviews(true);
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  // Calculate analytics
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Reviews Moderation</h1>
        <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Approve, filter and feature customer apparel ratings</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl backdrop-blur-md">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Average Score</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-playfair text-brand-ivory font-bold">{averageRating}</span>
            <div className="flex text-brand-gold">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(parseFloat(averageRating) || 0) ? "fill-brand-gold" : "text-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl backdrop-blur-md">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Pending Moderation</span>
          <span className="block text-2xl font-playfair text-yellow-400 font-bold mt-2">{pendingCount}</span>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl backdrop-blur-md">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Approved Reviews</span>
          <span className="block text-2xl font-playfair text-green-400 font-bold mt-2">{approvedCount}</span>
        </div>

        <div className="bg-[#0F0E0E]/80 border border-white/5 p-5 rounded-xl backdrop-blur-md">
          <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Total Feedback</span>
          <span className="block text-2xl font-playfair text-brand-gold font-bold mt-2">{totalReviews}</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-poppins text-brand-ivory font-medium uppercase tracking-wider">Client Testimonials</span>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
        >
          <option value="">Status: All</option>
          <option value="Pending">Pending Approval</option>
          <option value="Approved">Approved Only</option>
          <option value="Rejected">Rejected Only</option>
        </select>
      </div>

      {/* List of reviews */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Syncing comments database...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className={`bg-[#0F0E0E]/80 border rounded-xl p-6 backdrop-blur-md transition-all flex flex-col sm:flex-row justify-between gap-4 items-start ${
                r.status === "Pending" ? "border-yellow-500/20 bg-yellow-950/2" : "border-white/5"
              }`}
            >
              <div className="space-y-3 flex-1 min-w-0">
                {/* Author rating meta */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center border border-brand-gold/20 text-brand-gold font-poppins text-xs font-semibold">
                    {r.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-ivory flex items-center gap-2">
                      {r.customerName}
                      {r.isFeatured && (
                        <span className="px-1.5 py-0.2 rounded bg-brand-gold/15 text-brand-gold text-[7px] font-poppins uppercase tracking-wider font-semibold border border-brand-gold/20 flex items-center gap-0.5">
                          <Heart className="w-2 h-2 fill-brand-gold" /> Featured
                        </span>
                      )}
                    </h4>
                    <span className="text-[9px] text-brand-gray block mt-0.5">{r.customerEmail || "No Email Provided"}</span>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center gap-2">
                  <div className="flex text-brand-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-brand-gold" : "text-white/10"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-gray">•</span>
                  <span className="text-[9px] font-inter text-brand-gray">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs font-inter text-brand-gray leading-relaxed pr-6">{r.comment || "No written review comments."}</p>
                
                {r.productName && (
                  <span className="inline-block text-[9px] font-poppins text-brand-gold bg-brand-gold/5 px-2 py-0.5 border border-brand-gold/10 rounded uppercase tracking-wider">
                    Product Context: {r.productName}
                  </span>
                )}
              </div>

              {/* Operations buttons */}
              <div className="flex sm:flex-col items-end gap-2.5 flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5 justify-between sm:justify-start">
                <span className={`px-2 py-0.5 rounded text-[8px] font-poppins uppercase tracking-wider font-semibold border ${
                  r.status === "Approved"
                    ? "bg-green-950/20 border-green-500/30 text-green-400"
                    : r.status === "Pending"
                    ? "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                    : "bg-red-950/20 border-red-500/30 text-red-400"
                }`}>
                  {r.status}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  {r.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(r._id, "Approved")}
                        title="Approve"
                        className="p-1.5 rounded bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(r._id, "Rejected")}
                        title="Reject"
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  
                  {r.status === "Approved" && (
                    <button
                      onClick={() => handleFeaturedToggle(r._id)}
                      title={r.isFeatured ? "Remove from Featured" : "Pin to Featured Homepage"}
                      className={`p-1.5 rounded border transition-colors ${
                        r.isFeatured
                          ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                          : "bg-white/5 border-white/5 hover:bg-white/10 text-brand-gray hover:text-brand-ivory"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r._id)}
                    title="Delete Permanently"
                    className="p-1.5 rounded bg-white/5 border border-white/5 hover:bg-red-500/15 text-brand-gray hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          No feedback entries found.
        </div>
      )}
    </div>
  );
}
