"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Upload, Calendar, BookOpen, Star, Sparkles, Search } from "lucide-react";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/actions/blog";
import { uploadFileToCloudinary } from "@/actions/upload";

export default function BlogCMSPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [trigger, setTrigger] = useState(0);

  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  // Media upload states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formThumbnail, setFormThumbnail] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchBlogs() {
      const res = await getBlogs({ search, status });
      if (res.success && active) {
        setBlogs(res.blogs);
      }
      if (active) {
        setLoading(false);
      }
    }
    fetchBlogs();
    return () => {
      active = false;
    };
  }, [search, status, trigger]);

  const openForm = (bg = null) => {
    setError("");
    if (bg) {
      setEditingId(bg._id);
      setFormThumbnail(bg.thumbnail || "");
    } else {
      setEditingId(null);
      setFormThumbnail("");
    }
    setIsOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFileToCloudinary(formData);
      if (result && result.url) {
        setFormThumbnail(result.url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      author: formData.get("author"),
      category: formData.get("category"),
      tags: formData.get("tags") ? formData.get("tags").split(",").map(t => t.trim()) : [],
      content: formData.get("content"),
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
      thumbnail: formThumbnail,
    };

    if (!data.title || !data.content) {
      setError("Please specify a post title and write content.");
      setFormLoading(false);
      return;
    }

    let res;
    if (editingId) {
      res = await updateBlog(editingId, data);
    } else {
      res = await createBlog(data);
    }

    if (res.success) {
      setIsOpen(false);
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      setError(res.error || "Failed to save blog post");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const res = await deleteBlog(id);
    if (res.success) {
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Editorial Lookbook CMS</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Publish editorial articles, announcements and atelier stories</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search article titles..."
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
            <option value="">Status: All</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Blog Cards list */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading lookbook articles...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div key={b._id} className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md relative group flex flex-col justify-between">
              <div className="h-48 relative bg-gradient-to-r from-brand-gold/15 to-[#1C1A19]">
                {b.thumbnail ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0E] to-transparent"></div>
                
                {b.isFeatured && (
                  <span className="absolute top-3 right-3 bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/40 text-brand-gold text-[8px] font-poppins px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider font-semibold">
                    <Star className="w-2.5 h-2.5 fill-brand-gold" /> Featured Story
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-poppins text-brand-gold uppercase tracking-wider font-medium">{b.category || "Atelier"}</span>
                    <span className="text-[10px] text-brand-gray">•</span>
                    <span className="text-[9px] font-inter text-brand-gray">{new Date(b.publishDate).toLocaleDateString("en-IN")}</span>
                  </div>
                  <h3 className="text-base font-playfair text-brand-ivory uppercase tracking-wider line-clamp-1">{b.title}</h3>
                  <span className="text-[9px] font-inter text-brand-gray uppercase tracking-wider block mt-0.5">By {b.author}</span>
                  <p className="text-xs font-inter text-brand-gray/80 mt-3 line-clamp-3 leading-relaxed">{b.content.replace(/<[^>]*>/g, "")}</p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-poppins uppercase tracking-wider font-semibold border ${
                    b.isPublished
                      ? "bg-green-950/20 border-green-500/30 text-green-400"
                      : "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                  }`}>
                    {b.isPublished ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openForm(b)}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 text-brand-gray hover:text-brand-ivory transition-colors text-xs font-poppins uppercase tracking-wider flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="p-2 rounded bg-white/5 hover:bg-red-500/10 text-brand-gray hover:text-red-400 transition-colors text-xs font-poppins uppercase tracking-wider flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest bg-[#0F0E0E]/80 border border-white/5 rounded-xl border-dashed">
          No articles written yet. Click Write Article to begin.
        </div>
      )}

      {/* Slide-out Editor Form panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          {/* Panel */}
          <div className="w-full max-w-3xl bg-[#0E0E0E] h-full shadow-2xl relative z-10 border-l border-white/5 overflow-y-auto flex flex-col animate-slideIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-playfair text-brand-ivory uppercase tracking-widest">
                {editingId ? "Edit Story" : "Compose Atelier Story"}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Article Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={blogs.find(b => b._id === editingId)?.title || ""}
                    required
                    placeholder="e.g. The Legacy of Golden Zari"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Slug URL (Optional)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={blogs.find(b => b._id === editingId)?.slug || ""}
                    placeholder="e.g. legacy-golden-zari"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Author Name</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={blogs.find(b => b._id === editingId)?.author || "GRH Atelier"}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Category</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={blogs.find(b => b._id === editingId)?.category || "Runway"}
                    placeholder="Atelier, Bridal, Runway"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Tags (Comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={blogs.find(b => b._id === editingId)?.tags?.join(", ") || ""}
                    placeholder="zari, runway, couture"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Story Cover Image</label>
                <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-5 text-center relative bg-[#161515]/30">
                  {formThumbnail ? (
                    <div className="relative h-32 w-full rounded overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formThumbnail} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormThumbnail("")} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-brand-gray mx-auto mb-2" />
                      <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider block">Upload Cover Asset</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingCover}
                  />
                </div>
                {uploadingCover && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading cover...</span>}
              </div>

              {/* Content Description */}
              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Story Content (Markdown or HTML supported)</label>
                <textarea
                  name="content"
                  rows="8"
                  defaultValue={blogs.find(b => b._id === editingId)?.content || ""}
                  required
                  placeholder="Draft your editorial column here..."
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              {/* Flags */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                  <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Featured Story</span>
                  <select
                    name="isFeatured"
                    defaultValue={blogs.find(b => b._id === editingId)?.isFeatured ? "true" : "false"}
                    className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-[#161515]/50 p-3 rounded-lg border border-white/5">
                  <span className="text-[9px] font-poppins text-brand-gray uppercase tracking-wider">Publish immediately</span>
                  <select
                    name="isPublished"
                    defaultValue={blogs.find(b => b._id === editingId)?.isPublished ? "true" : "false"}
                    className="bg-[#0E0E0E] border border-white/5 rounded text-xs text-brand-ivory py-1 px-2 focus:outline-none"
                  >
                    <option value="false">Draft (Hidden)</option>
                    <option value="true">Published (Live)</option>
                  </select>
                </div>
              </div>

              {/* SEO metadata */}
              <div className="bg-[#161515]/60 border border-white/5 p-4 rounded-lg space-y-4">
                <h4 className="text-[10px] font-poppins text-brand-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> SEO Metadata
                </h4>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    placeholder="Article SEO Title"
                    defaultValue={blogs.find(b => b._id === editingId)?.seoTitle || ""}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Meta Description</label>
                  <textarea
                    name="seoDescription"
                    rows="2"
                    placeholder="Article summary for search listings..."
                    defaultValue={blogs.find(b => b._id === editingId)?.seoDescription || ""}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={formLoading || uploadingCover}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Publishing..." : "Save Article"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-poppins font-semibold uppercase tracking-wider text-brand-ivory transition-colors"
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
