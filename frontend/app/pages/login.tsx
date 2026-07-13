"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../config";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsLoggedIn } = useUser();
  const redirect = searchParams.get("redirect") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setError(data.error || "Failed to log in.");
        return;
      }

      // Extract details from backend response
      const fullName = data.user.fullName || "User";
      const names = fullName.trim().split(" ");
      const firstName = names[0] || "Guest";
      const lastName = names.slice(1).join(" ") || "User";

      const matchedUser = {
        id: data.user.id,
        firstName: firstName,
        lastName: lastName,
        email: data.user.email,
        phone: "",
        country: "",
        city: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        preferredCurrency: "LKR",
        preferredLanguage: "English",
        newsletterOptIn: true,
        avatar: "",
        token: data.token,
      };

      // Set user info dynamically
      setUser(matchedUser);
      setIsLoggedIn(true);
      
      router.push(redirect);
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

      {/* Decorative grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #c9a84c 1px, transparent 1px), linear-gradient(to bottom, #c9a84c 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <span className="text-3xl font-black tracking-tight">
              <span className="text-gold-500 group-hover:text-gold-400 transition-colors">Luxe</span>
              <span className="text-white">Stay</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm mt-2 tracking-wide">Your gateway to premium travel</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/40">
          <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to access your bookings & rewards</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">✉</span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                  Password
                </label>
                <Link href="/forgot-password" className="text-gold-500 hover:text-gold-400 text-xs transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm select-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer group" htmlFor="login-remember">
              <input
                id="login-remember"
                type="checkbox"
                className="w-4 h-4 rounded accent-gold-500 cursor-pointer"
              />
              <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/25 hover:shadow-gold-500/45 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>



          {/* Sign up link */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
              Create one for free →
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-slate-600 text-xs">
          <span className="flex items-center gap-1.5">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1.5">🛡 Privacy Protected</span>
          <span className="flex items-center gap-1.5">✓ Verified Secure</span>
        </div>
      </div>
    </div>
  );
}
