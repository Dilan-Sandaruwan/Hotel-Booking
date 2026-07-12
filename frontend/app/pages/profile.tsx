"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserProfile } from "../context/UserContext";

const COUNTRIES = [
  "Sri Lanka", "India", "United States", "United Kingdom", "Australia",
  "Canada", "Singapore", "UAE", "Germany", "France", "Japan", "China",
  "Malaysia", "Thailand", "Maldives", "Other",
];

const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Arabic", "French", "German", "Japanese"];

function Field({
  label, id, type = "text", value, onChange, placeholder, icon, disabled = false,
}: {
  label: string; id: string; type?: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; icon: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all ${
            disabled
              ? "border-gold-500/8 opacity-50 cursor-not-allowed"
              : "border-gold-500/15 hover:border-gold-500/25"
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label, id, value, onChange, options, icon,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  options: string[]; icon: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none z-10">{icon}</span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all appearance-none cursor-pointer hover:border-gold-500/25"
        >
          <option value="" disabled>Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▾</span>
      </div>
    </div>
  );
}

type SectionKey = "personal" | "travel" | "preferences" | "security";

export default function ProfilePage() {
  const { user, setUser, isLoggedIn, setIsLoggedIn, logout, initials } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<UserProfile>({ ...user });
  const [activeSection, setActiveSection] = useState<SectionKey>("personal");

  const handleSignOut = () => {
    logout();
    router.push("/");
  };
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Keep state in sync with context when logged in
  useEffect(() => {
    if (isLoggedIn) {
      setForm({ ...user });
    }
  }, [user, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function update(field: keyof UserProfile) {
    return (v: string | boolean) => setForm((prev) => ({ ...prev, [field]: v }));
  }

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser(form);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const sections: { key: SectionKey; label: string; icon: string }[] = [
    { key: "personal",    label: "Personal Info",   icon: "👤" },
    { key: "travel",      label: "Travel Details",  icon: "✈️" },
    { key: "preferences", label: "Preferences",     icon: "⚙️" },
    { key: "security",    label: "Security",        icon: "🔒" },
  ];

  const displayInitials = form.firstName && form.lastName
    ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
    : form.email ? form.email[0].toUpperCase() : "?";

  return (
    <div className="pt-20 min-h-screen bg-navy-900">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 border-b border-gold-500/15 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-2xl shadow-xl shadow-gold-500/30">
                {displayInitials !== "?" ? displayInitials : "👤"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-navy-900" title="Online" />
            </div>
            <div className="flex-1">
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">
                {form.firstName || form.lastName
                  ? `${form.firstName} ${form.lastName}`.trim()
                  : "Your Profile"}
              </h1>
              <p className="text-slate-500 text-sm">{form.email || "No email set"}</p>
              {form.city && form.country && (
                <p className="text-slate-600 text-xs mt-1">📍 {form.city}, {form.country}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href="/my-bookings" className="px-5 py-2.5 rounded-full border border-gold-500/30 text-gold-400 text-sm font-semibold hover:bg-gold-500/10 transition-all">
                My Bookings
              </Link>
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 rounded-full border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 text-sm font-semibold transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar nav */}
          <aside className="lg:w-56 shrink-0">
            <nav className="glass rounded-2xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer w-full text-left ${
                    activeSection === s.key
                      ? "bg-gold-500/15 text-gold-400 border border-gold-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-gold-500/5"
                  }`}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </nav>

            {/* Quick stats */}
            <div className="glass rounded-2xl p-5 mt-4 space-y-3 hidden lg:block">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Account Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 text-sm font-semibold">Active</span>
              </div>
              <div className="text-slate-600 text-xs space-y-1.5 pt-1 border-t border-gold-500/10">
                <p>🏆 LuxeStay Gold Member</p>
                <p>✈️ Preferred Currency: {form.preferredCurrency}</p>
                <p>🌐 Language: {form.preferredLanguage}</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Success toast */}
            {saved && (
              <div className="mb-5 px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
                <span>✓</span> Profile saved successfully!
              </div>
            )}

            <div className="glass rounded-2xl p-6 md:p-8">
              {/* ── Personal Info ── */}
              {activeSection === "personal" && (
                <div>
                  <h2 className="text-white text-lg font-bold mb-1">Personal Information</h2>
                  <p className="text-slate-500 text-sm mb-7">Your name and contact details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field id="firstName" label="First Name" icon="👤" value={form.firstName} onChange={update("firstName")} placeholder="e.g. John" />
                    <Field id="lastName"  label="Last Name"  icon="👤" value={form.lastName}  onChange={update("lastName")}  placeholder="e.g. Doe" />
                    <Field id="email"     label="Email Address" icon="✉" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
                    <Field id="phone"     label="Phone Number"  icon="📞" type="tel"   value={form.phone} onChange={update("phone")} placeholder="+94 71 234 5678" />
                    <Field id="dob"       label="Date of Birth" icon="🎂" type="date"  value={form.dateOfBirth} onChange={update("dateOfBirth")} />
                    <SelectField id="country" label="Country" icon="🌍" value={form.country} onChange={update("country") as (v: string) => void} options={COUNTRIES} />
                    <Field id="city" label="City" icon="🏙" value={form.city} onChange={update("city")} placeholder="e.g. Colombo" />
                  </div>
                </div>
              )}

              {/* ── Travel Details ── */}
              {activeSection === "travel" && (
                <div>
                  <h2 className="text-white text-lg font-bold mb-1">Travel Details</h2>
                  <p className="text-slate-500 text-sm mb-7">Used to auto-fill booking forms</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SelectField id="nationality" label="Nationality" icon="🛂" value={form.nationality} onChange={update("nationality") as (v: string) => void} options={COUNTRIES} />
                    <Field id="passport" label="Passport Number" icon="📗" value={form.passportNumber} onChange={update("passportNumber")} placeholder="e.g. N1234567" />
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gold-500/5 border border-gold-500/15">
                    <p className="text-slate-400 text-xs leading-relaxed">🔒 Your passport details are encrypted and only used to pre-fill booking forms. We never share this data with third parties.</p>
                  </div>
                </div>
              )}

              {/* ── Preferences ── */}
              {activeSection === "preferences" && (
                <div>
                  <h2 className="text-white text-lg font-bold mb-1">Preferences</h2>
                  <p className="text-slate-500 text-sm mb-7">Customise your LuxeStay experience</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SelectField id="currency" label="Preferred Currency" icon="💱" value={form.preferredCurrency} onChange={update("preferredCurrency") as (v: string) => void} options={["LKR", "USD", "EUR", "GBP", "SGD", "AED", "AUD"]} />
                    <SelectField id="language" label="Preferred Language" icon="🌐" value={form.preferredLanguage} onChange={update("preferredLanguage") as (v: string) => void} options={LANGUAGES} />
                  </div>
                  <div className="mt-6 pt-6 border-t border-gold-500/10">
                    <label htmlFor="newsletter" className="flex items-start gap-4 cursor-pointer group">
                      <input
                        id="newsletter"
                        type="checkbox"
                        checked={form.newsletterOptIn}
                        onChange={(e) => update("newsletterOptIn")(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded accent-gold-500 cursor-pointer flex-shrink-0"
                      />
                      <div>
                        <p className="text-slate-200 text-sm font-semibold group-hover:text-white transition-colors">Email Newsletter</p>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Receive exclusive deals, new hotel arrivals, and personalised travel recommendations.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {activeSection === "security" && (
                <div>
                  <h2 className="text-white text-lg font-bold mb-1">Security</h2>
                  <p className="text-slate-500 text-sm mb-7">Manage your password and account access</p>
                  <div className="space-y-5">
                    <Field id="cur-password"  label="Current Password"  icon="🔒" type="password" value="" placeholder="Enter current password" />
                    <Field id="new-password"  label="New Password"      icon="🔑" type="password" value="" placeholder="Enter new password" />
                    <Field id="conf-password" label="Confirm Password"  icon="🔑" type="password" value="" placeholder="Repeat new password" />
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gold-500/5 border border-gold-500/15 space-y-2">
                    <p className="text-slate-400 text-sm font-semibold">Password Requirements</p>
                    <ul className="text-slate-500 text-xs space-y-1">
                      <li>○ At least 8 characters</li>
                      <li>○ One uppercase letter (A–Z)</li>
                      <li>○ One number (0–9)</li>
                      <li>○ One special character (!@#$...)</li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gold-500/10">
                    <p className="text-slate-400 text-sm font-semibold mb-3">Danger Zone</p>
                    <button className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 text-sm font-semibold hover:bg-red-500/15 transition-all cursor-pointer">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Save button */}
              {activeSection !== "security" && (
                <div className="mt-8 pt-6 border-t border-gold-500/10 flex justify-end">
                  <button
                    id="save-profile"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/25 hover:shadow-gold-500/45 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Saving…
                      </span>
                    ) : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
