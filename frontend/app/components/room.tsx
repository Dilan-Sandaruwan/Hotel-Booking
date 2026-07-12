"use client";

import React from "react";
import { Room } from "../data/hotels";

interface RoomDetailModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const [sliderIndex, setSliderIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sliderIndex === null || !room.images) return;
      if (e.key === "Escape") setSliderIndex(null);
      if (e.key === "ArrowLeft") {
        setSliderIndex((prev) => (prev! > 0 ? prev! - 1 : room.images!.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSliderIndex((prev) => (prev! < room.images!.length - 1 ? prev! + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sliderIndex, room.images]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4">
      <div className="bg-navy-900 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 relative animate-fade-in shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-xl"
        >
          ✕
        </button>

        {/* Room Header */}
        <div className="border-b border-gold-500/10 pb-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Room Details</span>
          <h3 className="text-white text-2xl font-bold font-display mt-1">{room.name}</h3>
        </div>

        {/* Room Attributes */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-[10px] font-semibold block">Bed Configuration</span>
            <span className="text-slate-200 font-bold text-xs whitespace-nowrap">🛏 {room.bedType}</span>
          </div>
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-[10px] font-semibold block">Max Capacity</span>
            <span className="text-slate-200 font-bold text-xs">👤 Up to {room.capacity} Guests</span>
          </div>
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-[10px] font-semibold block">Price Per Night</span>
            <span className="text-gold-500 font-black text-xs">LKR {room.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Room Images */}
        {room.images && room.images.length > 0 && (
          <div className="mb-6">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Room Photos:</span>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold-500/20">
              {room.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${room.name} view ${index + 1}`}
                  onClick={() => setSliderIndex(index)}
                  className="w-24 h-20 rounded-xl object-cover border border-gold-500/15 flex-shrink-0 cursor-pointer hover:border-gold-500/60 transition-all hover:scale-[1.02] duration-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Amenities List */}
        <div className="mb-6">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Amenities Included:</span>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-gold-500/5 border border-gold-500/15 text-slate-300 text-xs font-medium"
              >
                ✓ {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-4 border-t border-gold-500/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>

      {/* Lightbox / Image Slider Overlay */}
      {sliderIndex !== null && room.images && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setSliderIndex(null)}
            className="absolute top-6 right-6 text-white/75 hover:text-white transition-colors cursor-pointer text-2xl z-10"
          >
            ✕
          </button>

          {/* Slider Container */}
          <div className="relative max-w-4xl w-full flex items-center justify-center px-4">
            {/* Prev Button */}
            <button
              onClick={() => setSliderIndex((prev) => (prev! > 0 ? prev! - 1 : room.images!.length - 1))}
              className="absolute left-2 md:-left-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/15 z-10"
            >
              ◀
            </button>

            {/* Big Image */}
            <img
              src={room.images[sliderIndex]}
              alt=""
              className="max-h-[75vh] max-w-full rounded-2xl object-contain border border-gold-500/20 shadow-2xl select-none"
            />

            {/* Next Button */}
            <button
              onClick={() => setSliderIndex((prev) => (prev! < room.images!.length - 1 ? prev! + 1 : 0))}
              className="absolute right-2 md:-right-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/15 z-10"
            >
              ▶
            </button>
          </div>

          {/* Dots / Indicator */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-white/60 text-sm font-semibold tracking-widest uppercase">
              {sliderIndex + 1} / {room.images.length}
            </span>
            <div className="flex gap-2">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSliderIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    sliderIndex === i ? "bg-gold-500 scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
