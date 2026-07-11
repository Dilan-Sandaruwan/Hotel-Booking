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
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  bedType: string;
  price: number;
  size: string;
  amenities: string[];
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

export const HOTELS: Hotel[] = [];

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("luxestay_hotels");
    if (raw) {
      const parsed = JSON.parse(raw);
      HOTELS.push(...parsed);
    }
  } catch {}
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
