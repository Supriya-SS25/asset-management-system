import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetImage(asset: { image_url?: string | null, category?: string, asset_name?: string }): string {
  if (asset.image_url && asset.image_url.trim() !== '') {
    return asset.image_url;
  }

  const cat = (asset.category || '').toLowerCase();
  const name = (asset.asset_name || '').toLowerCase();

  if (cat.includes('printer') || name.includes('printer') || name.includes('pixma')) {
    return "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800";
  }
  
  // Specific Laptop Models
  if (name.includes('macbook') || name.includes('apple') || name.includes('mac')) {
    return "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"; // MacBook image
  }
  if (name.includes('thinkpad') || name.includes('lenovo')) {
    return "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800"; // Lenovo image
  }
  if (name.includes('dell')) {
    return "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&q=80&w=800"; // Dell Laptop image
  }
  
  // General Laptop Fallback
  if (cat.includes('laptop')) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800";
  }

  // Tablets
  if (cat.includes('tablet') || cat.includes('tab') || name.includes('ipad')) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800";
  }

  // Specific Phones
  if (name.includes('iphone')) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800";
  }
  if (name.includes('samsung') || name.includes('galaxy') || name.includes('android')) {
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800"; // Samsung/Android image
  }

  // General Phone Fallback
  if (cat.includes('phone') || cat.includes('mobile')) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800";
  }

  // Monitors & Desktops
  if (cat.includes('monitor') || name.includes('display')) {
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800";
  }
  if (cat.includes('desktop') || name.includes('desktop') || name.includes('pc')) {
    return "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800";
  }

  // Default generic tech
  return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
}
