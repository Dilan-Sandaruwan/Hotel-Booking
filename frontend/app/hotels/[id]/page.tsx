"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import HotelDetail from "../../pages/hotel-detail";
import { getHotelById } from "../../data/hotels";

export default function HotelPage() {
  const params = useParams();
  const id = params?.id as string;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/hotels/${id}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("Hotel not found");
          return res.json();
        })
        .then((h) => {
          const mapped: any = {
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
          };
          setHotel(mapped);
          setLoading(false);
        })
        .catch(() => {
          setHotel(null);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    notFound();
  }

  return <HotelDetail hotel={hotel} />;
}
