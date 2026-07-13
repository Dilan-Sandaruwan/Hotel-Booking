"use client";

import { Suspense } from "react";
import SignupPage from "../pages/signup";

export default function Signup() {
  return (
    <Suspense fallback={<div style={{ padding: "10rem", textAlign: "center", color: "#D4A853" }}>Loading...</div>}>
      <SignupPage />
    </Suspense>
  );
}
