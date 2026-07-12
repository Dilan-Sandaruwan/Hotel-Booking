"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { initials, isLoggedIn } = useUser();
  const pathname = usePathname();
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"login" | "signup" | null>(null);
  const [hotels, setHotels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setIsOwnerLoggedIn(localStorage.getItem("ownerLoggedIn") === "true");
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHotels(data.map((h: any) => ({ id: h.id, name: h.property_name })));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/owners/dashboard" || pathname?.startsWith("/owners/dashboard")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/90 backdrop-blur-xl border-b border-gold-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center font-black text-navy-900 text-lg shadow-lg shadow-gold-500/40">
              L
            </div>
            <span className="font-display font-bold text-xl text-gold-gradient">
              LuxeStay
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 font-medium text-sm transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 nav-dropdown-container">
            {(!isLoggedIn && !isOwnerLoggedIn) ? (
              <>
                {/* Log In Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "login" ? null : "login")}
                    className="px-4 py-2 rounded-full text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 font-medium text-sm transition-all duration-200 cursor-pointer flex items-center gap-1"
                  >
                    Log In <span className="text-[9px] transition-transform duration-200 select-none">{activeDropdown === "login" ? "▲" : "▼"}</span>
                  </button>
                  {activeDropdown === "login" && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-gold-500/20 py-2 shadow-2xl z-50 animate-fade-in">
                      <Link
                        href="/login"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 transition-all font-medium"
                      >
                        👤 User Login
                      </Link>
                      <Link
                        href="/owners/login"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 transition-all font-medium"
                      >
                        🏨 Owner Login
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sign Up Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "signup" ? null : "signup")}
                    className="px-5 py-2.5 rounded-full border border-gold-500 text-gold-400 font-semibold text-sm hover:bg-gold-500/10 transition-all duration-200 cursor-pointer flex items-center gap-1"
                  >
                    Sign Up <span className="text-[9px] transition-transform duration-200 select-none">{activeDropdown === "signup" ? "▲" : "▼"}</span>
                  </button>
                  {activeDropdown === "signup" && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-gold-500/20 py-2 shadow-2xl z-50 animate-fade-in">
                      <Link
                        href="/signup"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 transition-all font-medium"
                      >
                        👤 User Signup
                      </Link>
                      <Link
                        href="/owners/signup"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 transition-all font-medium"
                      >
                        🏨 Owner Signup
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : isLoggedIn ? (
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-sm shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5 transition-all"
                title="Profile"
              >
                {initials !== "?" ? initials : "👤"}
              </Link>
            ) : (
              <Link
                href="/owners/dashboard"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-sm shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5 transition-all"
                title="Owner Dashboard"
              >
                💼
              </Link>
            )}
            <Link
              href="/hotels"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/30 hover:shadow-gold-500/55 hover:-translate-y-0.5 transition-all duration-200"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2 border border-gold-500/40 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block w-5 h-0.5 bg-gold-500 rounded transition-all duration-300 ${
                  menuOpen
                    ? i === 0
                      ? "rotate-45 translate-y-1.5"
                      : i === 2
                      ? "-rotate-45 -translate-y-1.5"
                      : "scale-x-0"
                    : ""
                }`}
              />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="glass animate-slide-down mb-4 p-4 flex flex-col gap-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-slate-300 hover:text-gold-400 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gold-500/15 pt-3 flex flex-col gap-3">
              {(!isLoggedIn && !isOwnerLoggedIn) ? (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500/70 px-4">User Portal</div>
                    <div className="flex gap-2">
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full text-slate-300 hover:text-gold-400 font-semibold text-xs border border-gold-500/20 hover:bg-gold-500/10 transition-all">
                        Log In
                      </Link>
                      <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border border-gold-500 text-gold-400 font-semibold text-xs hover:bg-gold-500/10 transition-all">
                        Sign Up
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500/70 px-4">Owner Portal</div>
                    <div className="flex gap-2">
                      <Link href="/owners/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full text-slate-300 hover:text-gold-400 font-semibold text-xs border border-gold-500/20 hover:bg-gold-500/10 transition-all">
                        Log In
                      </Link>
                      <Link href="/owners/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border border-gold-500 text-gold-400 font-semibold text-xs hover:bg-gold-500/10 transition-all">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </>
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500/70 px-4">Profile</div>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-gold-400 hover:bg-gold-500/5 transition-all text-sm font-semibold flex items-center gap-2">
                    <span>👤</span> View Profile
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500/70 px-4">Owner Dashboard</div>
                  <Link href="/owners/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-gold-400 hover:bg-gold-500/5 transition-all text-sm font-semibold flex items-center gap-2">
                    <span>💼</span> Open Dashboard
                  </Link>
                </div>
              )}

              <div className="border-t border-gold-500/15 pt-3 flex gap-2">
                <Link href="/hotels" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
