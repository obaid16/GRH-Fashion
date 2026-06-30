"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const result = await adminLogin(formData);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 relative overflow-hidden admin-theme">
      {/* Cinematic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0F0E0E]/80 border border-white/5 p-8 md:p-10 shadow-2xl backdrop-blur-md rounded-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-brand-gold/15 items-center justify-center mb-4 border border-brand-gold/30">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
          </div>
          <h1 className="text-2xl font-playfair text-brand-ivory tracking-widest uppercase mb-2">Atelier Control Hub</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-[0.2em] uppercase">Sign in to manage your website</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-300 rounded-lg text-xs font-inter"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#161515] border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-brand-ivory font-inter placeholder-brand-gray focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="admin@grhfashion.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Password</label>
              <a href="#" className="text-[9px] font-poppins text-brand-gold hover:underline uppercase tracking-wider">Forgot?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full bg-[#161515] border border-white/5 rounded-lg py-3 pl-10 pr-10 text-sm text-brand-ivory font-inter placeholder-brand-gray focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-gray hover:text-brand-ivory transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 relative overflow-hidden flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] font-inter text-brand-gray/60 leading-relaxed">
          Default seed details:<br/>
          <span className="text-brand-gold/60">admin@grhfashion.com / admin12345</span>
        </div>
      </motion.div>
    </div>
  );
}
