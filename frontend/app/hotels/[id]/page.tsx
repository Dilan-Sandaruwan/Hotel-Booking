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
      const h = getHotelById(id);
      setHotel(h);
      setLoading(false);
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
