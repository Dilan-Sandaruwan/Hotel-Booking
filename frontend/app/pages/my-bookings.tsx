"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

// ---------- Types ----------------------------------------------------------

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface DbBooking {
  id: string;
  hotel_id: string;
  room_id: string;
  hotel_name: string;
  hotel_city: string;
  hotel_image: string;
  room_name: string;
  first_name: string;
  last_name: string;
  email: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  number_of_guests: number;
  price_per_night: number;
  base_total: number;
  taxes_and_fees: number;
  total_amount: number;
  payment_status: string;
  booking_status: BookingStatus;
  created_at: string;
}

// ---------- Status badge ---------------------------------------------------

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = {
    confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  const labels = { confirmed: "✓ Confirmed", pending: "⏳ Pending", cancelled: "✕ Cancelled" };
  return (
    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${cfg[status]}`}>
      {labels[status]}
    </span>
  );
}

// ---------- Page -----------------------------------------------------------

export default function MyBookingsPage() {
  const router = useRouter();
  const { isLoggedIn, user, initials } = useUser();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Fetch bookings from the backend once we have a userId
  useEffect(() => {
    if (!isLoggedIn || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/bookings/user/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data: DbBooking[]) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, [isLoggedIn, user.id]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ---------- Filtering & stats -------------------------------------------

  const filtered = bookings.filter((b) => {
    const checkOut = new Date(b.check_out_date);
    if (activeTab === "upcoming") return checkOut >= now && b.booking_status !== "cancelled";
    if (activeTab === "past")     return checkOut < now  || b.booking_status === "cancelled";
    return true;
  });

  const confirmed   = bookings.filter((b) => b.booking_status === "confirmed");
  const upcoming    = bookings.filter((b) => new Date(b.check_out_date) >= now && b.booking_status !== "cancelled").length;
  const countries   = new Set(confirmed.map((b) => b.hotel_city?.split(",").pop()?.trim())).size;
  const totalSpent  = bookings
    .filter((b) => b.booking_status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_amount), 0);

  const stats = [
    { label: "Total Stays",       value: confirmed.length },
    { label: "Upcoming",          value: upcoming },
    { label: "Countries Visited", value: countries },
    { label: "Total Spent",       value: `LKR ${totalSpent.toLocaleString()}` },
  ];

  // ---------- Render -------------------------------------------------------

  return (
    <div className="pt-20 min-h-screen bg-navy-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 border-b border-gold-500/15 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-xl hover:shadow-lg hover:shadow-gold-500/30 transition-all"
                title="Edit Profile"
              >
                {initials !== "?" ? initials : "👤"}
              </Link>
              <div>
                <h1 className="text-white text-2xl md:text-3xl">My Bookings</h1>
                <p className="text-slate-500 text-sm">{user.email || "Not logged in"}</p>
              </div>
            </div>
            <Link
              href="/hotels"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5 transition-all"
            >
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
              {tab} {tab === "all" && `(${bookings.length})`}
            </button>
          ))}
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="glass p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-slate-100 mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-6">Your travel history will appear here.</p>
            <Link
              href="/hotels"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          /* Booking cards */
          <div className="flex flex-col gap-4">
            {filtered.map((b) => {
              const checkInFmt  = new Date(b.check_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const checkOutFmt = new Date(b.check_out_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const bookedOnFmt = new Date(b.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
              const shortId     = b.id.split("-")[0].toUpperCase();

              return (
                <div key={b.id} className="glass overflow-hidden animate-fade-in">
                  {/* Main row */}
                  <div
                    onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                    className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gold-500/3 transition-all"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-0">
                      {/* Hotel */}
                      <div>
                        <p className="text-gold-500 text-xs font-bold tracking-widest mb-1"># {shortId}</p>
                        <p className="text-slate-100 font-semibold text-sm truncate">{b.hotel_name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">📍 {b.hotel_city}</p>
                      </div>
                      {/* Dates */}
                      <div>
                        <p className="text-slate-600 text-xs mb-0.5">Dates</p>
                        <p className="text-slate-300 text-sm">{checkInFmt} → {checkOutFmt}</p>
                        <p className="text-slate-600 text-xs mt-0.5">{b.number_of_nights} night{b.number_of_nights !== 1 ? "s" : ""} · {b.number_of_guests} guest{b.number_of_guests !== 1 ? "s" : ""}</p>
                      </div>
                      {/* Room */}
                      <div>
                        <p className="text-slate-600 text-xs mb-0.5">Room Type</p>
                        <p className="text-slate-300 text-sm">{b.room_name || "Standard Room"}</p>
                        <p className="text-slate-600 text-xs mt-0.5">LKR {Number(b.price_per_night).toLocaleString()} / night</p>
                      </div>
                      {/* Price + status */}
                      <div className="flex flex-col sm:items-end gap-1.5">
                        <p className="text-gold-500 font-black text-xl">LKR {Number(b.total_amount).toLocaleString()}</p>
                        <StatusBadge status={b.booking_status} />
                      </div>
                    </div>
                    <span className={`text-slate-500 text-xl transition-transform duration-300 shrink-0 ${expandedId === b.id ? "rotate-180" : ""}`}>⌄</span>
                  </div>

                  {/* Expanded details */}
                  {expandedId === b.id && (
                    <div className="animate-slide-down border-t border-gold-500/10 px-5 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-slate-600 text-sm">Booked on {bookedOnFmt}</p>
                        <p className="text-slate-600 text-sm mt-1">
                          Subtotal LKR {Number(b.base_total).toLocaleString()} + Taxes LKR {Number(b.taxes_and_fees).toLocaleString()}
                        </p>
                        <p className="text-slate-600 text-sm mt-1">Confirmation sent to {b.email}</p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {b.booking_status !== "cancelled" && (
                          <>
                            <Link
                              href={`/confirmation?id=${b.id}`}
                              className="px-4 py-2 rounded-full border border-gold-500 text-gold-400 text-sm font-semibold hover:bg-gold-500/10 transition-all"
                            >
                              View Voucher
                            </Link>
                          </>
                        )}
                        <Link
                          href={`/hotels/${b.hotel_id}`}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 text-sm font-bold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
