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

const COMMON_AMENITIES = [
  "Free WiFi",
  "Free parking",
  "Indoor swimming pool",
  "Spa & Wellness",
  "Fine Dining Restaurant",
  "Room service",
  "Fitness Center",
  "Bar / Lounge",
  "Air conditioning",
  "Beachfront access",
  "24-Hour Front Desk",
];

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
  const [newHotelImages, setNewHotelImages] = useState<string[]>([]);
  const [newHotelCategory, setNewHotelCategory] = useState("luxury");
  const [newHotelRooms, setNewHotelRooms] = useState("10");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Free WiFi",
    "Free parking",
  ]);

  // Edit Hotel State
  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState("");
  const [editHotelName, setEditHotelName] = useState("");
  const [editHotelLoc, setEditHotelLoc] = useState("");
  const [editHotelCountry, setEditHotelCountry] = useState("");
  const [editHotelDesc, setEditHotelDesc] = useState("");
  const [editHotelLongDesc, setEditHotelLongDesc] = useState("");
  const [editHotelStars, setEditHotelStars] = useState("5");
  const [editHotelPrice, setEditHotelPrice] = useState("15000");
  const [editHotelCategory, setEditHotelCategory] = useState("luxury");
  const [editHotelRooms, setEditHotelRooms] = useState("10");
  const [editHotelImages, setEditHotelImages] = useState<string[]>([]);

  // Rooms State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomFeatures, setRoomFeatures] = useState("");
  const [roomBedRoom, setRoomBedRoom] = useState("");
  const [roomExtraFeatures, setRoomExtraFeatures] = useState("");
  const [roomPrice, setRoomPrice] = useState("12000");
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [roomPersonCount, setRoomPersonCount] = useState("2");
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState("");

  // Bookings state (owner dashboard — all guest reservations)
  const [guestBookings, setGuestBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // ── JWT helpers ─────────────────────────────────────────────────────────
  /** Returns headers including the owner JWT for protected API calls. */
  const ownerHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}`,
  });

  /** Clears auth state and redirects to login when a 401 is received. */
  const handleUnauthorized = () => {
    localStorage.removeItem("ownerLoggedIn");
    localStorage.removeItem("ownerLoggedInId");
    localStorage.removeItem("ownerToken");
    router.push("/owners/login");
  };
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Check auth — both the email flag AND the JWT token must be present
    const auth = localStorage.getItem("ownerLoggedIn");
    const ownerId = localStorage.getItem("ownerLoggedInId");
    const token = localStorage.getItem("ownerToken");
    if (!auth || !token) {
      router.push("/owners/login");
      return;
    }

    // Load hotels from backend with Authorization header
    fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { handleUnauthorized(); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data || !Array.isArray(data)) return;
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ownerLoggedIn");
    localStorage.removeItem("ownerLoggedInId");
    localStorage.removeItem("ownerToken");
    router.push("/");
  };

  // ── Fetch guest bookings when bookings tab is opened ─────────────────────
  useEffect(() => {
    if (activeTab !== "bookings") return;
    const ownerId = localStorage.getItem("ownerLoggedInId");
    if (!ownerId) return;
    setBookingsLoading(true);
    fetch(`http://localhost:5000/api/bookings/owner/${ownerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
    })
      .then((res) => {
        if (res.status === 401) { handleUnauthorized(); return null; }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setGuestBookings(data);
        setBookingsLoading(false);
      })
      .catch((err) => { console.error(err); setBookingsLoading(false); });
  }, [activeTab]);
  // ─────────────────────────────────────────────────────────────────────────

  const handleStartEditHotel = (hotel: any) => {
    setEditingHotelId(hotel.id);
    setEditHotelName(hotel.name || "");
    setEditHotelLoc(hotel.location || "");
    setEditHotelCountry(hotel.country || "");
    setEditHotelDesc(hotel.description || "");
    setEditHotelLongDesc(hotel.longDescription || "");
    setEditHotelStars(hotel.stars?.toString() || "5");
    setEditHotelPrice(hotel.price?.toString() || "15000");
    setEditHotelCategory(hotel.category || "luxury");
    setEditHotelRooms(hotel.roomsCount?.toString() || "10");
    setEditHotelImages(hotel.gallery || (hotel.imageUrl ? [hotel.imageUrl] : []));
    setIsEditHotelOpen(true);
  };

  const handleEditHotelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (editHotelImages.length + files.length > 6) {
      alert("Maximum 6 photos allowed per property.");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditHotelImages((prev) => [...prev, reader.result as string].slice(0, 6));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveEditHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelId) return;

    const auth = localStorage.getItem("ownerLoggedIn") || "";
    const ownerId = localStorage.getItem("ownerLoggedInId") || "";

    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${editingHotelId}`, {
        method: "PUT",
        headers: ownerHeaders(),
        body: JSON.stringify({
          propertyName: editHotelName,
          city: editHotelLoc,
          country: editHotelCountry,
          startingPricePerNight: parseFloat(editHotelPrice) || 15000,
          category: editHotelCategory,
          stars: parseInt(editHotelStars) || 5,
          totalRooms: parseInt(editHotelRooms) || 10,
          imageUrl: editHotelImages[0] || "https://picsum.photos/seed/resort/600/400",
          shortDescription: editHotelDesc,
          longDescription: editHotelLongDesc,
        }),
      });

      if (response.status === 401) { handleUnauthorized(); return; }

      if (!response.ok) {
        alert("Failed to update hotel.");
        return;
      }

      // Reload hotels from backend
      const res = await fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      }

      setIsEditHotelOpen(false);
      setEditingHotelId("");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelLoc || !newHotelCountry || !newHotelPrice) return;

    const auth = localStorage.getItem("ownerLoggedIn") || "";
    const ownerId = localStorage.getItem("ownerLoggedInId") || "";
    const newPriceVal = parseFloat(newHotelPrice) || 10000;

    try {
      const response = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: ownerHeaders(),
        body: JSON.stringify({
          ownerId,
          ownerEmail: auth,
          propertyName: newHotelName,
          city: newHotelLoc,
          country: newHotelCountry,
          startingPricePerNight: newPriceVal,
          category: newHotelCategory,
          stars: parseInt(newHotelStars) || 5,
          totalRooms: parseInt(newHotelRooms) || 10,
          imageUrl: newHotelImages[0] || newHotelImgUrl || "https://picsum.photos/seed/resort/600/400",
          shortDescription: newHotelDesc,
          longDescription: newHotelLongDesc,
          amenities: selectedAmenities,
        }),
      });
      if (response.status === 401) { handleUnauthorized(); return; }

      if (!response.ok) {
        alert("Failed to add hotel to the database.");
        return;
      }

      // Reload hotels from backend
      const res = await fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      }

      // Reset Form
      setNewHotelName("");
      setNewHotelLoc("");
      setNewHotelCountry("");
      setNewHotelDesc("");
      setNewHotelLongDesc("");
      setNewHotelStars("5");
      setNewHotelPrice("15000");
      setNewHotelImgUrl("");
      setNewHotelImages([]);
      setNewHotelCategory("luxury");
      setNewHotelRooms("10");
      setSelectedAmenities(["Free WiFi", "Free parking"]);

      setActiveTab("overview"); // Redirect back to overview after adding
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    }
  };

  const handleAddNewRoom = async () => {
    if (!selectedHotelId || !roomNumber) return;

    const selectedHotel = hotels.find((h) => h.id === selectedHotelId);
    if (!selectedHotel) return;

    const featuresList = roomFeatures
      ? roomFeatures.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const extraList = roomExtraFeatures
      ? roomExtraFeatures.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const auth = localStorage.getItem("ownerLoggedIn") || "";
    const ownerId = localStorage.getItem("ownerLoggedInId") || "";

    try {
      const response = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: ownerHeaders(),
        body: JSON.stringify({
          hotelId: selectedHotelId,
          roomName: roomNumber,
          bedType: roomBedRoom || "Double Bed",
          features: featuresList,
          extraFeatures: extraList,
          pricePerNight: parseFloat(roomPrice) || 12000,
          imageUrls: roomImages,
          maxPersonCount: parseInt(roomPersonCount) || 2,
          mode: "active"
        }),
      });
      if (response.status === 401) { handleUnauthorized(); return; }

      if (!response.ok) {
        alert("Failed to add room to database.");
        return;
      }

      // Reload hotels from backend to get updated rooms
      const res = await fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      }

      setIsAddRoomOpen(false);

      setRoomNumber("");
      setRoomFeatures("");
      setRoomBedRoom("");
      setRoomExtraFeatures("");
      setRoomPrice("12000");
      setRoomPersonCount("2");
      setRoomImages([]);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    }
  };

  const handleHotelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (newHotelImages.length + files.length > 6) {
      alert("You can upload a maximum of 6 photos.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setNewHotelImages((prev) => [...prev, result].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeHotelImage = (index: number) => {
    setNewHotelImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    if (roomImages.length + files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setRoomImages((prev) => [...prev, result].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeRoomImage = (index: number) => {
    setRoomImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleMaintenance = async (room: any) => {
    const newMode = room.mode === "maintenance" ? "active" : "maintenance";
    const auth = localStorage.getItem("ownerLoggedIn") || "";
    const ownerId = localStorage.getItem("ownerLoggedInId") || "";

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${room.id}`, {
        method: "PUT",
        headers: ownerHeaders(),
        body: JSON.stringify({
          roomName: room.name,
          bedType: room.bedType,
          pricePerNight: room.price,
          features: room.amenities,
          extraFeatures: [],
          imageUrls: room.images,
          mode: newMode,
          maxPersonCount: room.capacity,
        }),
      });
      if (response.status === 401) { handleUnauthorized(); return; }

      if (!response.ok) {
        alert("Failed to update room status.");
        return;
      }

      // Reload hotels from backend to sync
      const res = await fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    }
  };

  const handleStartEditRoom = (room: any) => {
    setEditingRoomId(room.id);
    setRoomNumber(room.name);
    setRoomBedRoom(room.bedType);
    setRoomFeatures(room.amenities.join(", "));
    setRoomExtraFeatures("");
    setRoomPrice(room.price.toString());
    setRoomPersonCount(room.capacity.toString());
    setRoomImages(room.images || []);
    setIsEditRoomOpen(true);
  };

  const handleSaveEditRoom = async () => {
    if (!editingRoomId || !roomNumber) return;

    const auth = localStorage.getItem("ownerLoggedIn") || "";
    const ownerId = localStorage.getItem("ownerLoggedInId") || "";
    const featuresList = roomFeatures
      ? roomFeatures.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${editingRoomId}`, {
        method: "PUT",
        headers: ownerHeaders(),
        body: JSON.stringify({
          roomName: roomNumber,
          bedType: roomBedRoom || "Double Bed",
          pricePerNight: parseFloat(roomPrice) || 12000,
          features: featuresList,
          extraFeatures: [],
          imageUrls: roomImages,
          mode: "active", // Default/Preserve active on full edit
          maxPersonCount: parseInt(roomPersonCount) || 2,
        }),
      });
      if (response.status === 401) { handleUnauthorized(); return; }

      if (!response.ok) {
        alert("Failed to modify room in database.");
        return;
      }

      // Reload hotels from backend to get updated rooms
      const res = await fetch(`http://localhost:5000/api/hotels/owner/${ownerId || "null"}?email=${encodeURIComponent(auth)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken") || ""}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
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
          category: h.category,
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
          status: "Active",
          revenue: 0,
          bookings: 0,
          roomsCount: h.rooms ? h.rooms.length : 0,
          ownerEmail: auth,
        }));
        setHotels(mapped);
      }

      setIsEditRoomOpen(false);
      setEditingRoomId("");

      setRoomNumber("");
      setRoomFeatures("");
      setRoomBedRoom("");
      setRoomExtraFeatures("");
      setRoomPrice("12000");
      setRoomPersonCount("2");
      setRoomImages([]);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    }
  };

  const totalRevenue = hotels.reduce((sum, h) => sum + (h.revenue || 0), 0);
  const activeListings = hotels.filter((h) => h.status === "Active").length;
  const totalBookings = hotels.reduce((sum, h) => sum + (h.bookings || 0), 0);

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { title: "Total Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, icon: "💰" },
                { title: "Active Listings", value: `${activeListings}`, icon: "🏢" },
                { title: "Total Bookings", value: `${totalBookings} Stay${totalBookings !== 1 ? "s" : ""}`, icon: "📅" }
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{stat.icon}</span>
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
                        <th className="py-4 px-3 text-right">Actions</th>
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
                          <td className="py-4 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleStartEditHotel(hotel)}
                              className="px-3.5 py-1.5 rounded-lg bg-gold-500/15 hover:bg-gold-500 text-gold-400 hover:text-navy-900 border border-gold-500/30 text-xs font-bold transition-all duration-200 cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Edit Hotel Modal Popup */}
            {isEditHotelOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-navy-900 border border-gold-500/30 rounded-2xl w-full max-w-2xl p-6 relative animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditHotelOpen(false);
                      setEditingHotelId("");
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
                  >
                    ✕
                  </button>

                  <div className="border-b border-gold-500/10 pb-3 mb-5">
                    <h3 className="text-white text-lg font-bold font-display">Modify Property Details</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Edit hotel information, pricing, and descriptions</p>
                  </div>

                  <form onSubmit={handleSaveEditHotel} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Property Name *</label>
                        <input
                          type="text"
                          required
                          value={editHotelName}
                          onChange={(e) => setEditHotelName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Location (City) *</label>
                        <input
                          type="text"
                          required
                          value={editHotelLoc}
                          onChange={(e) => setEditHotelLoc(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Country *</label>
                        <input
                          type="text"
                          required
                          value={editHotelCountry}
                          onChange={(e) => setEditHotelCountry(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Starting Price per Night (LKR) *</label>
                        <input
                          type="number"
                          required
                          value={editHotelPrice}
                          onChange={(e) => setEditHotelPrice(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Category *</label>
                        <select
                          value={editHotelCategory}
                          onChange={(e) => setEditHotelCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 [color-scheme:dark]"
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
                          value={editHotelStars}
                          onChange={(e) => setEditHotelStars(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 [color-scheme:dark]"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Short Description *</label>
                      <input
                        type="text"
                        required
                        value={editHotelDesc}
                        onChange={(e) => setEditHotelDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Detailed Long Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={editHotelLongDesc}
                        onChange={(e) => setEditHotelLongDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 resize-y"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                        Hotel Photos (Max 6 Photos)
                      </label>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {editHotelImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-500/20 group"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setEditHotelImages(editHotelImages.filter((_, i) => i !== idx))}
                              className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold transition-opacity text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {editHotelImages.length < 6 && (
                          <label className="w-16 h-16 rounded-xl border border-dashed border-gold-500/30 flex flex-col items-center justify-center text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-all">
                            <span className="text-xl">+</span>
                            <span className="text-[10px] font-bold">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleEditHotelImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/10">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditHotelOpen(false);
                          setEditingHotelId("");
                        }}
                        className="px-5 py-2.5 rounded-full border border-gold-500/30 text-slate-400 text-sm font-semibold hover:text-gold-400 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render Add Hotel Tab */}
        {activeTab === "add-hotel" && (
          <div className="animate-fade-in w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-display text-white">List a New Property</h2>
              <p className="text-slate-500 text-sm mt-1">Register a new hotel or resort to start receiving guest bookings</p>
            </div>

            <form onSubmit={handleAddHotel} className="w-full max-w-6xl mx-auto">
              <div className="glass p-6 md:p-8 rounded-2xl flex flex-col justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Basic Information */}
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

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">
                          Hotel Photos (Max 6 Photos)
                        </label>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {newHotelImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-500/20 group"
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeHotelImage(idx)}
                                className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity duration-200 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {newHotelImages.length < 6 && (
                            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gold-500/20 hover:border-gold-500/40 flex flex-col items-center justify-center text-slate-500 hover:text-gold-400 cursor-pointer transition-colors bg-navy-800/40">
                              <span className="text-xl leading-none">+</span>
                              <span className="text-[10px] mt-0.5">Upload</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleHotelImageUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Descriptions & Amenities */}
                  <div className="space-y-6">
                    <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2">Details & Amenities</h3>

                    <div className="space-y-5">
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
                          rows={4}
                          value={newHotelLongDesc}
                          onChange={(e) => setNewHotelLongDesc(e.target.value)}
                          placeholder="Provide full description of your property, services, and location highlight..."
                          className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-gold-500/50 resize-y"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Amenities *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-navy-800/40 border border-gold-500/15">
                          {COMMON_AMENITIES.map((amenity) => {
                            const checked = selectedAmenities.includes(amenity);
                            return (
                              <label key={amenity} className="flex items-center gap-2 text-slate-350 text-sm cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    if (checked) {
                                      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                    } else {
                                      setSelectedAmenities([...selectedAmenities, amenity]);
                                    }
                                  }}
                                  className="accent-gold-500 rounded border-gold-500/20"
                                />
                                <span>{amenity}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
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
            </form>
          </div>
        )}

        {/* Render Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="animate-fade-in w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-display text-white">Manage & Add Rooms</h2>
              <p className="text-slate-500 text-sm mt-1">Select a registered property to view current configurations or append new rooms</p>
            </div>

            <div className="glass p-6 md:p-8 rounded-2xl mb-8 max-w-3xl">
              <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2 mb-6">Select Property</h3>
              
              <div className="flex flex-col md:flex-row md:items-end gap-5">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Choose Hotel *</label>
                  <select
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer [color-scheme:dark]"
                  >
                    <option value="">-- Choose Hotel --</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} (📍 {h.location})
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="button"
                  disabled={!selectedHotelId}
                  onClick={() => {
                    setRoomNumber("");
                    setRoomFeatures("");
                    setRoomBedRoom("");
                    setRoomExtraFeatures("");
                    setRoomPrice("12000");
                    setIsAddRoomOpen(true);
                  }}
                  className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer whitespace-nowrap h-[46px] flex items-center justify-center ${
                    selectedHotelId
                      ? "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 shadow-gold-500/20 hover:-translate-y-0.5"
                      : "bg-navy-800 text-slate-500 border border-navy-700 cursor-not-allowed"
                  }`}
                >
                  + Add Room
                </button>
              </div>
            </div>

            {/* Room cards display for the selected hotel */}
            {selectedHotelId && (() => {
              const selectedHotel = hotels.find((h) => h.id === selectedHotelId);
              const rooms = selectedHotel?.rooms || [];

              return (
                <div className="glass p-6 md:p-8 rounded-2xl w-full">
                  <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2 border-b border-gold-500/10 pb-3">
                    <span>🛏</span> Room Configurations — {selectedHotel?.name}
                  </h3>

                  {rooms.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gold-500/10 rounded-2xl">
                      <div className="text-4xl mb-3">🛏</div>
                      <h4 className="text-slate-400 font-semibold mb-1">No rooms added to this property yet</h4>
                      <p className="text-slate-600 text-xs">Click the "+ Add Room" button above to register a room configuration.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {rooms.map((r: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-5 rounded-2xl bg-navy-800/40 border flex flex-col justify-between hover:border-gold-500/30 transition-all duration-300 relative ${
                            r.mode === "maintenance"
                              ? "border-amber-500/30 opacity-80 grayscale-[20%]"
                              : "border-gold-500/12"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold font-display text-base leading-snug">{r.name}</h4>
                                {r.mode === "maintenance" && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">
                                    Maintenance
                                  </span>
                                )}
                              </div>
                              <span className="text-gold-400 text-sm font-black whitespace-nowrap">LKR {r.price.toLocaleString()}</span>
                            </div>
                            
                            <p className="text-slate-350 text-xs mb-3 flex items-center gap-1.5">
                              🛏 <span className="font-semibold text-slate-200">{r.bedType}</span>
                              <span className="text-slate-500">|</span>
                              👤 <span className="font-semibold text-slate-200">Max {r.capacity} guests</span>
                            </p>

                            {r.images && r.images.length > 0 && (
                              <div className="flex gap-1.5 overflow-x-auto py-1 mb-3">
                                {r.images.map((img: string, i: number) => (
                                  <img key={i} src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 border border-gold-500/10" />
                                ))}
                              </div>
                            )}

                            {r.amenities && r.amenities.length > 0 && (
                              <div className="space-y-2 mt-4 pt-3 border-t border-gold-500/5">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Features & Extras:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {r.amenities.map((a: string, i: number) => (
                                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-gold-500/5 border border-gold-500/15 text-[10px] text-slate-400">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Actions */}
                          <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gold-500/5">
                            <button
                              type="button"
                              onClick={() => handleToggleMaintenance(r)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex-1 ${
                                r.mode === "maintenance"
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                  : "bg-navy-900 border-gold-500/15 text-slate-400 hover:text-white hover:border-gold-500/35"
                              }`}
                            >
                              🔧 {r.mode === "maintenance" ? "Active" : "Maintain"}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleStartEditRoom(r)}
                              className="px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 text-xs font-bold transition-all cursor-pointer flex-1"
                            >
                              ✍ Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Add Room Modal Popup */}
            {isAddRoomOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-sm p-4">
                <div className="bg-navy-900 border border-gold-500/30 rounded-2xl w-full max-w-lg p-6 relative animate-fade-in shadow-2xl">
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
                    <p className="text-slate-500 text-xs mt-0.5">Add a new room configuration details for your property</p>
                  </div>

                  {/* Popup Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Number / Name *</label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Deluxe Suite 302"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Bed Room / Bed Type *</label>
                      <input
                        type="text"
                        required
                        value={roomBedRoom}
                        onChange={(e) => setRoomBedRoom(e.target.value)}
                        placeholder="e.g. 1 King Bed, 2 Double Beds"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Features (Comma separated) *</label>
                      <input
                        type="text"
                        value={roomFeatures}
                        onChange={(e) => setRoomFeatures(e.target.value)}
                        placeholder="e.g. WiFi, TV, AC, Attached Bathroom"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Extra Features (Comma separated)</label>
                      <input
                        type="text"
                        value={roomExtraFeatures}
                        onChange={(e) => setRoomExtraFeatures(e.target.value)}
                        placeholder="e.g. Sea View, Private Balcony, Mini Bar"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Price per Night (LKR) *</label>
                      <input
                        type="number"
                        required
                        value={roomPrice}
                        onChange={(e) => setRoomPrice(e.target.value)}
                        placeholder="12000"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Max Capacity (Guests) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={roomPersonCount}
                        onChange={(e) => setRoomPersonCount(e.target.value)}
                        placeholder="2"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Images (Max 6)</label>
                      <div className="flex flex-wrap gap-2.5 mb-2">
                        {roomImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-500/20 group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeRoomImage(idx)}
                              className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity duration-200 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {roomImages.length < 6 && (
                          <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gold-500/20 hover:border-gold-500/40 flex flex-col items-center justify-center text-slate-500 hover:text-gold-400 cursor-pointer transition-colors bg-navy-800/40">
                            <span className="text-xl leading-none">+</span>
                            <span className="text-[10px] mt-0.5">Upload</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleRoomImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                      onClick={handleAddNewRoom}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Room Modal Popup */}
            {isEditRoomOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-sm p-4">
                <div className="bg-navy-900 border border-gold-500/30 rounded-2xl w-full max-w-lg p-6 relative animate-fade-in shadow-2xl">
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditRoomOpen(false);
                      setEditingRoomId("");
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
                  >
                    ✕
                  </button>

                  {/* Header */}
                  <div className="border-b border-gold-500/10 pb-3 mb-5">
                    <h3 className="text-white text-lg font-bold font-display">Modify Room Details</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Edit room details and configuration settings</p>
                  </div>

                  {/* Popup Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Number / Name *</label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Deluxe Suite 302"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Bed Room / Bed Type *</label>
                      <input
                        type="text"
                        required
                        value={roomBedRoom}
                        onChange={(e) => setRoomBedRoom(e.target.value)}
                        placeholder="e.g. 1 King Bed, 2 Double Beds"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Features (Comma separated) *</label>
                      <input
                        type="text"
                        value={roomFeatures}
                        onChange={(e) => setRoomFeatures(e.target.value)}
                        placeholder="e.g. WiFi, TV, AC, Attached Bathroom"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Price per Night (LKR) *</label>
                      <input
                        type="number"
                        required
                        value={roomPrice}
                        onChange={(e) => setRoomPrice(e.target.value)}
                        placeholder="12000"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Max Capacity (Guests) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={roomPersonCount}
                        onChange={(e) => setRoomPersonCount(e.target.value)}
                        placeholder="2"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Room Images (Max 6)</label>
                      <div className="flex flex-wrap gap-2.5 mb-2">
                        {roomImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-500/20 group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeRoomImage(idx)}
                              className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity duration-200 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {roomImages.length < 6 && (
                          <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gold-500/20 hover:border-gold-500/40 flex flex-col items-center justify-center text-slate-500 hover:text-gold-400 cursor-pointer transition-colors bg-navy-800/40">
                            <span className="text-xl leading-none">+</span>
                            <span className="text-[10px] mt-0.5">Upload</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleRoomImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gold-500/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditRoomOpen(false);
                        setEditingRoomId("");
                      }}
                      className="px-5 py-2.5 rounded-full border border-gold-500/30 text-slate-400 text-sm font-semibold hover:text-gold-400 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditRoom}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Guest Reservations</h2>
                <p className="text-slate-500 text-sm mt-1">All bookings across your properties — live from the database</p>
              </div>
              {/* Summary pills */}
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-emerald-400 font-black text-lg">{guestBookings.filter(b => b.booking_status === "confirmed").length}</p>
                  <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Confirmed</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-center">
                  <p className="text-gold-400 font-black text-lg">LKR {guestBookings.reduce((s, b) => s + Number(b.total_amount || 0), 0).toLocaleString()}</p>
                  <p className="text-gold-600 text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <span className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : guestBookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">📅</div>
                  <p className="text-slate-400 font-medium">No guest reservations found.</p>
                  <p className="text-slate-600 text-xs mt-1">Bookings for your listed properties will appear here once guests book.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gold-500/10 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <th className="py-4 px-4">Booking</th>
                        <th className="py-4 px-4">Guest</th>
                        <th className="py-4 px-4">Hotel</th>
                        <th className="py-4 px-4">Room</th>
                        <th className="py-4 px-4">Check-In</th>
                        <th className="py-4 px-4">Check-Out</th>
                        <th className="py-4 px-4">Nights</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/5">
                      {guestBookings.map((b) => {
                        const shortId = b.id.split("-")[0].toUpperCase();
                        const checkIn  = new Date(b.check_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        const checkOut = new Date(b.check_out_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        const statusCls = b.booking_status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : b.booking_status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20";

                        return (
                          <React.Fragment key={b.id}>
                            <tr
                              onClick={() => setExpandedBookingId(expandedBookingId === b.id ? null : b.id)}
                              className="hover:bg-gold-500/3 transition-colors cursor-pointer"
                            >
                              <td className="py-4 px-4">
                                <p className="text-gold-500 font-mono font-bold text-xs"># {shortId}</p>
                                <p className="text-slate-600 text-xs mt-0.5">{new Date(b.created_at).toLocaleDateString()}</p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-slate-200 font-semibold">{b.first_name} {b.last_name}</p>
                                <p className="text-slate-500 text-xs">{b.email}</p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-slate-300 font-medium">{b.hotel_name}</p>
                                <p className="text-slate-500 text-xs">📍 {b.hotel_city}</p>
                              </td>
                              <td className="py-4 px-4 text-slate-400">{b.room_name || "—"}</td>
                              <td className="py-4 px-4 text-slate-300">{checkIn}</td>
                              <td className="py-4 px-4 text-slate-300">{checkOut}</td>
                              <td className="py-4 px-4 text-slate-400 text-center">{b.number_of_nights}</td>
                              <td className="py-4 px-4">
                                <p className="text-gold-400 font-black">LKR {Number(b.total_amount).toLocaleString()}</p>
                                <p className="text-slate-600 text-xs">{b.number_of_guests} guest{b.number_of_guests !== 1 ? "s" : ""}</p>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${statusCls}`}>
                                  {b.booking_status}
                                </span>
                              </td>
                            </tr>
                            {/* Expanded detail row */}
                            {expandedBookingId === b.id && (
                              <tr key={b.id + "-detail"} className="bg-navy-800/40">
                                <td colSpan={9} className="px-6 py-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Phone</p>
                                      <p className="text-slate-300">{b.phone || "—"}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Base Total</p>
                                      <p className="text-slate-300">LKR {Number(b.base_total).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Taxes & Fees</p>
                                      <p className="text-slate-300">LKR {Number(b.taxes_and_fees).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Payment</p>
                                      <p className="text-emerald-400 font-semibold capitalize">{b.payment_status}</p>
                                    </div>
                                    {b.special_requests && (
                                      <div className="col-span-2 md:col-span-4">
                                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Special Requests</p>
                                        <p className="text-slate-400 italic">{b.special_requests}</p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Profile Tab */}
        {activeTab === "profile" && <OwnerProfile />}

      </main>
    </div>
  );
}
