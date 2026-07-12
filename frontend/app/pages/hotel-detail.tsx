"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hotel, Room } from "../data/hotels";
import RoomDetailModal from "../components/room";

interface Props { hotel: Hotel; }

export default function HotelDetail({ hotel }: Props) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms?.find((r) => r.mode !== "maintenance")?.id || hotel.rooms?.[0]?.id || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [modalRoom, setModalRoom] = useState<Room | null>(null);

  const room = hotel.rooms?.find((r) => r.id === selectedRoom) ?? hotel.rooms?.[0];

  React.useEffect(() => {
    if (room && guests > room.capacity) {
      setGuests(room.capacity);
    }
  }, [room, guests]);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  })();

  const total = room ? room.price * Math.max(1, nights) : 0;

  const handleBook = () => {
    if (!room || room.mode === "maintenance") return;
    const params = new URLSearchParams({
      hotelId: hotel.id, roomId: selectedRoom, checkIn, checkOut,
      guests: guests.toString(), nights: nights.toString(), total: total.toString(),
    });
    router.push(`/booking?${params.toString()}`);
  };

  const inputCls = "w-full px-4 py-3 bg-navy-900/60 border border-gold-500/20 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark]";

  return (
    <div className="pt-20 min-h-screen bg-navy-900">

      {/* Breadcrumb */}
      <div className="bg-navy-950 border-b border-gold-500/10 py-3">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-2 text-slate-600 text-sm">
          <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/hotels" className="hover:text-gold-400 transition-colors">Hotels</Link>
          <span>›</span>
          <span className="text-slate-400">{hotel.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col xl:flex-row gap-10">

          {/* Left Column */}
          <div className="flex-1 min-w-0">

            {/* Gallery */}
            <div className="mb-8">
              <div className="relative rounded-2xl overflow-hidden h-96 md:h-[440px] mb-3">
                <img
                  src={hotel.gallery[activeImg] ?? hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-opacity duration-400"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}gal/1200/700`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/35 text-xs font-semibold">
                    {"★".repeat(hotel.stars)} {hotel.stars}-Star
                  </span>
                  {hotel.discount && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 text-xs font-semibold">
                      -{hotel.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {hotel.gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImg === i ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}${i}/400/300`; }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel Info */}
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                <h1 className="text-white text-3xl md:text-4xl">{hotel.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-lg">⭐ {hotel.rating}</span>
                  <span className="text-slate-500 text-sm">({hotel.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
              <p className="text-slate-500 text-base mb-6">📍 {hotel.location}</p>

              <div className="divider-gold" />

              <h2 className="text-slate-100 text-xl mb-4">About This Hotel</h2>
              <p className="text-slate-400 leading-relaxed mb-8">{hotel.longDescription}</p>

              {/* Amenities */}
              <h2 className="text-slate-100 text-xl mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {hotel.amenities.map((a) => (
                  <span key={a} className="px-4 py-1.5 bg-gold-500/8 border border-gold-500/20 rounded-full text-slate-400 text-sm">
                    {a}
                  </span>
                ))}
              </div>

              <div className="divider-gold" />

              {/* Room Selection */}
              <h2 className="text-slate-100 text-xl mb-5">Choose Your Room</h2>
              <div className="flex flex-col gap-4">
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  hotel.rooms.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoom(r.id)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-250 cursor-pointer ${
                        r.mode === "maintenance"
                          ? selectedRoom === r.id
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-amber-500/25 bg-amber-500/5 opacity-80"
                          : selectedRoom === r.id
                          ? "border-gold-500 bg-gold-500/7"
                          : "border-gold-500/15 bg-navy-800/50 hover:border-gold-500/35"
                      }`}
                    >
                      <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                        <div>
                          <h3 className={`text-base font-semibold mb-1 flex items-center gap-2 ${
                            r.mode === "maintenance"
                              ? "text-amber-500"
                              : selectedRoom === r.id
                              ? "text-gold-400"
                              : "text-slate-100"
                          }`}>
                            {r.name}
                            {r.mode === "maintenance" && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/35 text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">
                                Maintenance
                              </span>
                            )}
                          </h3>
                          <p className="text-slate-500 text-sm">🛏 {r.bedType} · 📐 {r.size} · 👤 Up to {r.capacity} guests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-gold-500 text-2xl font-black">LKR {r.price}</div>
                          <div className="text-slate-500 text-xs">per night</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gold-500/10">
                        <div className="flex flex-wrap gap-2">
                          {r.amenities.map((a) => (
                            <span key={a} className="px-2.5 py-0.5 bg-gold-500/8 border border-gold-500/15 rounded-full text-slate-500 text-xs">
                              {a}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(r.id);
                            setModalRoom(r);
                            setIsRoomModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass p-12 text-center text-slate-500 rounded-2xl">
                    <div className="text-3xl mb-2">🛏</div>
                    <p className="font-semibold text-slate-400">No rooms available for this property yet.</p>
                    <p className="text-xs text-slate-655 mt-1">Please check back later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="w-full xl:w-96 shrink-0">
            <div className="glass p-6 xl:sticky xl:top-24 animate-fade-in">
              <h3 className="text-slate-100 text-lg font-semibold mb-1">Book Your Stay</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-gold-500 text-3xl font-black">
                  {room ? `LKR ${room.price.toLocaleString()}` : "N/A"}
                </span>
                {room && <span className="text-slate-500 text-sm">/ night</span>}
              </div>

              <div className="flex flex-col gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Check In</label>
                  <input type="date" value={checkIn} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)} className={inputCls} disabled={!room} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Check Out</label>
                  <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)} className={inputCls} disabled={!room} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(+e.target.value)} className={`${inputCls} cursor-pointer appearance-none`} disabled={!room}>
                    {room ? (
                      Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                      ))
                    ) : (
                      <option value="1">1 Guest</option>
                    )}
                  </select>
                </div>
              </div>

              {nights > 0 && room && (
                <div className="animate-fade-in bg-gold-500/6 border border-gold-500/15 rounded-xl p-4 mb-5">
                  <div className="flex justify-between text-slate-400 text-sm mb-2">
                    <span>LKR {room.price} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>LKR {room.price * nights}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm mb-3">
                    <span>Taxes & fees (12%)</span>
                    <span>LKR {Math.round(room.price * nights * 0.12)}</span>
                  </div>
                  <div className="divider-gold !my-2" />
                  <div className="flex justify-between text-slate-100 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gold-500">LKR {Math.round(total * 1.12)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={!room || !checkIn || !checkOut || nights <= 0 || room.mode === "maintenance"}
                className={`w-full py-4 rounded-full font-bold text-base shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer ${
                  room?.mode === "maintenance"
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-amber-500/20"
                    : "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-0.5"
                }`}
              >
                {!room
                  ? "No Rooms Available"
                  : room.mode === "maintenance"
                  ? "Under Maintenance"
                  : !checkIn || !checkOut
                  ? "Select Dates to Book"
                  : `Reserve — LKR ${Math.round(total * 1.12)}`}
              </button>

              <p className="text-slate-600 text-xs text-center mt-3">
                🔒 Free cancellation · No payment now
              </p>
            </div>
          </div>
        </div>
      </div>
      {modalRoom && (
        <RoomDetailModal
          room={modalRoom}
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
        />
      )}
    </div>
  );
}
