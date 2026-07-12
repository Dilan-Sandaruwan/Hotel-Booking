"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HOTELS } from "../data/hotels";

type Category = "all" | "luxury" | "boutique" | "resort" | "business";
type SortKey = "price-asc" | "price-desc" | "rating" | "name";

function StarRating({ count }: { count: number }) {
  return <span className="text-gold-500">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

export default function HotelsPage() {
  const [mounted, setMounted] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minStars, setMinStars] = useState(0);
  const [sort, setSort] = useState<SortKey>("rating");

  useEffect(() => {
    setMounted(true);
    fetch("http://localhost:5000/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((h: any) => ({
          id: h.id,
          name: h.property_name,
          location: h.city,
          country: h.country,
          description: h.short_description,
          longDescription: h.long_description,
          stars: h.stars,
          rating: 5.0,
          reviewCount: 1,
          price: parseFloat(h.starting_price_per_night),
          imageUrl: h.image_url,
          gallery: [h.image_url],
          amenities: h.amenities,
          category: h.category.toLowerCase(),
          rooms: (h.rooms || []).map((r: any) => ({
            id: r.id,
            name: r.room_name,
            bedType: r.bed_type,
            price: parseFloat(r.price_per_night),
            amenities: [...r.features, ...r.extra_features],
            images: r.image_urls || [],
            mode: r.mode || "active",
            capacity: r.max_person_count || 2,
          })),
        }));
        setHotels(mapped);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = useMemo(() => {
    if (!mounted) return [];
    let list = hotels.filter((h) => {
      const q = search.toLowerCase();
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q);
      const matchCat = category === "all" || h.category === category;
      const matchPrice = h.price <= maxPrice;
      const matchStars = h.stars >= minStars;
      return matchSearch && matchCat && matchPrice && matchStars;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [search, category, maxPrice, minStars, sort]);

  const CATEGORIES: { label: string; value: Category }[] = [
    { label: "All", value: "all" },
    { label: "Luxury", value: "luxury" },
    { label: "Boutique", value: "boutique" },
    { label: "Resort", value: "resort" },
    { label: "Business", value: "business" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-navy-900">

      {/* Page Hero */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 border-b border-gold-500/15 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h1 className="text-white mb-2 animate-fade-in-up">
            Find Your <span className="text-gold-gradient">Hotel</span>
          </h1>
          <p className="text-slate-500 text-lg animate-fade-in-up delay-100">
            {filtered.length} luxury properties available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0 animate-fade-in">
            <div className="glass p-6 lg:sticky lg:top-24">
              <h3 className="text-slate-100 text-lg font-semibold mb-6">🔍 Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Hotel or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-3">Category</label>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`px-4 py-2.5 rounded-xl border text-sm text-left font-medium transition-all duration-200 cursor-pointer ${
                        category === c.value
                          ? "border-gold-500 bg-gold-500/12 text-gold-400 font-semibold"
                          : "border-gold-500/15 text-slate-500 hover:border-gold-500/35 hover:text-slate-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">
                  Max Price: <span className="text-gold-500">LKR {maxPrice.toLocaleString()}</span>/night
                </label>
                <input
                  type="range" min={1000} max={50000} step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full accent-gold-500"
                />
                <div className="flex justify-between text-slate-600 text-xs mt-1">
                  <span>LKR 1,000</span><span>LKR 50,000</span>
                </div>
              </div>

              {/* Min Stars */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-3">Min Stars</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setMinStars(s)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        minStars === s
                          ? "border-gold-500 bg-gold-500/12 text-gold-400"
                          : "border-gold-500/20 text-slate-500 hover:border-gold-500/40"
                      }`}
                    >
                      {s === 0 ? "Any" : `${s}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setSearch(""); setCategory("all"); setMaxPrice(50000); setMinStars(0); }}
                className="w-full py-2.5 rounded-full border border-gold-500 text-gold-400 text-sm font-semibold hover:bg-gold-500/10 transition-all duration-200 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* ── Results ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <span className="text-slate-500 text-sm">
                <strong className="text-gold-500">{filtered.length}</strong> hotels found
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 text-sm">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="px-3 py-2 bg-navy-800/60 border border-gold-500/20 rounded-xl text-slate-200 text-sm outline-none focus:border-gold-500 [color-scheme:dark] cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="glass p-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-slate-100 mb-2">No hotels found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {filtered.map((hotel) => (
                  <Link href={`/hotels/${hotel.id}`} key={hotel.id} className="no-underline group block">
                    <div className="hotel-card rounded-2xl overflow-hidden bg-navy-800/70 border border-gold-500/12 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">

                      <div className="relative overflow-hidden h-52 shrink-0">
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="hotel-card-img"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}x/800/500`; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          {hotel.featured && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/35">⭐ Featured</span>}
                          {hotel.discount && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/35">-{hotel.discount}%</span>}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-950/70 text-slate-300 capitalize">{hotel.category}</span>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-slate-100 text-sm font-semibold font-display leading-snug flex-1 mr-2">{hotel.name}</h3>
                          <StarRating count={hotel.stars} />
                        </div>
                        <p className="text-slate-500 text-xs mb-2">📍 {hotel.location}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-xs font-bold">{hotel.rating}</span>
                          <span className="text-slate-600 text-xs">({hotel.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{hotel.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            {hotel.originalPrice && (
                              <span className="block text-slate-600 text-xs line-through">LKR {hotel.originalPrice}</span>
                            )}
                            <span className="text-gold-500 text-xl font-black">LKR {hotel.price}</span>
                            <span className="text-slate-500 text-xs ml-1">/night</span>
                          </div>
                          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 text-xs font-bold shadow-lg shadow-gold-500/25 group-hover:-translate-y-0.5 transition-all duration-200">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
