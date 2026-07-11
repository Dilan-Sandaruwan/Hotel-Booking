"use client";

import { Suspense } from "react";
import ConfirmationPage from "../pages/confirmation";

export default function Confirmation() {
  return (
    <Suspense fallback={<div style={{ padding: "10rem", textAlign: "center", color: "#D4A853" }}>Loading...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
}
