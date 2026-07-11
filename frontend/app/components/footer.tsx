"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Cancellation Policy", "Safety Info", "Accessibility"],
  Destinations: ["Paris", "New York", "Dubai", "Tokyo", "London", "Bali"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"],
};

const SOCIALS = [
  { label: "Twitter", icon: "𝕏", href: "#" },
  { label: "Instagram", icon: "📷", href: "#" },
  { label: "Facebook", icon: "f", href: "#" },
  { label: "YouTube", icon: "▶", href: "#" },
];

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname === "/owners/dashboard" || pathname?.startsWith("/owners/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-navy-950 border-t border-gold-500/15 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-lg">
                L
              </div>
              <span className="font-display font-bold text-xl text-gold-gradient">LuxeStay</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Curating the world&rsquo;s finest hotels for discerning travellers since 2018.
              Your luxury, our passion.
            </p>

            {/* Newsletter */}
            <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-3">
              Exclusive Deals
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email..."
                className="flex-1 px-4 py-2.5 bg-navy-900/60 border border-gold-500/20 rounded-full text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
              <button className="px-4 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shrink-0 hover:shadow-lg hover:shadow-gold-500/30 transition-all">
                →
              </button>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-slate-600 text-sm hover:text-gold-400 transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-slate-700 text-sm">
            © {year} LuxeStay. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-gold-500/25 flex items-center justify-center text-slate-600 text-sm font-bold hover:text-gold-400 hover:border-gold-500 hover:bg-gold-500/10 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Payment badges */}
          <div className="flex gap-2 items-center">
            {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 bg-white/4 border border-white/8 rounded text-slate-700 text-xs font-bold tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
