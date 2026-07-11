"use client";

import React from "react";
import { Room } from "../data/hotels";

interface RoomDetailModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-xs font-semibold block">Bed Configuration</span>
            <span className="text-slate-200 font-bold text-sm">🛏 {room.bedType}</span>
          </div>
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-xs font-semibold block">Room Size</span>
            <span className="text-slate-200 font-bold text-sm">📐 {room.size}</span>
          </div>
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-xs font-semibold block">Max Capacity</span>
            <span className="text-slate-200 font-bold text-sm">👤 Up to {room.capacity} Guests</span>
          </div>
          <div className="bg-navy-800/40 p-3 rounded-xl border border-gold-500/5">
            <span className="text-slate-500 text-xs font-semibold block">Price Per Night</span>
            <span className="text-gold-500 font-black text-sm">LKR {room.price.toLocaleString()}</span>
          </div>
        </div>

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
    </div>
  );
}
