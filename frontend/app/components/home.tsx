"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HOTELS } from "../data/hotels";

const AMENITIES = [
  { icon: "🏊", title: "Pool & Spa", desc: "World-class pools and rejuvenating spa treatments." },
  { icon: "🍽️", title: "Fine Dining", desc: "Michelin-starred restaurants and exclusive culinary journeys." },
  { icon: "🛎️", title: "Concierge 24/7", desc: "Dedicated personal concierge service around the clock." },
  { icon: "🧹", title: "Daily Housekeeping", desc: "Impeccable cleaning and fresh linen every day." },
  { icon: "🚗", title: "Valet Parking", desc: "Complimentary valet service for every guest." },
  { icon: "📶", title: "Ultra-fast WiFi", desc: "Blazing-fast internet throughout the entire property." },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "New York, USA",
    text: "LuxeStay made finding a 5-star hotel effortless. The booking process was smooth and our room exceeded all expectations!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James K.",
    location: "London, UK",
    text: "Incredible selection of hotels across Europe. I found a hidden gem in Paris at an unbeatable price. Highly recommended!",
    rating: 5,
    avatar: "JK",
  },
  {
    name: "Priya R.",
    location: "Mumbai, India",
    text: "The concierge feature is amazing. My requests were handled before I even arrived at the property. Pure luxury!",
    rating: 5,
    avatar: "PR",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-gold-500 tracking-wide">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch("http://localhost:5000/api/hotels", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          setHotels(HOTELS);
          return;
        }
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
          price: parseFloat(h.starting_price_per_night) || 0,
          imageUrl: h.image_url || "",
          gallery: h.image_url ? [h.image_url] : [],
          amenities: h.amenities || [],
          category: (h.category || "luxury").toLowerCase(),
          rooms: (h.rooms || []).map((r: any) => ({
            id: r.id,
            name: r.room_name || "",
            bedType: r.bed_type || "",
            price: parseFloat(r.price_per_night) || 0,
            amenities: [...(r.features || []), ...(r.extra_features || [])],
            images: r.image_urls || [],
            mode: r.mode || "active",
            capacity: r.max_person_count || 2,
          })),
        }));
        setHotels(mapped);
      })
      .catch((err) => {
        console.error("API error, falling back to mock hotels data:", err);
        setHotels(HOTELS);
      });
  }, []);

  const featured = mounted ? hotels : [];

  return (
    <>
      {/* ── Featured Hotels ─────────────────────── */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-white mb-4">
              Featured <span className="text-gold-gradient">Hotels</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Handpicked luxury properties across the globe, curated for the most discerning travellers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 animate-fade-in-up delay-200">
            {featured.map((hotel) => (
              <Link href={`/hotels/${hotel.id}`} key={hotel.id} className="no-underline group block">
                <div className="hotel-card rounded-2xl overflow-hidden bg-navy-800/70 border border-gold-500/12 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-2xl transition-all duration-300 cursor-pointer">

                  {/* Image */}
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="hotel-card-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}/800/500`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {hotel.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/35">
                          ⭐ Featured
                        </span>
                      )}
                      {hotel.discount && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/35">
                          -{hotel.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-slate-100 text-base font-semibold font-display leading-snug mr-2">
                        {hotel.name}
                      </h3>
                      <StarRating count={hotel.stars} />
                    </div>
                    <p className="text-slate-500 text-sm mb-3 flex items-center gap-1.5">
                      📍 {hotel.location}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Amenity tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {hotel.amenities.slice(0, 3).map((a: string) => (
                        <span
                          key={a}
                          className="px-2.5 py-0.5 bg-gold-500/8 border border-gold-500/20 rounded-full text-xs text-slate-400"
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        {hotel.originalPrice && (
                          <span className="block text-slate-600 text-xs line-through">
                            LKR {hotel.originalPrice}/night
                          </span>
                        )}
                        <span className="text-gold-500 text-2xl font-black">LKR {hotel.price}</span>
                        <span className="text-slate-500 text-xs ml-1">/night</span>
                      </div>
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 text-sm font-bold shadow-lg shadow-gold-500/25 hover:shadow-gold-500/45 group-hover:-translate-y-0.5 transition-all duration-200">
                        Book Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/hotels"
              className="inline-block px-10 py-3.5 rounded-full border border-gold-500 text-gold-400 font-semibold hover:bg-gold-500/12 hover:-translate-y-0.5 transition-all duration-200"
            >
              View All Hotels →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why LuxeStay ────────────────────────── */}
      <section className="py-20 bg-navy-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-white mb-4">
              The <span className="text-gold-gradient">LuxeStay</span> Experience
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every amenity crafted to perfection — because you deserve nothing less.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES.map((item, i) => (
              <div
                key={item.title}
                className={`glass p-8 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-fade-in-up delay-${(i % 4) * 100 + 100}`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-slate-100 text-lg font-semibold mb-2.5">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────── */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-white mb-4">
              What Our <span className="text-gold-gradient">Guests</span> Say
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Join over 1 million satisfied guests who&apos;ve trusted LuxeStay for their dream getaways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`glass p-8 animate-fade-in-up delay-${i * 100 + 100}`}
              >
                <div className="mb-4">
                  <StarRating count={t.rating} />
                </div>
                <p className="text-slate-300 text-sm leading-loose italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-slate-100 font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-gold-500/12 via-gold-500/5 to-gold-500/12 border-y border-gold-500/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-white mb-4 animate-fade-in-up">
            Ready to Book Your <span className="text-gold-gradient">Dream Stay?</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10 animate-fade-in-up delay-100">
            Exclusive member rates, free cancellation on select bookings, and 24/7 expert support.
          </p>
          <Link
            href="/hotels"
            className="animate-fade-in-up delay-200 animate-pulse-gold inline-block px-12 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-lg shadow-2xl shadow-gold-500/35 hover:shadow-gold-500/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            Explore Hotels →
          </Link>
        </div>
      </section>
    </>
  );
}
