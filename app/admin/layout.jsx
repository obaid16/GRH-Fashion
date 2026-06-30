"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Library,
  ShoppingCart,
  Users,
  Ticket,
  Home as HomeIcon,
  Image as ImageIcon,
  FolderOpen,
  BookOpen,
  MessageSquare,
  Mail,
  TrendingUp,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Bell,
} from "lucide-react";
import { getAdminSession, adminLogout } from "@/actions/auth";

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Load session
  useEffect(() => {
    async function loadSession() {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }
      const activeSession = await getAdminSession();
      if (!activeSession) {
        router.push("/admin/login");
      } else {
        setSession(activeSession);
      }
      setLoading(false);
    }
    loadSession();
  }, [pathname, router]);

  const handleLogout = async () => {
    const res = await adminLogout();
    if (res.success) {
      router.push("/admin/login");
    }
  };

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-brand-ivory text-brand-black admin-theme">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory text-brand-black flex items-center justify-center flex-col gap-4 admin-theme">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-poppins text-xs uppercase tracking-widest text-brand-gold/60">Loading Atelier CMS...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Collections", href: "/admin/collections", icon: Library },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Homepage CMS", href: "/admin/homepage", icon: HomeIcon },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Media Library", href: "/admin/media", icon: FolderOpen },
    { name: "Blog CMS", href: "/admin/blog", icon: BookOpen },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ...(session?.role === "Super Admin"
      ? [{ name: "Admins", href: "/admin/admins", icon: ShieldAlert }]
      : []),
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0E0E0E]/95 border-r border-white/5 backdrop-blur-md">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
            <span className="font-playfair text-white text-lg font-bold">G</span>
          </div>
          <div className="flex flex-col">
            <span className="font-poppins text-xs font-semibold tracking-wider text-brand-ivory uppercase">GRH Atelier</span>
            <span className="text-[9px] font-inter text-brand-gold uppercase tracking-[0.2em] font-medium">Control Hub</span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="hidden lg:block text-brand-gray hover:text-brand-ivory transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transform transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-poppins transition-all duration-300 ${
                isActive
                  ? "bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold font-medium"
                  : "text-brand-gray hover:text-brand-ivory hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-gold" : "text-brand-gray"}`} />
              <span className={sidebarOpen ? "block animate-fadeIn" : "hidden"}>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin User Info Footer */}
      {session && (
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
              <User className="w-4 h-4 text-brand-gold" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-poppins text-xs font-medium text-brand-ivory truncate">{session.name}</span>
                <span className="text-[9px] font-inter text-brand-gold uppercase tracking-wider">{session.role}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-poppins text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-black flex admin-theme">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar Drawer - Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            ></motion.div>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="h-16 border-b border-white/5 bg-[#0E0E0E]/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-brand-gray hover:text-brand-ivory transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-poppins text-brand-gray">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-ivory capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-brand-gray hover:text-brand-ivory">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <Link href="/" target="_blank" className="font-poppins text-[10px] text-brand-gold hover:underline uppercase tracking-wider">
              Visit Website
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
