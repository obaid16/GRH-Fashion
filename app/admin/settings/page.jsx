"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/actions/setting";
import { uploadFileToCloudinary } from "@/actions/upload";
import { Upload, Check, Settings, Mail, CreditCard, Shield, Globe, Landmark } from "lucide-react";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("brand");
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Upload states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === "logo") setUploadingLogo(true);
    if (field === "favicon") setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFileToCloudinary(formData);
      if (result && result.url) {
        setSettings({
          ...settings,
          [field]: result.url,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Asset upload failed.");
    } finally {
      if (field === "logo") setUploadingLogo(false);
      if (field === "favicon") setUploadingFavicon(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg("");

    const formData = new FormData(e.target);
    
    // Construct the settings object matching Mongoose structure
    const updatedData = {
      websiteName: formData.get("websiteName") || settings.websiteName,
      logo: settings.logo,
      favicon: settings.favicon,
      primaryColor: formData.get("primaryColor") || settings.primaryColor,
      secondaryColor: formData.get("secondaryColor") || settings.secondaryColor,
      shippingCharges: parseFloat(formData.get("shippingCharges") || 0),
      taxPercentage: parseFloat(formData.get("taxPercentage") || 0),
      currency: formData.get("currency") || settings.currency,
      socialLinks: {
        instagram: formData.get("instagram") || "",
        facebook: formData.get("facebook") || "",
        pinterest: formData.get("pinterest") || "",
        whatsapp: formData.get("whatsapp") || "",
      },
      contactDetails: {
        email: formData.get("email") || "",
        phone: formData.get("phone") || "",
        address: formData.get("address") || "",
        googleMapEmbed: formData.get("googleMapEmbed") || "",
      },
      seoDefaults: {
        title: formData.get("seoTitle") || "",
        description: formData.get("seoDesc") || "",
        keywords: formData.get("seoKeywords") ? formData.get("seoKeywords").split(",").map(k => k.trim()) : [],
      },
      smtp: {
        host: formData.get("smtpHost") || "",
        port: parseInt(formData.get("smtpPort") || 587),
        user: formData.get("smtpUser") || "",
        password: formData.get("smtpPass") || "",
      },
      paymentKeys: {
        razorpayKeyId: formData.get("razorpayKeyId") || "",
        razorpayKeySecret: formData.get("razorpayKeySecret") || "",
        stripePublicKey: formData.get("stripePublicKey") || "",
        stripeSecretKey: formData.get("stripeSecretKey") || "",
      },
    };

    const res = await updateSettings(updatedData);
    if (res.success) {
      setSettings(res.settings);
      setSuccessMsg("Global Atelier Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(res.error || "Failed to save settings");
    }
    setSaveLoading(false);
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading global settings...</p>
      </div>
    );
  }

  const tabs = [
    { id: "brand", name: "Brand & Visual Profile" },
    { id: "contact", name: "Contact & Location" },
    { id: "social", name: "Social Channels" },
    { id: "seo", name: "Search Engine Optimization" },
    { id: "smtp", name: "SMTP Mailer" },
    { id: "payment", name: "Payment Services" },
    { id: "taxes", name: "Tax & Shipping" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Atelier Settings</h1>
        <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Configure global variables, api keys and email configurations</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/20 border border-green-500/30 text-green-400 text-xs font-poppins font-medium uppercase tracking-wider rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Settings layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar tabs */}
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

        {/* Configurations Form panels */}
        <div className="lg:col-span-3 bg-[#0F0E0E]/80 border border-white/5 p-6 rounded-xl backdrop-blur-md">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Brand Profile Settings */}
            {activeTab === "brand" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Brand Identity Parameters</h3>
                
                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Website Display Name</label>
                  <input
                    type="text"
                    name="websiteName"
                    defaultValue={settings.websiteName}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Primary Branding Color</label>
                    <input
                      type="text"
                      name="primaryColor"
                      defaultValue={settings.primaryColor}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Secondary Branding Color</label>
                    <input
                      type="text"
                      name="secondaryColor"
                      defaultValue={settings.secondaryColor}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                {/* Upload Logos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Atelier Logo (Header)</label>
                    <div className="border border-dashed border-white/10 p-4 text-center relative bg-[#161515]/30 rounded-lg">
                      {settings.logo ? (
                        <div className="relative h-14 w-full rounded overflow-hidden border border-white/10 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={settings.logo} alt="Brand Logo" className="h-10 w-auto object-contain" />
                        </div>
                      ) : (
                        <Upload className="w-5 h-5 text-brand-gray mx-auto" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadingLogo}
                      />
                    </div>
                    {uploadingLogo && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading Logo...</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Favicon Icon (Tab)</label>
                    <div className="border border-dashed border-white/10 p-4 text-center relative bg-[#161515]/30 rounded-lg">
                      {settings.favicon ? (
                        <div className="relative h-14 w-full rounded overflow-hidden border border-white/10 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={settings.favicon} alt="Favicon" className="h-6 w-6 object-contain" />
                        </div>
                      ) : (
                        <Upload className="w-5 h-5 text-brand-gray mx-auto" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "favicon")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadingFavicon}
                      />
                    </div>
                    {uploadingFavicon && <span className="text-[8px] text-brand-gold font-poppins uppercase tracking-wider block text-center animate-pulse">Uploading Favicon...</span>}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Contact Details Settings */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Location & Client Support Contacts</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Support Email Address</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={settings.contactDetails.email}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Support Hotline Phone</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={settings.contactDetails.phone}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Atelier Physical Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={settings.contactDetails.address}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Google Maps Embed URL</label>
                  <textarea
                    name="googleMapEmbed"
                    rows="3"
                    defaultValue={settings.contactDetails.googleMapEmbed}
                    placeholder="<iframe src='https://google.com/maps/...'></iframe>"
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* 3. Social Media Links */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Social Channels Mapping</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Instagram Link</label>
                    <input
                      type="text"
                      name="instagram"
                      defaultValue={settings.socialLinks.instagram}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Facebook Link</label>
                    <input
                      type="text"
                      name="facebook"
                      defaultValue={settings.socialLinks.facebook}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Pinterest Link</label>
                    <input
                      type="text"
                      name="pinterest"
                      defaultValue={settings.socialLinks.pinterest}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">WhatsApp Direct link</label>
                    <input
                      type="text"
                      name="whatsapp"
                      defaultValue={settings.socialLinks.whatsapp}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SEO Defaults */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Global Search Engine Optimization</h3>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Default SEO Title template</label>
                  <input
                    type="text"
                    name="seoTitle"
                    defaultValue={settings.seoDefaults.title}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Default SEO Description copy</label>
                  <textarea
                    name="seoDesc"
                    rows="3"
                    defaultValue={settings.seoDefaults.description}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SEO Search Keywords (Comma separated)</label>
                  <input
                    type="text"
                    name="seoKeywords"
                    defaultValue={settings.seoDefaults.keywords.join(", ")}
                    className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 5. SMTP Mail Server credentials */}
            {activeTab === "smtp" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">SMTP Transporter details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Outgoing SMTP Host Server</label>
                    <input
                      type="text"
                      name="smtpHost"
                      placeholder="smtp.mailgun.org"
                      defaultValue={settings.smtp.host}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SMTP Server Port</label>
                    <input
                      type="number"
                      name="smtpPort"
                      defaultValue={settings.smtp.port}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SMTP Username login</label>
                    <input
                      type="text"
                      name="smtpUser"
                      defaultValue={settings.smtp.user}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">SMTP Password</label>
                    <input
                      type="password"
                      name="smtpPass"
                      defaultValue={settings.smtp.password}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Payment Keys */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Gateway Keys Mapping</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Razorpay Key ID</label>
                    <input
                      type="text"
                      name="razorpayKeyId"
                      defaultValue={settings.paymentKeys.razorpayKeyId}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Razorpay Secret Key</label>
                    <input
                      type="password"
                      name="razorpayKeySecret"
                      defaultValue={settings.paymentKeys.razorpayKeySecret}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Stripe Publishable Key</label>
                    <input
                      type="text"
                      name="stripePublicKey"
                      defaultValue={settings.paymentKeys.stripePublicKey}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Stripe Secret Key</label>
                    <input
                      type="password"
                      name="stripeSecretKey"
                      defaultValue={settings.paymentKeys.stripeSecretKey}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. Taxes & Shipping */}
            {activeTab === "taxes" && (
              <div className="space-y-6">
                <h3 className="text-sm font-poppins text-brand-gold uppercase tracking-widest border-b border-white/5 pb-2">Tax, Shipping Rates & Currency</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Shipping Charges (₹)</label>
                    <input
                      type="number"
                      name="shippingCharges"
                      step="0.01"
                      defaultValue={settings.shippingCharges}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Tax Percentage (%)</label>
                    <input
                      type="number"
                      name="taxPercentage"
                      step="0.01"
                      defaultValue={settings.taxPercentage}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Display Currency Symbol</label>
                    <select
                      name="currency"
                      defaultValue={settings.currency}
                      className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2.5 text-xs text-brand-ivory font-poppins focus:outline-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Form submit button */}
            <div className="pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={saveLoading || uploadingLogo || uploadingFavicon}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3.5 rounded transition-all disabled:opacity-50"
              >
                {saveLoading ? "Saving Configurations..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
