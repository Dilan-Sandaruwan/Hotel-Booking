"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import OwnerProfile from "./OwnerProfile";
import { HOTELS, addHotel } from "../data/hotels";

const AMENITIES_BY_CATEGORY = {
  "Most Popular Facilities": [
    "Indoor swimming pool", "Free WiFi", "Family rooms", "Free parking",
    "Restaurant", "Non-smoking rooms", "Room service", "Tea/coffee maker in all rooms", "Superb breakfast"
  ],
  "Room & Bath": [
    "Private bathroom", "Balcony", "Air conditioning", "Sea view",
    "Toilet paper", "Towels", "Bath or shower", "Toilet", "Free toiletries", "Linen"
  ],
  "Kitchen & Dining": [
    "Electric kettle", "Refrigerator", "Special diet menus (on request)"
  ],
  "Activities": [
    "Bicycle rental", "Beach", "Snorkelling", "Diving", "Windsurfing", "Fishing"
  ],
  "Services & Safety": [
    "Wake-up service", "CCTV outside property", "CCTV in common areas", "Designated smoking area", "Mosquito net", "Fan", "Board games/puzzles"
  ]
};

export default function OwnersDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [hotels, setHotels] = useState<any[]>([]);

  // Form State
  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelLoc, setNewHotelLoc] = useState("");
  const [newHotelCountry, setNewHotelCountry] = useState("");
  const [newHotelDesc, setNewHotelDesc] = useState("");
  const [newHotelLongDesc, setNewHotelLongDesc] = useState("");
  const [newHotelStars, setNewHotelStars] = useState("5");
  const [newHotelPrice, setNewHotelPrice] = useState("15000");
  const [newHotelImgUrl, setNewHotelImgUrl] = useState("");
  const [newHotelCategory, setNewHotelCategory] = useState("luxury");
  const [newHotelRooms, setNewHotelRooms] = useState("10");

  // Rooms State
  const [roomsList, setRoomsList] = useState<any[]>([]);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomType, setNewRoomType] = useState("single");

  useEffect(() => {
    // Check auth
    const auth = localStorage.getItem("ownerLoggedIn");
    if (!auth) {
      router.push("/owners/login");
    }
    // Load hotels from DB/localStorage
    setHotels([...HOTELS]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ownerLoggedIn");
    router.push("/");
  };

  const handleAddRoom = (room: any) => {
    setRoomsList([...roomsList, room]);
  };

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelLoc || !newHotelCountry || !newHotelPrice) return;

    const newHotelId = `H-${Math.floor(100 + Math.random() * 900)}`;
    const newPriceVal = parseFloat(newHotelPrice) || 10000;

    // Create new Hotel matching exactly the schema required by getHotelById and homepage
    const newHotelObj = {
      id: newHotelId,
      name: newHotelName,
      location: newHotelLoc,
      country: newHotelCountry,
      description: newHotelDesc,
      longDescription: newHotelLongDesc,
      stars: parseInt(newHotelStars) || 5,
      rating: 5.0,
      reviewCount: 1,
      price: newPriceVal,
      imageUrl: newHotelImgUrl || "https://picsum.photos/seed/resort/600/400",
      gallery: [newHotelImgUrl || "https://picsum.photos/seed/resort/600/400"],
      amenities: ["Free WiFi", "Free parking", "Restaurant", "Non-smoking rooms", "Room service"],
      featured: true,
      category: newHotelCategory as any,
      rooms: roomsList.length > 0 ? roomsList.map((r, index) => ({
        id: `r-${newHotelId}-${index + 1}`,
        name: r.name,
        capacity: r.capacity,
        bedType: r.bedType,
        price: r.price,
        size: r.size,
        amenities: r.amenities,
      })) : [
        {
          id: `r-${newHotelId}-1`,
          name: "Standard Room",
          capacity: 2,
          bedType: "Double Bed",
          price: newPriceVal,
          size: "35 m²",
          amenities: ["Attach Bathroom", "TV", "Free WiFi"],
        }
      ],
      // Dashboard UI helper properties
      status: "Active" as const, // Pending approval part removed
      revenue: 0,
      bookings: 0,
      roomsCount: roomsList.length > 0 ? roomsList.length : parseInt(newHotelRooms) || 10,
    };

    // Save to localStorage & database module
    addHotel(newHotelObj);

    // Sync state
    setHotels([...HOTELS]);

    // Reset Form
    setNewHotelName("");
    setNewHotelLoc("");
    setNewHotelCountry("");
    setNewHotelDesc("");
    setNewHotelLongDesc("");
    setNewHotelStars("5");
    setNewHotelPrice("15000");
    setNewHotelImgUrl("");
    setNewHotelCategory("luxury");
    setNewHotelRooms("10");
    setRoomsList([]);

    setActiveTab("overview"); // Redirect back to overview after adding
  };

  const totalRevenue = hotels.reduce((sum, h) => sum + (h.revenue || 0), 0);
  const activeListings = hotels.filter((h) => h.status === "Active").length;
  const totalBookings = hotels.reduce((sum, h) => sum + (h.bookings || 0), 0);
  const totalViews = totalBookings * 15;

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        hotelsCount={hotels.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 lg:p-10 min-h-screen overflow-y-auto">

        {/* Render Overview Tab */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-10 pb-6 border-b border-gold-500/10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Real-time performance metrics and properties</p>
              </div>
              <button
                onClick={() => setActiveTab("add-hotel")}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                + List New Hotel
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: "Total Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, change: totalRevenue > 0 ? "+14.2% this month" : "No revenue yet", icon: "💰" },
                { title: "Active Listings", value: `${activeListings}`, change: activeListings > 0 ? "All properties verified" : "No active listings", icon: "🏢" },
                { title: "Total Bookings", value: `${totalBookings} Stay${totalBookings !== 1 ? "s" : ""}`, change: totalBookings > 0 ? "Tracking reservations" : "No bookings yet", icon: "📅" },
                { title: "Total Views", value: `${totalViews} View${totalViews !== 1 ? "s" : ""}`, change: totalViews > 0 ? "Page traffic active" : "No page views", icon: "👁️" }
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-emerald-400 text-xs font-semibold">{stat.change}</span>
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">{stat.title}</p>
                  <h3 className="text-white font-black text-2xl mt-1 font-display">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Hotels List */}
            <div className="glass p-6 md:p-8 rounded-2xl">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span>🏢</span> My Registered Hotels
              </h2>

              {hotels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🏢</div>
                  <p className="text-slate-400 font-medium">No registered hotels found.</p>
                  <p className="text-slate-600 text-xs mt-1">Get started by clicking the "+ List New Hotel" button above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gold-500/10 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <th className="py-4 px-3">Hotel ID</th>
                        <th className="py-4 px-3">Hotel Name</th>
                        <th className="py-4 px-3">Location</th>
                        <th className="py-4 px-3">Total Rooms</th>
                        <th className="py-4 px-3">Monthly Bookings</th>
                        <th className="py-4 px-3">Revenue Generated</th>
                        <th className="py-4 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/5 text-sm">
                      {hotels.map((hotel) => (
                        <tr key={hotel.id} className="hover:bg-gold-500/2 transition-colors">
                          <td className="py-4 px-3 font-mono text-gold-400 font-semibold">{hotel.id}</td>
                          <td className="py-4 px-3 font-bold text-white">{hotel.name}</td>
                          <td className="py-4 px-3 text-slate-400">📍 {hotel.location}</td>
                          <td className="py-4 px-3 text-slate-300 font-medium">{hotel.roomsCount || 10} Rooms</td>
                          <td className="py-4 px-3 text-slate-300 font-medium">{hotel.bookings || 0} Bookings</td>
                          <td className="py-4 px-3 text-gold-500 font-black font-display font-medium">LKR {(hotel.revenue || 0).toLocaleString()}</td>
                          <td className="py-4 px-3 text-right">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Add Hotel Tab */}
        {activeTab === "add-hotel" && (
          <div className="animate-fade-in w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-display text-white">List a New Property</h2>
              <p className="text-slate-500 text-sm mt-1">Register a new hotel or resort to start receiving guest bookings</p>
            </div>

            <form onSubmit={handleAddHotel} className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                
                {/* Left Side: Form Details Card */}
                <div className="glass p-6 md:p-8 rounded-2xl h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2">Property Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Property Name *</label>
                        <input
                          type="text"
                          required
                          value={newHotelName}
                          onChange={(e) => setNewHotelName(e.target.value)}
                          placeholder="e.g. Ella Green Eco Resort"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Location (City) *</label>
                        <input
                          type="text"
                          required
                          value={newHotelLoc}
                          onChange={(e) => setNewHotelLoc(e.target.value)}
                          placeholder="e.g. Ella, Sri Lanka"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Country *</label>
                        <input
                          type="text"
                          required
                          value={newHotelCountry}
                          onChange={(e) => setNewHotelCountry(e.target.value)}
                          placeholder="e.g. Sri Lanka"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Starting Price per Night (LKR) *</label>
                        <input
                          type="number"
                          required
                          value={newHotelPrice}
                          onChange={(e) => setNewHotelPrice(e.target.value)}
                          placeholder="15000"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Category *</label>
                        <select
                          value={newHotelCategory}
                          onChange={(e) => setNewHotelCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer [color-scheme:dark]"
                        >
                          <option value="luxury">Luxury</option>
                          <option value="boutique">Boutique</option>
                          <option value="resort">Resort</option>
                          <option value="business">Business</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Stars *</label>
                        <select
                          value={newHotelStars}
                          onChange={(e) => setNewHotelStars(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer [color-scheme:dark]"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Total Rooms *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={newHotelRooms}
                          onChange={(e) => setNewHotelRooms(e.target.value)}
                          placeholder="10"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Hotel Image URL</label>
                        <input
                          type="url"
                          value={newHotelImgUrl}
                          onChange={(e) => setNewHotelImgUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Short Description *</label>
                      <input
                        type="text"
                        required
                        value={newHotelDesc}
                        onChange={(e) => setNewHotelDesc(e.target.value)}
                        placeholder="Brief tagline showing on search listings"
                        className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Detailed Long Description *</label>
                      <textarea
                        required
                        rows={5}
                        value={newHotelLongDesc}
                        onChange={(e) => setNewHotelLongDesc(e.target.value)}
                        placeholder="Provide full description of your property, services, and location highlight..."
                        className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50 resize-y"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gold-500/10 mt-8">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="px-5 py-2.5 rounded-full border border-gold-500/30 text-slate-400 text-sm font-semibold hover:text-gold-400 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      Register & Activate Property
                    </button>
                  </div>
                </div>

                {/* Right Side: Rooms Preview and Action */}
                <div className="glass p-6 md:p-8 rounded-2xl space-y-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-gold-500/10 pb-4 mb-4">
                      <div>
                        <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider">Hotel Rooms</h3>
                        <p className="text-slate-500 text-xs mt-1">Configure and add rooms to this property listing</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewRoomNo("");
                          setNewRoomPrice("");
                          setNewRoomType("single");
                          setIsAddRoomOpen(true);
                        }}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        + Add Room
                      </button>
                    </div>

                    {roomsList.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gold-500/10 rounded-2xl">
                        <div className="text-3xl mb-2">🛏</div>
                        <p className="text-slate-500 text-xs font-semibold">No rooms added to this property yet.</p>
                        <p className="text-slate-600 text-[10px] mt-1">Click the "+ Add Room" button to configure your first room type.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {roomsList.map((r, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-navy-800/40 border border-gold-500/10 flex justify-between items-center">
                            <div>
                              <h4 className="text-white text-sm font-bold">{r.name}</h4>
                              <p className="text-slate-500 text-xs mt-1">
                                {r.bedType} · {r.size} · Up to {r.capacity} guests
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {r.amenities.map((a: string) => (
                                  <span key={a} className="px-2 py-0.5 rounded-full bg-gold-500/5 border border-gold-500/10 text-[9px] text-slate-400">
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-gold-500 text-base font-black">LKR {r.price}</span>
                              <span className="text-slate-600 text-[10px] block">per night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Landscape Add Room Modal Popup */}
                {isAddRoomOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-sm p-4">
                    <div className="bg-navy-900 border border-gold-500/30 rounded-2xl w-full max-w-3xl p-6 relative animate-fade-in shadow-2xl">
                      {/* Close Button */}
                      <button
                        type="button"
                        onClick={() => setIsAddRoomOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
                      >
                        ✕
                      </button>

                      {/* Header */}
                      <div className="border-b border-gold-500/10 pb-3 mb-5">
                        <h3 className="text-white text-lg font-bold font-display">Configure New Room</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Define room configurations, pricing, and amenities</p>
                      </div>

                      {/* Landscape Modal Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Form Inputs (Left side of modal) */}
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room No / Name *</label>
                            <input
                              type="text"
                              required
                              value={newRoomNo}
                              onChange={(e) => setNewRoomNo(e.target.value)}
                              placeholder="e.g. Deluxe Room 101"
                              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Price per Night (LKR) *</label>
                            <input
                              type="number"
                              required
                              value={newRoomPrice}
                              onChange={(e) => setNewRoomPrice(e.target.value)}
                              placeholder="12000"
                              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Type *</label>
                            <select
                              value={newRoomType}
                              onChange={(e) => setNewRoomType(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer [color-scheme:dark]"
                            >
                              <option value="single">Single Room</option>
                              <option value="double">Double Room</option>
                              <option value="family">Family Room</option>
                            </select>
                          </div>
                        </div>

                        {/* Auto-selected Specs Preview (Right side of modal) */}
                        <div className="bg-navy-800/40 border border-gold-500/10 p-5 rounded-xl space-y-4">
                          <h4 className="text-gold-500 text-xs font-bold uppercase tracking-wider border-b border-gold-500/5 pb-2">Auto-selected Specifications</h4>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-xs">Bed Setup:</span>
                              <span className="text-slate-200 font-bold">
                                {newRoomType === "single" && "🛏 Single Bed"}
                                {newRoomType === "double" && "🛏 2 Double Beds"}
                                {newRoomType === "family" && "🛏 3 Beds"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-xs">Capacity:</span>
                              <span className="text-slate-200 font-bold">
                                {newRoomType === "single" && "👤 1 Guest"}
                                {newRoomType === "double" && "👤 2 Guests"}
                                {newRoomType === "family" && "👤 Up to 8 Guests"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-xs">Room Size:</span>
                              <span className="text-slate-200 font-bold">
                                {newRoomType === "single" && "📐 30 m²"}
                                {newRoomType === "double" && "📐 45 m²"}
                                {newRoomType === "family" && "📐 80 m²"}
                              </span>
                            </div>

                            <div className="pt-2">
                              <span className="text-slate-500 text-xs font-bold block mb-2">Amenities Included:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {newRoomType === "single" && ["Attach Bathroom", "TV", "Single Bed"].map(a => (
                                  <span key={a} className="px-2 py-0.5 rounded bg-gold-500/5 border border-gold-500/15 text-[10px] text-slate-350">✓ {a}</span>
                                ))}
                                {newRoomType === "double" && ["Attach Bathroom", "TV", "2 Double Beds"].map(a => (
                                  <span key={a} className="px-2 py-0.5 rounded bg-gold-500/5 border border-gold-500/15 text-[10px] text-slate-350">✓ {a}</span>
                                ))}
                                {newRoomType === "family" && ["Attach Bathroom", "TV", "3 Beds"].map(a => (
                                  <span key={a} className="px-2 py-0.5 rounded bg-gold-500/5 border border-gold-500/15 text-[10px] text-slate-350">✓ {a}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gold-500/10">
                        <button
                          type="button"
                          onClick={() => setIsAddRoomOpen(false)}
                          className="px-5 py-2.5 rounded-full border border-gold-500/30 text-slate-400 text-sm font-semibold hover:text-gold-400 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newRoomNo || !newRoomPrice) return;
                            const capacity = newRoomType === "single" ? 1 : newRoomType === "double" ? 2 : 8;
                            const bedType = newRoomType === "single" ? "Single" : newRoomType === "double" ? "2 Double Beds" : "3 Beds";
                            const size = newRoomType === "single" ? "30 m²" : newRoomType === "double" ? "45 m²" : "80 m²";
                            const amenities = newRoomType === "single"
                              ? ["Attach Bathroom", "TV", "Single Bed"]
                              : newRoomType === "double"
                              ? ["Attach Bathroom", "TV", "2 Double Beds"]
                              : ["Attach Bathroom", "TV", "3 Beds"];

                            handleAddRoom({
                              name: newRoomNo,
                              price: parseFloat(newRoomPrice) || 10000,
                              capacity,
                              bedType,
                              size,
                              amenities,
                            });
                            setIsAddRoomOpen(false);
                          }}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          Add Room
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </form>
          </div>
        )}

        {/* Render Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-display text-white">Recent Guest Reservations</h2>
              <p className="text-slate-500 text-sm mt-1">Review live check-in, check-out dates, and status of recent stays</p>
            </div>

            <div className="glass p-6 md:p-8 rounded-2xl">
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-slate-400 font-medium">No guest reservations found.</p>
                <p className="text-slate-600 text-xs mt-1">Bookings for your listed properties will appear here.</p>
              </div>
            </div>
          </div>
        )}

        {/* Render Profile Tab */}
        {activeTab === "profile" && <OwnerProfile />}

      </main>
    </div>
  );
}
