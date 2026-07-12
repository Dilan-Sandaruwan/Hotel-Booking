"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../context/UserContext";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-emerald-400", "bg-emerald-500"][score];
  const barColor = ["", "bg-red-500/70", "bg-amber-500/70", "bg-emerald-400/70", "bg-emerald-500/70"][score];

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2 animate-fade-in">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= score ? barColor : "bg-navy-700"}`}
          />
        ))}
        <span className={`text-xs font-semibold ml-1 ${["", "text-red-400", "text-amber-400", "text-emerald-400", "text-emerald-400"][score]}`}>
          {strengthLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-emerald-400" : "text-slate-600"}`}>
            {c.pass ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsLoggedIn } = useUser();
  const redirect = searchParams.get("redirect") ?? "/";
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms & Privacy Policy.");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          password: form.password,
          termsAccepted: agreed,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setError(data.error || "Failed to register.");
        return;
      }

      // Set user info dynamically
      const names = form.name.trim().split(" ");
      const firstName = names[0] || "Guest";
      const lastName = names.slice(1).join(" ") || "User";

      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: form.email,
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

      setUser(newUser);
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
        <div className="absolute -top-48 -right-32 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-[100px]" />
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
          <p className="text-slate-500 text-sm mt-2 tracking-wide">Join the world's finest travellers</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/40">
          <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-8">Start your journey to luxury travel today</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">👤</span>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">✉</span>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔒</span>
                <input
                  id="signup-password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm select-none cursor-pointer"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "👁" : "👁‍🗨"}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-confirm" className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔒</span>
                <input
                  id="signup-confirm"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 transition-all ${
                    form.confirm && form.password !== form.confirm
                      ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
                      : form.confirm && form.password === form.confirm
                      ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                      : "border-gold-500/15 focus:border-gold-500/50 focus:ring-gold-500/30"
                  }`}
                />
                {form.confirm && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    {form.password === form.confirm ? (
                      <span className="text-emerald-400">✓</span>
                    ) : (
                      <span className="text-red-400">✕</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group" htmlFor="signup-terms">
              <input
                id="signup-terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-gold-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                I agree to the{" "}
                <Link href="/terms" className="text-gold-500 hover:text-gold-400 transition-colors">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gold-500 hover:text-gold-400 transition-colors">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              id="signup-submit"
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
                  Creating your account…
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Log in link */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
              Sign in →
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
