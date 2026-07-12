"use client";

import { Suspense } from "react";
import ContactPage from "../pages/contact";

export default function Contact() {
  return (
    <Suspense fallback={<div style={{ padding: "10rem", textAlign: "center", color: "#D4A853" }}>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
}
