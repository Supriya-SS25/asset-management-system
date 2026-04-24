import { useState, useEffect } from 'react';

interface AuthUser {
  authToken: string;
  userRole: string;
  userName: string;
  userEmail: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on mount and route changes
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");

      console.log("🔍 useAuth - Checking localStorage:", {
        authToken: authToken ? "exists" : "missing",
        userRole: userRole || "missing",
        userName: userName || "missing"
      });

      if (authToken && userRole) {
        const authUser: AuthUser = {
          authToken: authToken!,
          userRole: userRole!,
          userName: userName || "User",
          userEmail: userEmail || ""
        };
        
        setUser(authUser);
        setIsAuthenticated(true);
        console.log("✅ useAuth - Authentication successful");
      } else {
        console.log("❌ useAuth - No authentication found");
        setUser(null);
        setIsAuthenticated(false);
        
        // Only redirect if not on login page
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          console.log("🔄 useAuth - Redirecting to login");
          window.location.href = "/login";
        }
      }
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "userRole") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    console.log("🚪 useAuth - Logging out");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("sessionId");
    
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return {
    user,
    isAuthenticated,
    logout
  };
}
