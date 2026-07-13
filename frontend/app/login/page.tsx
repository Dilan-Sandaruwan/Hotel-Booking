"use client";

import { Suspense } from "react";
import LoginPage from "../pages/login";

export default function Login() {
  return (
    <Suspense fallback={<div style={{ padding: "10rem", textAlign: "center", color: "#D4A853" }}>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
