"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OwnersSignupPage() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const calculatedAge = (() => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!ownerName || !phone || !idNumber || !birthday || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/owners/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: ownerName,
          birthday,
          contactNumber: phone,
          businessEmail: email,
          nationalIdPassport: idNumber,
          password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setError(data.error || "Failed to register as owner.");
        return;
      }

      const emailLower = email.toLowerCase().trim();
      
      let registeredOwners = [];
      try {
        const raw = localStorage.getItem("luxestay_registered_owners");
        if (raw) registeredOwners = JSON.parse(raw);
      } catch {}

      if (!registeredOwners.some((o: any) => o.email.toLowerCase().trim() === emailLower)) {
        registeredOwners.push({
          name: ownerName,
          phone,
          registrationNo: idNumber,
          birthday,
          email: emailLower,
          joinedDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        });
        localStorage.setItem("luxestay_registered_owners", JSON.stringify(registeredOwners));
      }

      localStorage.setItem("ownerLoggedIn", emailLower);
      localStorage.setItem("ownerLoggedInId", data.owner.id);
      router.push("/owners/dashboard");
    } catch (err) {
      setIsLoading(false);
      setError("Failed to connect to the authentication server.");
    }
  }

  return (
    <div className="relative min-h-screen bg-navy-900 flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy-800/60 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <span className="text-3xl font-black tracking-tight">
              <span className="text-gold-500 group-hover:text-gold-400 transition-colors">Luxe</span>
              <span className="text-white">Stay</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm mt-2 tracking-wide">Owner Portal</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/40">
          <h1 className="text-white text-2xl font-bold mb-1">Create Partner Account</h1>
          <p className="text-slate-500 text-sm mb-8">Start listing your property and reach global guests</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    Owner Full Name *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">👤</span>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Awantha de Silva"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">📞</span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* ID Number */}
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    National ID / Passport Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">💳</span>
                    <input
                      type="text"
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="PV-98241 or 199512345V"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Birthday */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                      Birthday *
                    </label>
                    {calculatedAge !== null && (
                      <span className="text-[11px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/15">
                        Age: {calculatedAge} years old
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none z-10">📅</span>
                    <input
                      type="date"
                      required
                      value={birthday}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    Business Email *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">✉</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="partner@yourhotel.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    Create Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">🔑</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Creating account..." : "Register as Owner"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Already have a partner account?{" "}
            <Link href="/owners/login" className="text-gold-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
