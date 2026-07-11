"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BookingData {
  bookingId: string; hotelName: string; hotelLocation?: string;
  checkIn: string; checkOut: string; guests: number; nights: number;
  roomType: string; totalPrice: number; guestName: string; guestEmail: string; bookingDate: string;
}

export default function ConfirmationPage() {
  const params = useSearchParams();
  const bookingId = params.get("id") ?? "LX-DEMO01";
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem("lastBooking"); if (raw) setBooking(JSON.parse(raw)); } catch {}
    setTimeout(() => setVisible(true), 100);
  }, []);

  const nights = booking?.nights ?? 0;
  const totalPrice = booking?.totalPrice ?? 0;

  return (
    <div className="pt-20 min-h-screen bg-navy-900 pb-16">
      <div
        className={`max-w-2xl mx-auto px-6 pt-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-4xl font-black text-navy-900 mx-auto mb-6 animate-pulse-gold shadow-2xl shadow-gold-500/40">
            ✓
          </div>
          <h1 className="text-white mb-3">
            Booking <span className="text-gold-gradient">Confirmed!</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Your luxury stay has been successfully booked. We&rsquo;ll send a confirmation email shortly.
          </p>
        </div>

        {/* Booking Card */}
        <div className="glass p-8 mb-6 animate-fade-in-up">

          {/* Reference Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-gold-500/12 to-gold-500/5 border border-gold-500/25 rounded-2xl mb-7 gap-3">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-gold-500 font-display font-black text-3xl tracking-wider">{bookingId}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-semibold">
                ✓ Confirmed
              </span>
              <p className="text-slate-600 text-xs mt-1">
                {booking?.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <h3 className="text-slate-100 text-xl mb-1">{booking?.hotelName ?? "—"}</h3>
          <p className="text-slate-500 text-sm mb-5">{booking?.roomType ?? "—"}</p>

          <div className="divider-gold" />

          <div className="grid grid-cols-2 gap-5 mb-6">
            {[
              { icon: "📅", label: "Check In", value: booking?.checkIn ?? "—" },
              { icon: "📅", label: "Check Out", value: booking?.checkOut ?? "—" },
              { icon: "🌙", label: "Nights", value: `${nights} night${nights > 1 ? "s" : ""}` },
              { icon: "👤", label: "Guests", value: booking?.guests ? `${booking.guests} guest${booking.guests > 1 ? "s" : ""}` : "—" },
              { icon: "👤", label: "Guest Name", value: booking?.guestName ?? "—" },
              { icon: "✉️", label: "Email", value: booking?.guestEmail ?? "—" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-slate-600 text-xs mb-1">{item.icon} {item.label}</p>
                <p className="text-slate-200 font-medium text-sm break-words">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="divider-gold" />

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Paid</span>
            <span className="text-gold-500 font-black text-3xl">LKR {totalPrice}</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: "📧", title: "Confirmation Email", desc: "A detailed receipt and hotel voucher have been sent to your email." },
            { icon: "🏨", title: "Check-in Info", desc: "Standard check-in is 3:00 PM. Early check-in may be arranged." },
            { icon: "🔄", title: "Free Cancellation", desc: "Cancel up to 48 hours before check-in for a full refund." },
            { icon: "📞", title: "24/7 Support", desc: "Our concierge team is available around the clock." },
          ].map((item) => (
            <div key={item.title} className="glass-dark p-5 rounded-2xl">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-slate-200 font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-bookings" className="px-10 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-center shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5 transition-all">
            View My Bookings
          </Link>
          <Link href="/" className="px-10 py-3.5 rounded-full border border-gold-500 text-gold-400 font-semibold text-center hover:bg-gold-500/10 hover:-translate-y-0.5 transition-all">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
