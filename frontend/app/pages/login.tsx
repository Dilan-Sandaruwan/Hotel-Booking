"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../context/UserContext";

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gold-500/10" />
            <span className="text-slate-600 text-xs tracking-widest uppercase">or continue with</span>
            <div className="flex-1 h-px bg-gold-500/10" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="login-google"
              type="button"
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gold-500/15 bg-navy-800/40 text-slate-300 text-sm font-medium hover:border-gold-500/30 hover:bg-navy-800/60 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.93c1.7 0 3.23.62 4.43 1.63l3.3-3.3A11.94 11.94 0 0 0 12 1C8.25 1 4.98 3 3.06 6.04l2.21 3.72Z"/>
                <path fill="#34A853" d="M16.04 18.01A7.07 7.07 0 0 1 12 19.07c-2.86 0-5.32-1.69-6.53-4.14l-3.39 2.6A11.96 11.96 0 0 0 12 23c2.97 0 5.69-1.07 7.77-2.82l-3.73-2.17Z"/>
                <path fill="#4A90D9" d="M19.77 20.18A11.94 11.94 0 0 0 23 13c0-.74-.07-1.46-.19-2.16H12v4.55h6.18a5.25 5.25 0 0 1-2.37 3.44l3.96 2.35Z"/>
                <path fill="#FBBC05" d="M5.47 14.93A7.16 7.16 0 0 1 4.93 12c0-.68.1-1.34.27-1.97L3 7.29A11.94 11.94 0 0 0 1 12c0 1.92.45 3.73 1.24 5.34l3.23-2.41Z"/>
              </svg>
              Google
            </button>
            <button
              id="login-apple"
              type="button"
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gold-500/15 bg-navy-800/40 text-slate-300 text-sm font-medium hover:border-gold-500/30 hover:bg-navy-800/60 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-slate-200" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.23.72 3 .76 1.16-.23 2.28-.9 3.5-.84 1.5.1 2.63.64 3.36 1.64-3.08 1.85-2.36 5.6.14 6.72-.43 1.18-.99 2.35-2 3.6ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/>
              </svg>
              Apple
            </button>
          </div>

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
