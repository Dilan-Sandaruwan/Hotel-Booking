"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getHotelById } from "../data/hotels";
import { useUser } from "../context/UserContext";

type Step = 1 | 2 | 3;

interface GuestInfo { firstName: string; lastName: string; email: string; phone: string; specialRequests: string; }
interface PaymentInfo { cardNumber: string; cardName: string; expiry: string; cvv: string; }

export default function BookingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user: loggedInUser, isLoggedIn } = useUser();

  const hotelId = params.get("hotelId") ?? "1";
  const roomId = params.get("roomId") ?? "";
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const guests = +(params.get("guests") ?? "2");
  const nights = +(params.get("nights") ?? "1");
  const total = +(params.get("total") ?? "0");

  const hotel = getHotelById(hotelId);
  const room = hotel?.rooms.find((r) => r.id === roomId) ?? hotel?.rooms[0];
  const taxes = Math.round(total * 0.12);
  const grandTotal = total + taxes;

  const [step, setStep] = useState<Step>(1);
  const [guest, setGuest] = useState<GuestInfo>({ firstName: "", lastName: "", email: "", phone: "", specialRequests: "" });
  const [payment, setPayment] = useState<PaymentInfo>({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in. If not, redirect.
    const rawUser = localStorage.getItem("luxestay_user");
    if (!rawUser) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    } else {
      try {
        const u = JSON.parse(rawUser);
        setGuest((prev) => ({
          ...prev,
          firstName: prev.firstName || u.firstName || "",
          lastName: prev.lastName || u.lastName || "",
          email: prev.email || u.email || "",
          phone: prev.phone || u.phone || "",
        }));
      } catch {}
    }
  }, [router]);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const bookingId = "LX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem("lastBooking", JSON.stringify({
      bookingId, hotelId, hotelName: hotel?.name, checkIn, checkOut, guests, nights,
      roomType: room?.name, totalPrice: grandTotal,
      guestName: `${guest.firstName} ${guest.lastName}`, guestEmail: guest.email,
      bookingDate: new Date().toISOString(),
    }));
    router.push(`/confirmation?id=${bookingId}`);
  };

  const inputCls = "w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all";

  if (!hotel || !room) {
    return (
      <div className="pt-24 min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="glass p-12 text-center">
          <h2 className="text-slate-100 mb-4">Hotel not found</h2>
          <Link href="/hotels" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold">Browse Hotels</Link>
        </div>
      </div>
    );
  }

  const STEPS = [{ n: 1, label: "Your Details" }, { n: 2, label: "Payment" }, { n: 3, label: "Review" }];

  return (
    <div className="pt-20 min-h-screen bg-navy-900">

      {/* Header */}
      <div className="bg-navy-950 border-b border-gold-500/15 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h1 className="text-white text-2xl md:text-3xl mb-1">Complete Your Booking</h1>
          <p className="text-slate-500">{hotel.name} · {room.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* Steps */}
        <div className="flex items-center justify-center max-w-lg mx-auto mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${
                  step >= s.n
                    ? "bg-gradient-to-br from-gold-500 to-gold-400 text-navy-900"
                    : "bg-navy-800 text-slate-500 border-2 border-gold-500/20"
                }`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-xs font-medium ${step >= s.n ? "text-gold-400" : "text-slate-600"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 rounded transition-all duration-300 ${step > s.n ? "bg-gradient-to-r from-gold-500 to-gold-400" : "bg-gold-500/15"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col-reverse xl:flex-row gap-8">

          {/* Form */}
          <div className="glass p-6 md:p-8 flex-1 animate-fade-in">

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-slate-100 text-xl mb-7">👤 Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">First Name *</label>
                    <input className={inputCls} placeholder="John" value={guest.firstName} onChange={(e) => setGuest({ ...guest, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Last Name *</label>
                    <input className={inputCls} placeholder="Doe" value={guest.lastName} onChange={(e) => setGuest({ ...guest, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Email *</label>
                  <input className={inputCls} type="email" placeholder="john@example.com" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Phone *</label>
                  <input className={inputCls} type="tel" placeholder="+1 555 000 0000" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
                </div>
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Special Requests</label>
                  <textarea className={`${inputCls} resize-y`} rows={3} placeholder="Early check-in, dietary needs..." value={guest.specialRequests} onChange={(e) => setGuest({ ...guest, specialRequests: e.target.value })} />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!guest.firstName || !guest.lastName || !guest.email || !guest.phone}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-base shadow-xl shadow-gold-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-slate-100 text-xl mb-7">💳 Payment Details</h2>
                <div className="flex items-center gap-3 p-4 bg-emerald-500/8 border border-emerald-500/25 rounded-xl mb-6">
                  <span className="text-xl">🔒</span>
                  <span className="text-emerald-400 text-sm">256-bit SSL encrypted and secure payment.</span>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Card Number *</label>
                  <input className={inputCls} placeholder="1234 5678 9012 3456" maxLength={19} value={payment.cardNumber}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim(); setPayment({ ...payment, cardNumber: v }); }} />
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Cardholder Name *</label>
                  <input className={inputCls} placeholder="John Doe" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Expiry *</label>
                    <input className={inputCls} placeholder="MM/YY" maxLength={5} value={payment.expiry}
                      onChange={(e) => { let v = e.target.value.replace(/\D/g, ""); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4); setPayment({ ...payment, expiry: v }); }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">CVV *</label>
                    <input className={inputCls} placeholder="123" maxLength={4} value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "") })} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-full border border-gold-500/25 text-slate-400 hover:text-gold-400 hover:border-gold-500/50 font-semibold transition-all cursor-pointer">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={!payment.cardNumber || !payment.cardName || !payment.expiry || !payment.cvv}
                    className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-base shadow-xl shadow-gold-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    Review Booking →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-slate-100 text-xl mb-7">✅ Review & Confirm</h2>
                <div className="glass-dark p-5 rounded-2xl mb-4">
                  <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">Guest Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[["Name", `${guest.firstName} ${guest.lastName}`], ["Email", guest.email], ["Phone", guest.phone]].map(([k, v]) => (
                      <div key={k}>
                        <div className="text-slate-600 text-xs mb-0.5">{k}</div>
                        <div className="text-slate-100 font-medium text-sm">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-dark p-5 rounded-2xl mb-6">
                  <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">Payment</p>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>💳</span>
                    <span>•••• •••• •••• {payment.cardNumber.slice(-4)}</span>
                    <span className="text-slate-600">({payment.cardName})</span>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer mb-7">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-gold-500 w-4 h-4" />
                  <span className="text-slate-500 text-sm leading-relaxed">
                    I agree to the <Link href="#" className="text-gold-400 hover:underline">Terms of Service</Link> and{" "}
                    <Link href="#" className="text-gold-400 hover:underline">Cancellation Policy</Link>.
                  </span>
                </label>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-6 py-3.5 rounded-full border border-gold-500/25 text-slate-400 hover:text-gold-400 hover:border-gold-500/50 font-semibold transition-all cursor-pointer">
                    ← Back
                  </button>
                  <button onClick={handleConfirm} disabled={!agreeTerms || loading}
                    className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-base shadow-xl shadow-gold-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin-loader" />
                        Processing...
                      </>
                    ) : `Confirm & Pay LKR ${grandTotal}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="w-full xl:w-96 shrink-0">
            <div className="glass p-6 animate-fade-in xl:sticky xl:top-24">
              <img src={hotel.imageUrl} alt={hotel.name}
                className="w-full h-40 object-cover rounded-xl mb-5"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}bk/600/400`; }} />
              <h3 className="text-slate-100 font-semibold mb-0.5">{hotel.name}</h3>
              <p className="text-slate-500 text-sm mb-5">📍 {hotel.location}</p>
              <div className="divider-gold" />
              {[["Room", room.name], ["Check In", checkIn || "—"], ["Check Out", checkOut || "—"], ["Nights", nights || "—"], ["Guests", guests]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between mb-2.5">
                  <span className="text-slate-500 text-sm">{k}</span>
                  <span className="text-slate-300 text-sm font-medium">{v}</span>
                </div>
              ))}
              <div className="divider-gold" />
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-500 text-sm">LKR {room.price} × {nights} nights</span>
                <span className="text-slate-300 text-sm">LKR {total}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-slate-500 text-sm">Taxes & fees</span>
                <span className="text-slate-300 text-sm">LKR {taxes}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-gold-500/8 border border-gold-500/20 rounded-xl">
                <span className="text-slate-100 font-bold">Total</span>
                <span className="text-gold-500 font-black text-xl">LKR {grandTotal}</span>
              </div>
              <p className="text-slate-600 text-xs text-center mt-3">🔒 Secure · Free cancellation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
