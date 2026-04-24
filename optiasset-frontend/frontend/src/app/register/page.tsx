"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User, Building, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function PremiumRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation State
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; confirmPassword?: string; api?: string}>({});
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("");

  // Calculate Password Strength dynamically
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (password.length < 8) {
      setPasswordStrength("Weak");
    } else if (score < 3) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  }, [password]);

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!name || name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          // Role is purely controlled via backend logic. 
          // We default it to employee to conform with the Pydantic schema
          role: "employee" 
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        let errorMessage = "Registration failed";
        
        // Check for specific backend errors
        if (errData.detail) {
           if (typeof errData.detail === 'string') {
              if (errData.detail.toLowerCase().includes("already registered")) {
                 errorMessage = "User already exists";
              } else {
                 errorMessage = errData.detail;
              }
           } else {
              errorMessage = errData.detail[0]?.msg || "Invalid input data";
           }
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      // Brief delay for user to read success message before router redirect
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setErrors({ api: err instanceof Error ? err.message : "Registration failed" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="text-white space-y-8 hidden lg:block">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AssetTrack Pro</h1>
                  <p className="text-blue-200">Enterprise Asset Management</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Secure Account Provisioning
              </h2>
              <p className="text-blue-100 text-lg">
                Register to gain access to corporate asset management and track your currently assigned equipment.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-100">Automatically bound Employee access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-100">Secure hashed credentials</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Employee Sign Up</h3>
                <p className="text-blue-200">Create your enterprise account</p>
              </div>

              {errors.api && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-200 text-sm font-medium">{errors.api}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-fade-in shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <span className="text-green-200 font-bold block">Account created successfully</span>
                    <span className="text-green-300 text-sm">Redirecting to login...</span>
                  </div>
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-200 ml-1">Full Name</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-400' : 'text-blue-400'}`} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {setName(e.target.value); if(errors.name) setErrors({...errors, name: undefined})}}
                        placeholder="e.g. Supriya Singh"
                        className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-200 ml-1">Company Email</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-blue-400'}`} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); if(errors.email) setErrors({...errors, email: undefined})}}
                        placeholder="email@company.com"
                        className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-200 ml-1 flex justify-between">
                      <span>Password</span>
                      {passwordStrength && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${passwordStrength === 'Weak' ? 'bg-red-500/20 text-red-300' : passwordStrength === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                          {passwordStrength}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-blue-400'}`} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); if(errors.password) setErrors({...errors, password: undefined})}}
                        placeholder="Minimum 8 characters"
                        className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.password}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-200 ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.confirmPassword ? 'text-red-400' : 'text-blue-400'}`} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors({...errors, confirmPassword: undefined})}}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg transform active:scale-95"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-slate-300">
                      Already have an account? <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
