"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Booking } from "../data/hotels";
import { useUser } from "../context/UserContext";

const MOCK_BOOKINGS: Booking[] = [];


function StatusBadge({ status }: { status: Booking["status"] }) {
  const config = {
    confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  const labels = { confirmed: "✓ Confirmed", pending: "⏳ Pending", cancelled: "✕ Cancelled" };
  return (
    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${config[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function MyBookingsPage() {
  const { user, initials } = useUser();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const now = new Date();

  const filtered = MOCK_BOOKINGS.filter((b) => {
    const checkOut = new Date(b.checkOut);
    if (activeTab === "upcoming") return checkOut >= now && b.status !== "cancelled";
    if (activeTab === "past") return checkOut < now || b.status === "cancelled";
    return true;
  });

  const upcoming = MOCK_BOOKINGS.filter((b) => new Date(b.checkOut) >= now && b.status !== "cancelled").length;
  const countriesVisited = new Set(MOCK_BOOKINGS.filter(b => b.status === "confirmed").map(b => b.hotelLocation.split(",").pop()?.trim())).size;
  const stats = [
    { label: "Total Stays", value: MOCK_BOOKINGS.filter((b) => b.status === "confirmed").length },
    { label: "Upcoming", value: upcoming },
    { label: "Countries Visited", value: countriesVisited },
    { label: "Total Spent", value: `LKR ${MOCK_BOOKINGS.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.totalPrice, 0).toLocaleString()}` },
  ];

  return (
    <div className="pt-20 min-h-screen bg-navy-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 border-b border-gold-500/15 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/profile" className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-xl hover:shadow-lg hover:shadow-gold-500/30 transition-all" title="Edit Profile">
                {initials !== "?" ? initials : "👤"}
              </Link>
              <div>
                <h1 className="text-white text-2xl md:text-3xl">My Bookings</h1>
                <p className="text-slate-500 text-sm">{user.email || "Not logged in"}</p>
              </div>
            </div>
            <Link href="/hotels" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5 transition-all">
              + New Booking
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="p-4 bg-gold-500/6 border border-gold-500/14 rounded-xl text-center">
                <div className="text-gold-500 font-black text-2xl font-display">{s.value}</div>
                <div className="text-slate-600 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-7">
          {(["all", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full border text-sm font-medium capitalize transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "border-gold-500 bg-gold-500/12 text-gold-400 font-semibold"
                  : "border-gold-500/20 text-slate-500 hover:border-gold-500/40 hover:text-slate-300"
              }`}
            >
              {tab} {tab === "all" && `(${MOCK_BOOKINGS.length})`}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="glass p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-slate-100 mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-6">Your travel history will appear here.</p>
            <Link href="/hotels" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold">Browse Hotels</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((b) => (
              <div key={b.id} className="glass overflow-hidden animate-fade-in">
                {/* Main Row */}
                <div
                  onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gold-500/3 transition-all"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-0">
                    <div>
                      <p className="text-gold-500 text-xs font-bold tracking-widest mb-1">{b.id}</p>
                      <p className="text-slate-100 font-semibold text-sm">{b.hotelName}</p>
                      <p className="text-slate-500 text-xs mt-0.5">📍 {b.hotelLocation}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs mb-0.5">Dates</p>
                      <p className="text-slate-300 text-sm">{b.checkIn} → {b.checkOut}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{b.rooms} room · {b.guests} guests</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs mb-0.5">Room Type</p>
                      <p className="text-slate-300 text-sm">{b.roomType}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1.5">
                      <p className="text-gold-500 font-black text-xl">LKR {b.totalPrice.toLocaleString()}</p>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                  <span className={`text-slate-500 text-xl transition-transform duration-300 shrink-0 ${expandedId === b.id ? "rotate-180" : ""}`}>⌄</span>
                </div>

                {/* Expanded */}
                {expandedId === b.id && (
                  <div className="animate-slide-down border-t border-gold-500/10 px-5 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-slate-600 text-sm">
                        Booked on {new Date(b.bookingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-slate-600 text-sm">Confirmation sent to {b.guestEmail}</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {b.status !== "cancelled" && (
                        <>
                          <Link href={`/confirmation?id=${b.id}`} className="px-4 py-2 rounded-full border border-gold-500 text-gold-400 text-sm font-semibold hover:bg-gold-500/10 transition-all">
                            View Voucher
                          </Link>
                          <button className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 bg-red-500/10 text-sm font-semibold hover:bg-red-500/20 transition-all cursor-pointer">
                            Cancel
                          </button>
                        </>
                      )}
                      <Link href={`/hotels/${b.hotelId}`} className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 text-sm font-bold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all">
                        Book Again
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
