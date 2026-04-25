export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In a real production Next.js app, consider httponly cookies. 
  // For this local test environment, we'll retrieve the token from localStorage.
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Debug: Log API call details
  console.log("🌐 API Debug - Making request:");
  console.log("Endpoint:", `${API_BASE_URL}${endpoint}`);
  console.log("Token available:", !!token);
  console.log("Token value:", token ? `${token.substring(0, 20)}...` : null);

  const headers = new Headers(options.headers || {});
  headers.append("Content-Type", "application/json");

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
    console.log("✅ Authorization header added");
  } else {
    console.log("❌ No token found - request may fail");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log("📡 API Response status:", response.status);
  console.log("📡 API Response ok:", response.ok);

  if (response.status === 401) {
    console.log("❌ 401 Unauthorized - clearing auth and redirecting");
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
  }

  return response;
}

export const api = {
  getAssets: async () => {
    const res = await fetchWithAuth('/assets');
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },
  createAsset: async (data: any) => {
    const res = await fetchWithAuth('/assets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create asset');
    return res.json();
  },
  deleteAsset: async (id: number) => {
    const res = await fetchWithAuth(`/assets/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete asset');
    return res.json();
  }
};
