"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-[#dc3545] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c82333] transition-all duration-200 disabled:opacity-50 text-sm"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
