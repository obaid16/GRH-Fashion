"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Download, Send, X, Check, Search, Calendar, Sparkles } from "lucide-react";
import { getSubscribers, deleteSubscriber, exportSubscribersToCSV, sendNewsletterBroadcast } from "@/actions/newsletter";

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Compose newsletter states
  const [isOpen, setIsOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadSubscribers = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    const res = await getSubscribers();
    if (res.success) {
      setSubscribers(res.subscribers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleExportCSV = async () => {
    const res = await exportSubscribersToCSV();
    if (res.success) {
      // Create client side download link
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `grh_newsletter_subscribers_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("CSV export failed");
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    setSendLoading(true);
    const res = await sendNewsletterBroadcast(composeSubject, composeBody);
    if (res.success) {
      setComposeSubject("");
      setComposeBody("");
      setIsOpen(false);
      setSuccessMsg(`Newsletter dispatched successfully to ${res.count} subscribers!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      alert(res.error || "Send failed");
    }
    setSendLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    const res = await deleteSubscriber(id);
    if (res.success) {
      loadSubscribers(true);
    } else {
      alert("Delete failed");
    }
  };

  // Filter subscribers list
  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Subscribers Directory</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Manage newsletter contacts and dispatch campaigns</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-brand-ivory border border-white/5 px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4 text-brand-gold" /> Export CSV
          </button>
          
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
          >
            <Send className="w-4 h-4" /> Send Newsletter
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/20 border border-green-500/30 text-green-400 text-xs font-poppins font-medium uppercase tracking-wider rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-brand-ivory focus:outline-none w-full font-inter"
          />
        </div>
      </div>

      {/* Subscribers list table */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying newsletter directory...</p>
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Email Address</th>
                  <th className="p-4 text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Subscribed Date</th>
                  <th className="p-4 text-center text-[9px] font-poppins text-brand-gray uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-inter">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs text-brand-ivory font-medium select-all">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-brand-gray">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1 rounded hover:bg-red-500/10 text-brand-gray hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest">
            No active subscribers registered.
          </div>
        )}
      </div>

      {/* Broadcast Compose Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          <div className="w-full max-w-lg bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-poppins text-brand-ivory font-semibold uppercase tracking-wider">
                Compose Newsletter Broadcast
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-brand-gray hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Subject Heading</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive Preview: Autumn Bridal Couture"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  required
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-poppins text-brand-gray uppercase tracking-widest mb-1.5">Email Body Message</label>
                <textarea
                  placeholder="Type your broadcast message body here..."
                  rows="6"
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  required
                  className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory font-inter focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div className="bg-[#161515]/60 border border-white/5 p-4 rounded-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span className="text-[9px] font-inter text-brand-gray">
                  This campaign will be queued and sent to all <strong>{subscribers.length}</strong> active subscribers in your list.
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={sendLoading}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins font-semibold uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                >
                  {sendLoading ? "Dispatching Broadcast..." : "Send Campaign"}
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
