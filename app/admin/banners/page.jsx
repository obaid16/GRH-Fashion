"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Upload, Calendar, ToggleLeft, ToggleRight, ImageIcon } from "lucide-react";
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/actions/banner";
import { uploadFileToCloudinary } from "@/actions/upload";

export default function BannersAdminPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  // Media uploads states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formImage, setFormImage] = useState("");

  const loadBanners = async () => {
    setLoading(true);
    const res = await getBanners();
    if (res.success) {
      setBanners(res.banners);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openForm = (bn = null) => {
    setError("");
    if (bn) {
      setEditingId(bn._id);
      setFormImage(bn.imageUrl || "");
    } else {
      setEditingId(null);
      setFormImage("");
    }
    setIsOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFileToCloudinary(formData);
      if (result && result.url) {
        setFormImage(result.url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStatusToggle = async (bn) => {
    const res = await updateBanner(bn._id, { isEnabled: !bn.isEnabled });
    if (res.success) {
      loadBanners();
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
      title: formData.get("title"),
      type: formData.get("type"),
      link: formData.get("link"),
      startDate: formData.get("startDate") ? new Date(formData.get("startDate")) : undefined,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate")) : undefined,
      isEnabled: formData.get("isEnabled") === "true",
      imageUrl: formImage,
    };

    if (!data.title || !data.imageUrl) {
      setError("Please specify a banner title and upload an image.");
      setFormLoading(false);
      return;
    }

    let res;
    if (editingId) {
      res = await updateBanner(editingId, data);
    } else {
      res = await createBanner(data);
    }

    if (res.success) {
      setIsOpen(false);
      loadBanners();
    } else {
      setError(res.error || "Failed to save banner");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const res = await deleteBanner(id);
    if (res.success) {
      loadBanners();
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Promotional Banners</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Configure layout banners, mobile sliders and alerts</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Grid of Banners */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading banners...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((bn) => {
            const hasDates = bn.startDate || bn.endDate;
            const isFuture = bn.startDate && new Date(bn.startDate) > new Date();
            const isExpired = bn.endDate && new Date(bn.endDate) < new Date();
            
            return (
              <div key={bn._id} className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md relative group flex flex-col justify-between">
                <div className="h-44 relative bg-[#161515] border-b border-white/5">
                  <img src={bn.imageUrl} alt={bn.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0E] to-transparent"></div>
                  
                  {/* Type Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/30 text-brand-gold text-[8px] font-poppins font-semibold uppercase tracking-wider">
                    {bn.type}
                  </span>

                  {/* Scheduled state */}
                  {hasDates && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-poppins font-semibold border backdrop-blur-sm ${
                      isExpired
                        ? "bg-red-950/20 border-red-500/30 text-red-400"
                        : isFuture
                        ? "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                        : "bg-green-950/20 border-green-500/30 text-green-400"
                    }`}>
                      {isExpired ? "Expired" : isFuture ? "Scheduled" : "Live"}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-poppins font-semibold text-brand-ivory">{bn.title}</h3>
                    {bn.link && <p className="text-[10px] font-inter text-brand-gold truncate mt-1">Link: {bn.link}</p>}
                    
                    {hasDates && (
                      <div className="flex items-center gap-1.5 text-[9px] font-inter text-brand-gray mt-2 bg-white/2 p-2 rounded border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                        <span>
                          {bn.startDate ? new Date(bn.startDate).toLocaleDateString("en-IN") : "Now"} - {bn.endDate ? new Date(bn.endDate).toLocaleDateString("en-IN") : "∞"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/5">
                    {/* Status Toggler */}
                    <button
                      onClick={() => handleStatusToggle(bn)}
                      className="flex items-center text-brand-gray hover:text-brand-ivory transition-colors text-xs font-poppins"
                    >
                      {bn.isEnabled ? (
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          <ToggleRight className="w-5 h-5" /> Enabled
                        </span>
                      ) : (
                        <span className="text-brand-gray flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5" /> Disabled
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openForm(bn)}
                        className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-brand-ivory transition-colors"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bn._id)}
                        className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          No banners configured. Click Add Banner to begin.
        </div>
      )}

      {/* Modal Dialog for Banner Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          <div className="w-full max-w-lg bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-poppins text-brand-ivory font-semibold uppercase tracking-wider">
                {editingId ? "Edit Banner settings" : "Create New Banner"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Banner Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={banners.find(b => b._id === editingId)?.title || ""}
                    required
                    placeholder="e.g. Festival Season Sale"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Banner Placement Type</label>
                  <select
                    name="type"
                    defaultValue={banners.find(b => b._id === editingId)?.type || "Desktop"}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Desktop">Desktop Hero Banner</option>
                    <option value="Mobile">Mobile Slider Banner</option>
                    <option value="Popup">Popup Modal Advert</option>
                    <option value="Offer">Top Ribbon Offer</option>
                    <option value="Collection">Collection Cover Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Target Redirection URL</label>
                <input
                  type="text"
                  name="link"
                  defaultValue={banners.find(b => b._id === editingId)?.link || ""}
                  placeholder="e.g. /collection/bridal-couture"
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Schedule Start Date (Optional)</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={banners.find(b => b._id === editingId)?.startDate ? new Date(banners.find(b => b._id === editingId).startDate).toISOString().substring(0, 10) : ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Schedule End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={banners.find(b => b._id === editingId)?.endDate ? new Date(banners.find(b => b._id === editingId).endDate).toISOString().substring(0, 10) : ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              {/* Uploads */}
              <div className="space-y-2">
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Banner Media Asset</label>
                <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-6 text-center relative bg-[#161515]/30">
                  {formImage ? (
                    <div className="relative h-28 w-full rounded overflow-hidden border border-white/10">
                      <img src={formImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormImage("")} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-brand-gray mx-auto mb-2" />
                      <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider block">Upload Banner Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                  />
                </div>
                {uploadingImage && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading to Cloudinary...</span>}
              </div>

              <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Publish immediately</span>
                <select
                  name="isEnabled"
                  defaultValue={banners.find(b => b._id === editingId)?.isEnabled !== false ? "true" : "false"}
                  className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                >
                  <option value="true">Yes (Enabled)</option>
                  <option value="false">No (Disabled)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={formLoading || uploadingImage}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Saving Details..." : "Save Banner"}
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
