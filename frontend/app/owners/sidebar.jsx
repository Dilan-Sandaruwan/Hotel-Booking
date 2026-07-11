import React from "react";
import Link from "next/link";

export default function Sidebar({ activeTab, setActiveTab, handleLogout, hotelsCount }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "add-hotel", label: "Add Hotel", icon: "🏨" },
    { id: "bookings", label: "My Bookings", icon: "📅" },
  ];

  return (
    <aside className="w-64 bg-navy-950 border-r border-gold-500/15 flex flex-col fixed top-0 bottom-0 left-0 z-40">
      {/* Brand Logo */}
      <div className="py-6 px-6 border-b border-gold-500/10 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center font-black text-navy-900 text-base shadow-md shadow-gold-500/30">
            L
          </div>
          <span className="font-display font-bold text-lg text-gold-gradient">
            LuxeStay
          </span>
        </Link>
        <span className="text-[10px] bg-gold-500/15 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
          Host
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
              activeTab === item.id
                ? "bg-gold-500/12 text-gold-400 border border-gold-500/20 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-gold-500/5"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Area - Owner Profile & Logout */}
      <div className="p-4 border-t border-gold-500/10 bg-navy-950 flex flex-col gap-3">
        <div className="flex items-center justify-between bg-gold-500/5 border border-gold-500/10 p-3 rounded-xl">
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            title="Owner Profile"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-sm shadow-md group-hover:scale-105 transition-all ${
              activeTab === "profile" ? "ring-2 ring-gold-500" : ""
            }`}>
              AD
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">Awantha de S.</p>
              <p className="text-slate-500 text-[10px] truncate">Owner Account</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-all cursor-pointer"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
