export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  longDescription: string;
  stars: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  featured?: boolean;
  category: "luxury" | "boutique" | "resort" | "business";
  rooms: Room[];
  // Dashboard UI helper properties
  status?: "Active" | "Pending" | "Inactive";
  revenue?: number;
  bookings?: number;
  roomsCount?: number;
  ownerEmail?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  bedType: string;
  price: number;
  size: string;
  amenities: string[];
  images?: string[];
  mode?: "active" | "maintenance";
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  roomType: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  bookingDate: string;
  guestName: string;
  guestEmail: string;
}

const DEFAULT_HOTELS: Hotel[] = [
  {
    id: "H-101",
    name: "Ella Eco Resort",
    location: "Ella",
    country: "Sri Lanka",
    description: "Eco-friendly resort in the hills of Ella.",
    longDescription: "A premium eco-friendly resort located in the heart of Ella, Sri Lanka. Offering breathtaking views of mountain ranges, lush tea estates, and the famous Ella Rock.",
    stars: 5,
    rating: 5.0,
    reviewCount: 1,
    price: 12000,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Free WiFi", "Free parking", "Spa & Wellness", "Fitness Center", "Air conditioning", "24-Hour Front Desk"],
    category: "resort",
    featured: true,
    rooms: [
      {
        id: "R-101",
        name: "Deluxe 101",
        capacity: 2,
        bedType: "1 Double bed",
        price: 12000,
        size: "250 sq ft",
        amenities: ["Wifi", "TV", "Sea View"],
        images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80"],
        mode: "active"
      },
      {
        id: "R-102",
        name: "Family Suite 102",
        capacity: 4,
        bedType: "2 Double beds",
        price: 18000,
        size: "450 sq ft",
        amenities: ["WiFi", "TV", "Sea View", "AC"],
        images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"],
        mode: "active"
      }
    ]
  },
  {
    id: "H-102",
    name: "Grand Luxury Villa",
    location: "Colombo",
    country: "Sri Lanka",
    description: "Ultra-premium private villa in Colombo.",
    longDescription: "Experience true luxury at the Grand Luxury Villa. Located in the exclusive suburbs of Colombo, offering private pools, butler service, and world-class fine dining.",
    stars: 5,
    rating: 5.0,
    reviewCount: 1,
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Free WiFi", "Private Pool", "Butler Service", "Fitness Center", "Spa", "Airport Shuttle"],
    category: "luxury",
    featured: true,
    rooms: [
      {
        id: "R-201",
        name: "Royal Pool Villa",
        capacity: 2,
        bedType: "1 King Bed",
        price: 25000,
        size: "350 sq ft",
        amenities: ["WiFi", "TV", "AC", "Private Pool"],
        images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80"],
        mode: "active"
      }
    ]
  }
];

export const HOTELS: Hotel[] = [];

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("luxestay_hotels");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        HOTELS.push(...parsed);
      } else {
        HOTELS.push(...DEFAULT_HOTELS);
        localStorage.setItem("luxestay_hotels", JSON.stringify(DEFAULT_HOTELS));
      }
    } else {
      HOTELS.push(...DEFAULT_HOTELS);
      localStorage.setItem("luxestay_hotels", JSON.stringify(DEFAULT_HOTELS));
    }
  } catch {
    HOTELS.push(...DEFAULT_HOTELS);
  }
} else {
  HOTELS.push(...DEFAULT_HOTELS);
}

export function addHotel(hotel: Hotel) {
  HOTELS.push(hotel);
  if (typeof window !== "undefined") {
    localStorage.setItem("luxestay_hotels", JSON.stringify(HOTELS));
  }
}

export function getHotelById(id: string): Hotel | undefined {
  return HOTELS.find((h) => h.id === id);
}

export function searchHotels(query: { location?: string; category?: string; maxPrice?: number }): Hotel[] {
  return HOTELS.filter((h) => {
    const locationMatch = !query.location ||
      h.location.toLowerCase().includes(query.location.toLowerCase()) ||
      h.name.toLowerCase().includes(query.location.toLowerCase());
    const categoryMatch = !query.category || h.category === query.category;
    const priceMatch = !query.maxPrice || h.price <= query.maxPrice;
    return locationMatch && categoryMatch && priceMatch;
  });
}
