"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HERO_STATS = [
  { value: "2,500+", label: "Luxury Hotels" },
  { value: "120+", label: "Countries" },
  { value: "1M+", label: "Happy Guests" },
  { value: "4.9★", label: "Avg Rating" },
];

export default function Header() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData as Record<string, string>);
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-[#1a2744]">

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float-y absolute -top-20 -left-20 w-96 h-96 rounded-full bg-radial from-gold-500/25 to-transparent opacity-20" />
        <div className="animate-float-y delay-300 absolute bottom-0 -right-16 w-80 h-80 rounded-full bg-radial from-gold-500/20 to-transparent opacity-15" />
        <div className="animate-float-y delay-500 absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-radial from-gold-500/15 to-transparent opacity-10" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,168,83,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.05) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 text-center">

        {/* Badge */}
        <div className="animate-fade-in-up mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-500/15 text-gold-400 border border-gold-500/30">
            ✦ Exclusive Luxury Experiences
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100 mb-5 text-white font-display">
          Find Your{" "}
          <span className="text-gold-gradient">Perfect</span>
          <br />Hotel Stay
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Discover world-class hotels at unbeatable prices. From boutique gems to
          iconic five-star resorts — your dream stay is one search away.
        </p>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="glass animate-fade-in-up delay-300 max-w-4xl mx-auto p-6 mb-16 text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">

            {/* Destination */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">
                📍 Destination
              </label>
              <input
                type="text"
                placeholder="City or hotel..."
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            {/* Check In */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">🗓 Check In</label>
              <input
                type="date"
                value={searchData.checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">🗓 Check Out</label>
              <input
                type="date"
                value={searchData.checkOut}
                min={searchData.checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">👤 Guests</label>
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark] appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">🏨 Rooms</label>
              <select
                value={searchData.rooms}
                onChange={(e) => setSearchData({ ...searchData, rooms: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark] appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-base shadow-xl shadow-gold-500/35 hover:shadow-gold-500/55 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            🔍 Search Hotels
          </button>
        </form>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 px-3 rounded-xl bg-gold-500/6 border border-gold-500/15"
            >
              <div className="text-2xl md:text-3xl font-black font-display text-gold-500 leading-none">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs">
        <span>Scroll to explore</span>
        <div className="animate-float-y w-6 h-10 border-2 border-gold-500/35 rounded-xl flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gold-500 rounded-sm" />
        </div>
      </div>
    </header>
  );
}
