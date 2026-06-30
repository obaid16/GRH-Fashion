"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Sparkles,
  Eye,
  Archive,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  bulkDeleteProducts,
} from "@/actions/product";
import { uploadFileToCloudinary } from "@/actions/upload";

export default function ProductsClient({ categories, collections }) {
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Data States
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Selection & UI States
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Image Uploading States
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formImages, setFormImages] = useState([]);
  const [formThumbnail, setFormThumbnail] = useState("");

  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadData() {
      const res = await getProducts({
        search,
        category,
        collectionName,
        status,
        sort,
        page,
        limit: 8,
      });
      if (res.success && active) {
        setProducts(res.products);
        setTotalPages(res.pages);
        setTotalProducts(res.total);
      }
      if (active) {
        setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [search, category, collectionName, status, sort, page, trigger]);

  // Modal scroll lock and keyboard navigation helpers
  useEffect(() => {
    if (!formOpen) return;

    // 1. Lock html, body and main background scrolling
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const mainEl = document.querySelector("main");
    const originalMainOverflow = mainEl ? mainEl.style.overflow : "";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (mainEl) {
      mainEl.style.overflow = "hidden";
    }

    // 2. Keyboard listeners: ESC to close, Arrow/Space background scroll prevention
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFormOpen(false);
      }
      
      // Prevent background scrolling via Spacebar or Arrow keys
      if (["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(e.code)) {
        const active = document.activeElement;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
        if (!isInput && !e.target.closest(".scrollable-form-body")) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow;
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formOpen]);

  // Handle Search Change with Debounce or inline
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e, isThumbnail = false) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadFileToCloudinary(formData);
        if (result && result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (isThumbnail) {
        setFormThumbnail(uploadedUrls[0]);
      } else {
        setFormImages([...formImages, ...uploadedUrls]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove uploaded image
  const removeImage = (url, isThumbnail = false) => {
    if (isThumbnail) {
      setFormThumbnail("");
    } else {
      setFormImages(formImages.filter((img) => img !== url));
    }
  };

  // Duplicate Product Action
  const handleDuplicate = async (id) => {
    if (!confirm("Are you sure you want to duplicate this product?")) return;
    const res = await duplicateProduct(id);
    if (res.success) {
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      alert(res.error || "Duplication failed");
    }
  };

  // Delete Product Action
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      alert(res.error || "Delete failed");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    const res = await bulkDeleteProducts(selectedIds);
    if (res.success) {
      setSelectedIds([]);
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      alert(res.error || "Bulk deletion failed");
    }
  };

  // Open Form for Create / Edit
  const openForm = (product = null) => {
    setErrorMsg("");
    if (product) {
      setEditingProduct(product);
      setFormImages(product.images || []);
      setFormThumbnail(product.thumbnail || "");
    } else {
      setEditingProduct(null);
      setFormImages([]);
      setFormThumbnail("");
    }
    setFormOpen(true);
  };

  // Submit Form Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFormLoading(true);

    const formDataObj = new FormData(e.target);
    const data = {
      name: formDataObj.get("name"),
      slug: formDataObj.get("slug"),
      sku: formDataObj.get("sku"),
      category: formDataObj.get("category"),
      subCategory: formDataObj.get("subCategory"),
      collectionName: formDataObj.get("collectionName"),
      price: parseFloat(formDataObj.get("price")),
      discount: parseFloat(formDataObj.get("discount") || 0),
      stock: parseInt(formDataObj.get("stock") || 0),
      gender: formDataObj.get("gender"),
      fabric: formDataObj.get("fabric"),
      description: formDataObj.get("description"),
      shortDescription: formDataObj.get("shortDescription"),
      seoTitle: formDataObj.get("seoTitle"),
      seoDescription: formDataObj.get("seoDescription"),
      status: formDataObj.get("status"),
      isFeatured: formDataObj.get("isFeatured") === "true",
      isTrending: formDataObj.get("isTrending") === "true",
      isNewArrival: formDataObj.get("isNewArrival") === "true",
      isBestseller: formDataObj.get("isBestseller") === "true",
      sizes: formDataObj.get("sizes") ? formDataObj.get("sizes").split(",").map(s => s.trim()) : [],
      colors: formDataObj.get("colors") ? formDataObj.get("colors").split(",").map(c => c.trim()) : [],
      tags: formDataObj.get("tags") ? formDataObj.get("tags").split(",").map(t => t.trim()) : [],
      images: formImages,
      thumbnail: formThumbnail || formImages[0] || "",
    };

    if (!data.name || !data.category || isNaN(data.price) || !data.description) {
      setErrorMsg("Please fill out Name, Category, Price, and Description.");
      setFormLoading(false);
      return;
    }

    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct._id, data);
    } else {
      res = await createProduct(data);
    }

    if (res.success) {
      setFormOpen(false);
      setLoading(true);
      setTrigger(prev => prev + 1);
    } else {
      setErrorMsg(res.error || "Failed to save product.");
    }
    setFormLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Products Portfolio</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Manage designs, pricing and assets</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search products, SKU..."
            value={search}
            onChange={handleSearch}
            className="bg-transparent border-none text-xs text-brand-ivory focus:outline-none w-full font-inter"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Collection Filter */}
          <select
            value={collectionName}
            onChange={(e) => { setCollectionName(e.target.value); setPage(1); }}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="">All Collections</option>
            {collections.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="">Status: All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#161515] border border-white/5 rounded-lg px-3 py-2 text-xs text-brand-ivory focus:outline-none font-poppins"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="stock-low">Stock: Low</option>
          </select>
        </div>
      </div>

      {/* Bulk actions banner */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-gold/10 border border-brand-gold/20 px-4 py-3 rounded-lg flex items-center justify-between animate-slideUp">
          <span className="text-xs font-poppins text-brand-gold font-medium">
            {selectedIds.length} products selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-xs font-poppins font-semibold uppercase tracking-wider bg-red-950/40 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying Atelier Portfolio...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={products.length > 0 && selectedIds.length === products.length}
                      className="rounded border-white/10 bg-transparent text-brand-gold focus:ring-brand-gold"
                    />
                  </th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Creations</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">SKU</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Details</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Stock & Status</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Price</th>
                  <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p._id)}
                        onChange={() => handleSelectOne(p._id)}
                        className="rounded border-white/10 bg-transparent text-brand-gold focus:ring-brand-gold"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-[#161515] border border-white/5 rounded overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.thumbnail || p.images[0] || "/images/logo-new.png"} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-playfair text-sm text-brand-ivory truncate max-w-[200px]">{p.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.isFeatured && <span className="px-1.5 py-0.5 rounded-sm bg-brand-gold/10 text-brand-gold text-[8px] font-poppins font-medium uppercase border border-brand-gold/20">Featured</span>}
                            {p.isTrending && <span className="px-1.5 py-0.5 rounded-sm bg-blue-950/20 text-blue-400 text-[8px] font-poppins font-medium uppercase border border-blue-500/20">Trending</span>}
                            {p.isNewArrival && <span className="px-1.5 py-0.5 rounded-sm bg-green-950/20 text-green-400 text-[8px] font-poppins font-medium uppercase border border-green-500/20">New</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-inter text-xs text-brand-gray font-medium">{p.sku || "N/A"}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-poppins text-brand-gold uppercase tracking-wider">{p.category}</span>
                        <span className="text-[9px] font-inter text-brand-gray">{p.collectionName || "General"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-inter ${p.stock > 0 ? "text-brand-ivory" : "text-red-400 font-semibold"}`}>
                          {p.stock > 0 ? `${p.stock} available` : "Out of Stock"}
                        </span>
                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-poppins uppercase tracking-wider font-semibold border ${
                            p.status === "Published"
                              ? "bg-green-950/20 border-green-500/30 text-green-400"
                              : p.status === "Draft"
                              ? "bg-yellow-950/20 border-yellow-500/30 text-yellow-400"
                              : "bg-brand-black border-white/10 text-brand-gray"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col font-inter">
                        <span className="text-xs text-brand-ivory font-semibold">{formatCurrency(p.finalPrice)}</span>
                        {p.discount > 0 && (
                          <span className="text-[9px] text-brand-gray line-through">{formatCurrency(p.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm(p)}
                          title="Edit"
                          className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-brand-ivory transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p._id)}
                          title="Duplicate"
                          className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-brand-gold transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          title="Delete"
                          className="p-1.5 rounded hover:bg-white/5 text-brand-gray hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
            No creations matching criteria found.
          </div>
        )}

        {/* Pagination Toolbar */}
        {products.length > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-gray font-poppins">
            <span>Showing {products.length} of {totalProducts} items</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded bg-white/5 text-brand-ivory hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded bg-white/5 text-brand-ivory hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Centered Product Editor Dialog Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFormOpen(false)}></div>
          
          {/* Dialog Container Form */}
          <form onSubmit={handleFormSubmit} className="w-full max-w-5xl bg-[#0E0E0E] max-h-[90vh] shadow-2xl relative z-10 border border-white/5 rounded-2xl flex flex-col animate-slide-up overflow-hidden">
            {/* Sticky Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0F0E0E]/80 backdrop-blur-md shrink-0">
              <h3 className="text-base font-playfair text-brand-ivory uppercase tracking-widest font-semibold">
                {editingProduct ? `Edit "${editingProduct.name}"` : "New Atelier Creation"}
              </h3>
              <button type="button" onClick={() => setFormOpen(false)} className="text-brand-gray hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-4 mx-6 mt-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-inter rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Scrollable Form Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollable-form-body max-h-[calc(90vh-140px)]">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name || ""}
                    required
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingProduct?.slug || ""}
                    placeholder="e.g. crimson-cascade-gown"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* SKU & Category & Collection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SKU Code</label>
                  <input
                    type="text"
                    name="sku"
                    defaultValue={editingProduct?.sku || ""}
                    placeholder="GRH-C-101"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || ""}
                    required
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none focus:border-brand-gold"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Collection</label>
                  <select
                    name="collectionName"
                    defaultValue={editingProduct?.collectionName || ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none focus:border-brand-gold"
                  >
                    <option value="">General (None)</option>
                    {collections.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Discount & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Base Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={editingProduct?.price || ""}
                    required
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Discount Amount (₹)</label>
                  <input
                    type="number"
                    name="discount"
                    step="0.01"
                    defaultValue={editingProduct?.discount || 0}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Inventory Stock</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock || 5}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Attributes: Sizes, Colors, Fabric, Gender, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    placeholder="XS, S, M, L, XL, Custom"
                    defaultValue={editingProduct?.sizes?.join(", ") || "XS, S, M, L, XL, Custom"}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Colors (Comma separated)</label>
                  <input
                    type="text"
                    name="colors"
                    placeholder="Ivory, Ruby Red, Forest Green"
                    defaultValue={editingProduct?.colors?.join(", ") || ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Fabric</label>
                  <input
                    type="text"
                    name="fabric"
                    placeholder="Net, Pure Silk, Velvet"
                    defaultValue={editingProduct?.fabric || ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Sub-category</label>
                  <input
                    type="text"
                    name="subCategory"
                    placeholder="e.g. Beadwork, Heavy Embroidery"
                    defaultValue={editingProduct?.subCategory || ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Target Gender</label>
                  <select
                    name="gender"
                    defaultValue={editingProduct?.gender || "Unisex"}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Search Tags (Comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="crystals, zari, floral, bridal"
                    defaultValue={editingProduct?.tags?.join(", ") || ""}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Status & Promotional Flags */}
              <div className="bg-[#161515]/60 border border-white/5 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Product Status</label>
                  <select
                    name="status"
                    defaultValue={editingProduct?.status || "Draft"}
                    className="bg-[#161515] border border-white/5 rounded px-3 py-1.5 text-xs text-brand-ivory font-poppins focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="hidden" name="isFeatured" value="false" />
                    <input
                      type="checkbox"
                      name="isFeatured"
                      value="true"
                      defaultChecked={editingProduct?.isFeatured || false}
                      className="rounded border-white/10 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="hidden" name="isTrending" value="false" />
                    <input
                      type="checkbox"
                      name="isTrending"
                      value="true"
                      defaultChecked={editingProduct?.isTrending || false}
                      className="rounded border-white/10 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider">Trending</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="hidden" name="isNewArrival" value="false" />
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      value="true"
                      defaultChecked={editingProduct?.isNewArrival || false}
                      className="rounded border-white/10 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="hidden" name="isBestseller" value="false" />
                    <input
                      type="checkbox"
                      name="isBestseller"
                      value="true"
                      defaultChecked={editingProduct?.isBestseller || false}
                      className="rounded border-white/10 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-wider">Bestseller</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Editorial Description</label>
                <textarea
                  name="description"
                  rows="4"
                  defaultValue={editingProduct?.description || ""}
                  required
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Short Summary (Hover details)</label>
                <input
                  type="text"
                  name="shortDescription"
                  defaultValue={editingProduct?.shortDescription || ""}
                  placeholder="e.g. Striking crimson red gown featuring heavily hand-embroidered tulle."
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Cloudinary Image uploading */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Media Gallery</h4>

                {/* Upload Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thumbnail File upload */}
                  <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-4 transition-colors flex flex-col items-center justify-center text-center relative bg-[#161515]/30">
                    <Upload className="w-6 h-6 text-brand-gray mb-2" />
                    <span className="text-[10px] font-poppins text-brand-ivory font-semibold uppercase tracking-wider mb-1">Upload Thumbnail</span>
                    <span className="text-[9px] font-inter text-brand-gray">Recommended ratio: 3:4 portrait</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Multiple Gallery Files upload */}
                  <div className="border border-dashed border-white/10 hover:border-brand-gold/30 rounded-lg p-4 transition-colors flex flex-col items-center justify-center text-center relative bg-[#161515]/30">
                    <Upload className="w-6 h-6 text-brand-gray mb-2" />
                    <span className="text-[10px] font-poppins text-brand-ivory font-semibold uppercase tracking-wider mb-1">Upload Additional Images</span>
                    <span className="text-[9px] font-inter text-brand-gray">Hold Ctrl/Shift to choose multiple</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {uploadingImages && (
                  <div className="text-center py-2 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-poppins text-brand-gold uppercase tracking-wider">Uploading asset to Cloudinary...</span>
                  </div>
                )}

                {/* Thumbnail Preview */}
                {formThumbnail && (
                  <div className="border border-white/5 p-4 rounded-lg">
                    <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-widest mb-2">Thumbnail (Main Image)</span>
                    <div className="relative w-20 h-24 rounded border border-brand-gold/30 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(formThumbnail, true)}
                        className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-brand-gray hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Gallery Previews */}
                {formImages.length > 0 && (
                  <div className="border border-white/5 p-4 rounded-lg">
                    <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-widest mb-2">Gallery Images ({formImages.length})</span>
                    <div className="flex flex-wrap gap-3">
                      {formImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-16 h-20 rounded border border-white/5 overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(imgUrl, false)}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-brand-gray hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Tags */}
              <div className="bg-[#161515]/60 border border-white/5 p-4 rounded-lg space-y-4">
                <h4 className="text-[10px] font-poppins text-brand-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> SEO Metadata Defaults
                </h4>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SEO Meta Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    placeholder="Exquisite Gown - GRH Couture"
                    defaultValue={editingProduct?.seoTitle || ""}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SEO Meta Description</label>
                  <textarea
                    name="seoDescription"
                    rows="2"
                    placeholder="Short description for search engine results..."
                    defaultValue={editingProduct?.seoDescription || ""}
                    className="w-full bg-[#0E0E0E] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  ></textarea>
                </div>
              </div>

            </div>

            {/* Sticky Footer */}
            <div className="p-6 border-t border-white/5 flex gap-4 bg-[#0F0E0E]/80 backdrop-blur-md shrink-0">
              <button
                type="submit"
                disabled={formLoading || uploadingImages}
                className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-colors disabled:opacity-50"
              >
                {formLoading ? "Saving Creation..." : "Save Product"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-poppins font-semibold uppercase tracking-wider text-brand-ivory transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
