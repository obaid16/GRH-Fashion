"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Upload, Check, Star } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/category";
import { uploadFileToCloudinary } from "@/actions/upload";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  // File upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [formImage, setFormImage] = useState("");
  const [formBanner, setFormBanner] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openForm = (cat = null) => {
    setError("");
    if (cat) {
      setEditingId(cat._id);
      setFormImage(cat.image || "");
      setFormBanner(cat.banner || "");
    } else {
      setEditingId(null);
      setFormImage("");
      setFormBanner("");
    }
    setIsOpen(true);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === "image") setUploadingImage(true);
    if (field === "banner") setUploadingBanner(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFileToCloudinary(formData);
      if (result && result.url) {
        if (field === "image") setFormImage(result.url);
        if (field === "banner") setFormBanner(result.url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      if (field === "image") setUploadingImage(false);
      if (field === "banner") setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      isFeatured: formData.get("isFeatured") === "true",
      image: formImage,
      banner: formBanner,
    };

    if (!data.name) {
      setError("Name is required");
      setFormLoading(false);
      return;
    }

    let res;
    if (editingId) {
      res = await updateCategory(editingId, data);
    } else {
      res = await createCategory(data);
    }

    if (res.success) {
      setIsOpen(false);
      loadCategories();
    } else {
      setError(res.error || "Failed to save category");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will not be deleted but they will lose their category label.")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      loadCategories();
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Categories CMS</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Structure your apparel showcase sections</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading categories...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c._id} className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md relative group flex flex-col justify-between">
              {/* Category Banner if exists, otherwise solid gold/charcoal gradient */}
              <div className="h-32 relative bg-gradient-to-r from-brand-gold/25 to-[#1C1A19]">
                {c.banner ? (
                  <img src={c.banner} alt={`${c.name} banner`} className="w-full h-full object-cover opacity-60" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0E] to-transparent"></div>
                
                {/* Featured Badge */}
                {c.isFeatured && (
                  <div className="absolute top-3 right-3 bg-brand-gold/20 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-[8px] font-poppins px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <Star className="w-2.5 h-2.5 fill-brand-gold" /> Featured
                  </div>
                )}

                {/* Profile Circle Icon */}
                <div className="absolute -bottom-6 left-6 w-14 h-14 bg-[#161515] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                  <img src={c.image || "/images/logo-new.png"} alt={c.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Body */}
              <div className="p-6 pt-10 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-playfair text-brand-ivory uppercase tracking-wider">{c.name}</h3>
                  <span className="text-[9px] font-inter text-brand-gold font-medium uppercase tracking-wider">{c.slug}</span>
                  <p className="text-xs font-inter text-brand-gray/80 mt-2 line-clamp-2 leading-relaxed">{c.description || "No description provided."}</p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => openForm(c)}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-brand-gray hover:text-brand-ivory transition-colors text-xs font-poppins uppercase tracking-wider flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2 rounded bg-white/5 hover:bg-red-500/10 text-brand-gray hover:text-red-400 transition-colors text-xs font-poppins uppercase tracking-wider flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          No categories found. Click Add Category to begin.
        </div>
      )}

      {/* Modal Dialog for Category Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="w-full max-w-lg bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-poppins text-brand-ivory font-semibold uppercase tracking-wider">
                {editingId ? "Edit Category Details" : "Create New Category"}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={categories.find(c => c._id === editingId)?.name || ""}
                    required
                    placeholder="e.g. Couture Gowns"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Slug (Optional)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={categories.find(c => c._id === editingId)?.slug || ""}
                    placeholder="e.g. couture-gowns"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={categories.find(c => c._id === editingId)?.description || ""}
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              {/* Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Thumbnail Image */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Icon Image (Square)</label>
                  <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-4 text-center relative bg-[#161515]/30">
                    {formImage ? (
                      <div className="relative w-12 h-12 mx-auto rounded overflow-hidden border border-white/10">
                        <img src={formImage} alt="Icon" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormImage("")} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-brand-gray mx-auto mb-1" />
                        <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Upload Icon</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                  </div>
                  {uploadingImage && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center">Uploading icon...</span>}
                </div>

                {/* Banner Image */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Banner Image (Wide)</label>
                  <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-4 text-center relative bg-[#161515]/30">
                    {formBanner ? (
                      <div className="relative h-12 w-full rounded overflow-hidden border border-white/10">
                        <img src={formBanner} alt="Banner" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormBanner("")} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-brand-gray mx-auto mb-1" />
                        <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Upload Banner</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "banner")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingBanner}
                    />
                  </div>
                  {uploadingBanner && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center">Uploading banner...</span>}
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Featured on Homepage</span>
                <select
                  name="isFeatured"
                  defaultValue={categories.find(c => c._id === editingId)?.isFeatured ? "true" : "false"}
                  className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                >
                  <option value="false">No</option>
                  <option value="true">Yes (Show)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={formLoading || uploadingImage || uploadingBanner}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Saving Details..." : "Save Category"}
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
