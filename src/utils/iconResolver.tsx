import React from 'react';
import { 
  Wrench, 
  Cpu, 
  Cog, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  Repeat, 
  CircleDot, 
  Activity, 
  Gauge, 
  Disc, 
  Sparkles, 
  Flame, 
  Settings,
  LucideProps 
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Wrench,
  Cpu,
  Cog,
  ShieldAlert,
  Sliders,
  Zap,
  Repeat,
  CircleDot,
  Activity,
  Gauge,
  Disc,
  Sparkles,
  Flame,
  Settings,
};

export const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = ICON_MAP[name] || Wrench;
  return <IconComponent className={className} />;
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
