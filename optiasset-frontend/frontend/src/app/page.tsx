"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
      if (token) {
        setUserRole(localStorage.getItem("userRole"));
      }
    }
  }, []);

  const getDashboardUrl = () => {
    return userRole === "admin" ? "/admin/dashboard" : "/employee/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-[#E5E5E5] p-4">
      <div className="text-center p-12 bg-[#1e1e1e] border border-[#333] rounded-2xl shadow-xl max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Asset Management System
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
          The professional enterprise ecosystem for tracking, deploying, and managing company hardware.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link href={getDashboardUrl()} 
              className="px-8 py-3 bg-[#E5E5E5] text-black font-semibold rounded-lg hover:bg-white transition-all shadow-md w-full md:w-auto text-center">
              Enter Platform
            </Link>
          ) : (
            <>
              <Link href="/login" 
                className="px-8 py-3 bg-[#E5E5E5] text-black font-semibold rounded-lg hover:bg-white transition-all shadow-md w-full md:w-auto text-center">
                Login
              </Link>
              <Link href="/register" 
                className="px-8 py-3 bg-[#2a2a2a] border border-[#444] text-[#E5E5E5] font-semibold rounded-lg hover:bg-[#333] transition-all w-full md:w-auto text-center">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
