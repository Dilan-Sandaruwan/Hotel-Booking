"use client";

import { Suspense } from "react";
import BookingPage from "../pages/booking";

export default function Booking() {
  return (
    <Suspense fallback={<div style={{ padding: "10rem", textAlign: "center", color: "#D4A853" }}>Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
}
