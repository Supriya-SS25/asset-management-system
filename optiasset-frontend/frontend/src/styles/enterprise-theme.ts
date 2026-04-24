/**
 * Enterprise Asset Management System Theme
 * Professional color scheme and design tokens
 */

export const enterpriseTheme = {
  // Enterprise Color Palette
  colors: {
    // Primary Colors - Professional Blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Secondary Colors - Professional Gray
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main secondary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Success Colors - Professional Green
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning Colors - Professional Amber
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error Colors - Professional Red
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing - Professional spacing scale
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Component-specific styles
  components: {
    // Header
    header: {
      height: '64px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // Sidebar
    sidebar: {
      width: '280px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
    },
    
    // Cards
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    
    // Buttons
    button: {
      primary: {
        background: '#3b82f6',
        hover: '#2563eb',
        color: '#ffffff',
        borderRadius: '0.375rem',
        padding: '0.625rem 1.25rem',
      },
      secondary: {
        background: '#64748b',
        hover: '#475569',
        color: '#ffffff',
        borderRadius: '0.375rem',
        padding: '0.625rem 1.25rem',
      },
    },
  },
};

// CSS Custom Properties for Tailwind
export const cssVariables = `
  :root {
    --color-primary-50: ${enterpriseTheme.colors.primary[50]};
    --color-primary-500: ${enterpriseTheme.colors.primary[500]};
    --color-primary-600: ${enterpriseTheme.colors.primary[600]};
    --color-secondary-500: ${enterpriseTheme.colors.secondary[500]};
    --color-success-500: ${enterpriseTheme.colors.success[500]};
    --color-warning-500: ${enterpriseTheme.colors.warning[500]};
    --color-error-500: ${enterpriseTheme.colors.error[500]};
    
    --font-family-sans: ${enterpriseTheme.typography.fontFamily.sans.join(', ')};
    --font-size-base: ${enterpriseTheme.typography.fontSize.base};
    
    --spacing-4: ${enterpriseTheme.spacing[4]};
    --spacing-6: ${enterpriseTheme.spacing[6]};
    --spacing-8: ${enterpriseTheme.spacing[8]};
    
    --border-radius-md: ${enterpriseTheme.borderRadius.md};
    --shadow-md: ${enterpriseTheme.shadow.md};
  }
`;

export default enterpriseTheme;
