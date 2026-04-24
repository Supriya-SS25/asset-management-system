/**
 * Environment Configuration for AssetTrack Pro Frontend
 * Handles different environments (development, staging, production)
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  frontendUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = process.env.NODE_ENV || 'development';
  
  const configs: Record<string, EnvironmentConfig> = {
    development: {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      frontendUrl: 'http://localhost:3000',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      isDevelopment: true,
      isProduction: false
    },
    staging: {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://assettrack-api-staging.onrender.com',
      frontendUrl: 'https://assettrack-pro-staging.vercel.app',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      isDevelopment: false,
      isProduction: false
    },
    production: {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://assettrack-api.onrender.com',
      frontendUrl: 'https://assettrack-pro.vercel.app',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      isDevelopment: false,
      isProduction: true
    }
  };
  
  return configs[environment] || configs.development;
};

export const config = getEnvironmentConfig();

// Export individual config properties for convenience
export const {
  apiBaseUrl,
  frontendUrl,
  supabaseUrl,
  supabaseAnonKey,
  isDevelopment,
  isProduction
} = config;

// Environment-specific utilities
export const isDevelopmentMode = () => config.isDevelopment;
export const isProductionMode = () => config.isProduction;
export const getApiUrl = (endpoint: string) => `${config.apiBaseUrl}${endpoint}`;
export const getSupabaseConfig = () => ({
  url: config.supabaseUrl,
  anonKey: config.supabaseAnonKey
});
