"use client";

import { useState, useEffect } from "react";
import { getHomepageData, updateHomepageSection, updateHomepageTestimonials } from "@/actions/homepage";
import { uploadFileToCloudinary } from "@/actions/upload";
import { Upload, Check, Trash2, Plus, Star, X, Layout, Sparkles } from "lucide-react";

export default function HomepageCMSPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Media upload states
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingArtImage, setUploadingArtImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const homepageData = await getHomepageData();
    setData(homepageData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === "backgroundImage") setUploadingHero(true);
    if (field === "artImage") setUploadingArtImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFileToCloudinary(formData);
      if (result && result.url) {
        if (section === "hero") {
          setData({
            ...data,
            hero: { ...data.hero, backgroundImage: result.url }
          });
        } else if (section === "artOfEmbroidery") {
          setData({
            ...data,
            artOfEmbroidery: { ...data.artOfEmbroidery, image: result.url }
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      if (field === "backgroundImage") setUploadingHero(false);
      if (field === "artImage") setUploadingArtImage(false);
    }
  };

  const handleSaveSection = async (sectionName, sectionData) => {
    setSaveLoading(true);
    setSuccessMsg("");
    const res = await updateHomepageSection(sectionName, sectionData);
    if (res.success) {
      setData(res.homepage);
      setSuccessMsg(`${sectionName.toUpperCase()} section updated successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(res.error || "Failed to update section");
    }
    setSaveLoading(false);
  };

  // Testimonials Operations
  const handleAddTestimonial = () => {
    const newTestimonial = {
      name: "Client Name",
      role: "Client Title",
      content: "Describe their bespoke couture experience here...",
      rating: 5,
      avatar: "",
    };
    const updatedTestimonials = [...(data.testimonials || []), newTestimonial];
    setData({ ...data, testimonials: updatedTestimonials });
  };

  const handleRemoveTestimonial = (idx) => {
    const updated = data.testimonials.filter((_, i) => i !== idx);
    setData({ ...data, testimonials: updated });
  };

  const handleTestimonialChange = (idx, field, value) => {
    const updated = [...data.testimonials];
    updated[idx][field] = value;
    setData({ ...data, testimonials: updated });
  };

  const handleSaveTestimonials = async () => {
    setSaveLoading(true);
    setSuccessMsg("");
    const res = await updateHomepageTestimonials(data.testimonials);
    if (res.success) {
      setData(res.homepage);
      setSuccessMsg("Testimonials updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(res.error || "Failed to save testimonials");
    }
    setSaveLoading(false);
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading Homepage CMS Config...</p>
      </div>
    );
  }

  const tabs = [
    { id: "hero", name: "Cinematic Hero" },
    { id: "latestCollection", name: "Collections Ribbon" },
    { id: "artOfEmbroidery", name: "Art of Embroidery" },
    { id: "testimonials", name: "Testimonials" },
    { id: "instagram", name: "Instagram Lookbook" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Homepage Editor</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Customize copy, backgrounds, and brand statements</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/20 border border-green-500/30 text-green-400 text-xs font-poppins font-medium uppercase tracking-wider rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="bg-[#0F0E0E]/80 border border-white/5 p-3 rounded-xl backdrop-blur-md flex flex-col gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSuccessMsg(""); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-poppins transition-colors ${
                activeTab === t.id
                  ? "bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold font-medium"
                  : "text-brand-gray hover:text-brand-ivory hover:bg-white/5"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl backdrop-blur-md">
          {/* 1. Cinematic Hero Section */}
          {activeTab === "hero" && data.hero && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("hero", {
                  heading: e.target.heading.value,
                  subheading: e.target.subheading.value,
                  description: e.target.description.value,
                  ctaText: e.target.ctaText.value,
                  ctaLink: e.target.ctaLink.value,
                  quote: e.target.quote.value,
                  author: e.target.author.value,
                  backgroundImage: data.hero.backgroundImage,
                });
              }}
              className="space-y-6"
            >
              <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Atelier Intro Hero Layout</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Hero Heading</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={data.hero.heading}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Hero Subheading</label>
                  <input
                    type="text"
                    name="subheading"
                    defaultValue={data.hero.subheading}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Hero Description Copy</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={data.hero.description}
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">CTA Button Label</label>
                  <input
                    type="text"
                    name="ctaText"
                    defaultValue={data.hero.ctaText}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">CTA Button Redirection Link</label>
                  <input
                    type="text"
                    name="ctaLink"
                    defaultValue={data.hero.ctaLink}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Editorial Quote (Right side)</label>
                  <input
                    type="text"
                    name="quote"
                    defaultValue={data.hero.quote}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Quote Author</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={data.hero.author}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Background upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Parallax Background Asset</label>
                <div className="border border-dashed border-white/10 p-6 rounded-lg text-center relative bg-[#161515]/30">
                  {data.hero.backgroundImage ? (
                    <div className="relative h-40 w-full rounded overflow-hidden border border-white/10">
                      <img src={data.hero.backgroundImage} alt="Hero Background" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-poppins uppercase tracking-wider">Drag & drop new file to replace</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-brand-gray mx-auto mb-2" />
                      <span className="text-[10px] text-brand-gray uppercase font-poppins">Click to choose image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "hero", "backgroundImage")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {uploadingHero && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading background to Cloudinary...</span>}
              </div>

              <button
                type="submit"
                disabled={saveLoading || uploadingHero}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all"
              >
                {saveLoading ? "Saving Changes..." : "Save Hero Layout"}
              </button>
            </form>
          )}

          {/* 2. Latest Collection Ribbon */}
          {activeTab === "latestCollection" && data.latestCollection && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("latestCollection", {
                  heading: e.target.heading.value,
                  subheading: e.target.subheading.value,
                  linkText: e.target.linkText.value,
                  linkUrl: e.target.linkUrl.value,
                });
              }}
              className="space-y-6"
            >
              <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Featured Collection Header Ribbon</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Collection Grid Title</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={data.latestCollection.heading}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Grid Subheading / Label</label>
                  <input
                    type="text"
                    name="subheading"
                    defaultValue={data.latestCollection.subheading}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Action link Label</label>
                  <input
                    type="text"
                    name="linkText"
                    defaultValue={data.latestCollection.linkText}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Action link Redirection Link</label>
                  <input
                    type="text"
                    name="linkUrl"
                    defaultValue={data.latestCollection.linkUrl}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all"
              >
                {saveLoading ? "Saving Changes..." : "Save Ribbon Details"}
              </button>
            </form>
          )}

          {/* 3. Art Of Embroidery Section */}
          {activeTab === "artOfEmbroidery" && data.artOfEmbroidery && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("artOfEmbroidery", {
                  heading: e.target.heading.value,
                  description: e.target.description.value,
                  ctaText: e.target.ctaText.value,
                  ctaLink: e.target.ctaLink.value,
                  image: data.artOfEmbroidery.image,
                });
              }}
              className="space-y-6"
            >
              <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Art Of Embroidery Cinematic Segment</h3>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="heading"
                  defaultValue={data.artOfEmbroidery.heading}
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Section Paragraph Description</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={data.artOfEmbroidery.description}
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">CTA Button Label</label>
                  <input
                    type="text"
                    name="ctaText"
                    defaultValue={data.artOfEmbroidery.ctaText}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">CTA Button Redirection Link</label>
                  <input
                    type="text"
                    name="ctaLink"
                    defaultValue={data.artOfEmbroidery.ctaLink}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              {/* Segment Image upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Section Featured Cover Asset</label>
                <div className="border border-dashed border-white/10 p-6 rounded-lg text-center relative bg-[#161515]/30">
                  {data.artOfEmbroidery.image ? (
                    <div className="relative h-40 w-full rounded overflow-hidden border border-white/10">
                      <img src={data.artOfEmbroidery.image} alt="Art Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-poppins uppercase tracking-wider">Drag & drop new file to replace</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-brand-gray mx-auto mb-2" />
                      <span className="text-[10px] text-brand-gray uppercase font-poppins">Click to choose image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "artOfEmbroidery", "artImage")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {uploadingArtImage && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading cover to Cloudinary...</span>}
              </div>

              <button
                type="submit"
                disabled={saveLoading || uploadingArtImage}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all"
              >
                {saveLoading ? "Saving Changes..." : "Save Cinematic Segment"}
              </button>
            </form>
          )}

          {/* 4. Testimonials List */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest">Client Testimonials Review</h3>
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="flex items-center gap-1 text-[10px] font-poppins text-brand-gold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Testimonial
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data.testimonials && data.testimonials.map((t, idx) => (
                  <div key={idx} className="bg-[#161515] border border-white/5 p-4 rounded-lg relative space-y-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(idx)}
                      className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded text-brand-gray hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-poppins text-brand-gray uppercase mb-1">Client Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                          className="w-full bg-[#0E0E0E] border border-white/5 rounded p-2 text-xs text-brand-ivory font-inter focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-poppins text-brand-gray uppercase mb-1">Client Role/Organization</label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => handleTestimonialChange(idx, "role", e.target.value)}
                          className="w-full bg-[#0E0E0E] border border-white/5 rounded p-2 text-xs text-brand-ivory font-inter focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-poppins text-brand-gray uppercase mb-1">Review Comments</label>
                      <textarea
                        value={t.content}
                        rows="2"
                        onChange={(e) => handleTestimonialChange(idx, "content", e.target.value)}
                        className="w-full bg-[#0E0E0E] border border-white/5 rounded p-2 text-xs text-brand-ivory font-inter focus:outline-none"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveTestimonials}
                disabled={saveLoading}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all mt-4"
              >
                {saveLoading ? "Saving Changes..." : "Save Testimonials List"}
              </button>
            </div>
          )}

          {/* 5. Instagram Feed */}
          {activeTab === "instagram" && data.instagramFeed && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const imagesStr = e.target.images.value;
                const imagesArr = imagesStr.split(",").map(img => img.trim()).filter(Boolean);
                handleSaveSection("instagramFeed", {
                  heading: e.target.heading.value,
                  username: e.target.username.value,
                  images: imagesArr,
                });
              }}
              className="space-y-6"
            >
              <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Instagram Lookbook Showcase</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Segment Title</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={data.instagramFeed.heading}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Instagram Username handle</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={data.instagramFeed.username}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Instagram Post Image URLs (Comma separated)</label>
                <textarea
                  name="images"
                  rows="4"
                  defaultValue={data.instagramFeed.images.join(", ")}
                  placeholder="Paste URL list separated by commas..."
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                ></textarea>
              </div>

              <div className="border border-white/5 p-4 rounded-lg bg-white/2">
                <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-widest mb-3">Feed Live Showcase Preview ({data.instagramFeed.images.length})</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {data.instagramFeed.images.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white/5 border border-white/5 rounded overflow-hidden">
                      <img src={img} alt="Insta" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all"
              >
                {saveLoading ? "Saving Changes..." : "Save Feed Grid"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
