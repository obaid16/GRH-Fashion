"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, ShieldAlert, Check, User, Shield, Mail, Key } from "lucide-react";
import { getAllAdmins, registerAdmin, deleteAdmin, getAdminSession } from "@/actions/auth";

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);

  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadAdmins = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    
    // Check session
    const session = await getAdminSession();
    setCurrentSession(session);

    if (session) {
      const data = await getAllAdmins();
      setAdmins(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      permissions: formData.get("role") === "Super Admin" ? ["all"] : ["read", "write"],
    };

    if (!data.name || !data.email || !data.password) {
      setError("Please fill out all fields.");
      setFormLoading(false);
      return;
    }

    const res = await registerAdmin(data);
    if (res.success) {
      setIsOpen(false);
      setSuccessMsg(`Admin account created for ${data.name}!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadAdmins(true);
    } else {
      setError(res.error || "Failed to register admin.");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this administrator account?")) return;
    const res = await deleteAdmin(id);
    if (res.success) {
      setSuccessMsg("Administrator removed successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadAdmins(true);
    } else {
      alert(res.error || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Loading Admin panel...</p>
      </div>
    );
  }

  if (!currentSession || currentSession.role !== "Super Admin") {
    return (
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-8 rounded-xl text-center max-w-xl mx-auto space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-playfair text-brand-ivory uppercase tracking-wider">Access Restricted</h2>
        <p className="text-xs font-inter text-brand-gray leading-relaxed">
          You are authenticated as <strong>{currentSession?.name || "Admin"}</strong> with the role of <strong>{currentSession?.role || "Editor"}</strong>.<br />
          Only Super Admin accounts are authorized to modify administrator profiles and credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Admin Staff Accounts</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Manage portal administrative permissions and accounts</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/20 border border-green-500/30 text-green-400 text-xs font-poppins font-medium uppercase tracking-wider rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Admin User</th>
                <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Access Role</th>
                <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Created Date</th>
                <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-inter">
              {admins.map((ad) => (
                <tr key={ad._id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center border border-brand-gold/20 text-brand-gold font-poppins text-xs font-semibold">
                        {ad.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-brand-ivory">{ad.name}</h4>
                        <span className="text-[10px] text-brand-gray block mt-0.5">{ad.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-poppins uppercase tracking-wider font-semibold border ${
                      ad.role === "Super Admin"
                        ? "bg-brand-gold/15 border-brand-gold/30 text-brand-gold"
                        : ad.role === "Admin"
                        ? "bg-blue-950/20 border-blue-500/30 text-blue-400"
                        : "bg-white/5 border-white/5 text-brand-gray"
                    }`}>
                      {ad.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-brand-gray">
                    {new Date(ad.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(ad._id)}
                      disabled={currentSession.id === ad._id}
                      className="p-1 rounded hover:bg-red-500/10 text-brand-gray hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:text-brand-gray"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Registering Admin */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          <div className="w-full max-w-md bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-poppins text-brand-ivory font-semibold uppercase tracking-wider">
                Register Administrator
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
              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Jean Atelier"
                    className="w-full bg-[#161515] border border-white/5 rounded py-2 pl-9 pr-4 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. jean@grhfashion.com"
                    className="w-full bg-[#161515] border border-white/5 rounded py-2 pl-9 pr-4 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Default Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#161515] border border-white/5 rounded py-2 pl-9 pr-4 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Atelier Access Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">
                    <Shield className="w-4 h-4" />
                  </span>
                  <select
                    name="role"
                    required
                    className="w-full bg-[#161515] border border-white/5 rounded py-2.5 pl-9 pr-4 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold font-poppins"
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Editor">Editor (Read & Write)</option>
                    <option value="Super Admin">Super Admin (All operations)</option>
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
                  {formLoading ? "Creating..." : "Save Account"}
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
