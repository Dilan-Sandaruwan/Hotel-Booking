"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  preferredCurrency: string;
  preferredLanguage: string;
  newsletterOptIn: boolean;
  avatar: string; // initials fallback
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  dateOfBirth: "",
  nationality: "",
  passportNumber: "",
  preferredCurrency: "LKR",
  preferredLanguage: "English",
  newsletterOptIn: false,
  avatar: "",
};

interface UserContextType {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  initials: string;
}

const UserContext = createContext<UserContextType>({
  user: DEFAULT_PROFILE,
  setUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  initials: "",
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("luxestay_user");
      if (raw) {
        setUserState(JSON.parse(raw));
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  const setUser = (u: UserProfile) => {
    setUserState(u);
    try { localStorage.setItem("luxestay_user", JSON.stringify(u)); } catch {}
  };

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.email
    ? user.email[0].toUpperCase()
    : "?";

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, initials }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
