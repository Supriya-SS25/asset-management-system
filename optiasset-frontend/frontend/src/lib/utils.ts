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
  if (cat.includes('laptop') || name.includes('macbook') || name.includes('thinkpad')) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800";
  }
  if (cat.includes('tablet') || cat.includes('tab') || name.includes('ipad')) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800";
  }
  if (cat.includes('phone') || cat.includes('mobile') || name.includes('iphone')) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800";
  }
  if (cat.includes('monitor') || name.includes('display')) {
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800";
  }
  if (cat.includes('desktop') || name.includes('desktop') || name.includes('pc')) {
    return "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800";
  }

  // Default generic tech
  return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
}
