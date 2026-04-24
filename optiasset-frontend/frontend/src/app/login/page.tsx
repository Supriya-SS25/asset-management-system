"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Building, Eye, EyeOff, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";

export default function PremiumLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Professional role-based login connecting to FastAPI backend
  const executeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginEmail = email.trim().toLowerCase();
      
      const formData = new URLSearchParams();
      formData.append('username', loginEmail);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error("Invalid email or password. Please try again.");
      }

      const data = await response.json();
      
      // Store session securely
      const sessionData = {
        authToken: data.access_token,
        userRole: data.user.role,
        userName: data.user.name,
        userEmail: data.user.email,
        loginTime: new Date().toISOString(),
      };

      Object.entries(sessionData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Role-based secure redirection
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-between p-4">
      {/* Background styling matching Register Page */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Spacer for centering */}
      <div className="flex-1"></div>
      
      {/* Main Login Container - Card Layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl">
        
        {/* Left Panel - Brand */}
        <div className="p-10 lg:p-16 lg:w-1/2 flex flex-col justify-center bg-blue-900/40 relative">
          <div className="relative z-10 flex flex-col h-full justify-center space-y-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">AssetTrack Pro</h1>
                <p className="text-blue-200 font-medium tracking-wide text-sm uppercase">Enterprise Asset Management</p>
              </div>
            </div>
            
            <p className="text-blue-100 text-lg leading-relaxed border-l-4 border-blue-500 pl-4">
              Secure, role-based access for enterprise hardware tracking and allocation.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-10 lg:p-16 lg:w-1/2 flex flex-col justify-center bg-transparent relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-200 text-sm">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={executeLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 ml-1 flex justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end pr-1">
                <Link href="/forgot-password" data-testid="forgot-password-link" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
              
              {/* Error Message Placed Exactly Here */}
              {error && (
                <div className="mt-4 text-center p-3 bg-red-500/20 border border-red-500/50 rounded-lg animate-fade-in">
                  <span className="text-red-200 text-sm font-medium">{error}</span>
                </div>
              )}
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm text-slate-300">
                Don't have an account? <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Spacer for centering */}
      <div className="flex-1 flex flex-col justify-end">
        <footer className="text-center py-6 text-slate-400 text-xs z-10 relative">
          © 2026 AssetTrack Pro. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
