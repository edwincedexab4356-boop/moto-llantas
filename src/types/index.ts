export type AccentColor = 'red' | 'orange' | 'amber' | 'emerald' | 'blue';

export type ServiceCategory = 
  | 'mantenimiento' 
  | 'motor' 
  | 'frenos' 
  | 'electricidad' 
  | 'suspension' 
  | 'llantas' 
  | 'transmision' 
  | 'diagnostico' 
  | 'personalizado';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  priceFrom: number;
  currency: string;
  estimatedTime: string;
  shortDesc: string;
  features: string[];
  popular?: boolean;
  active: boolean;
  iconName: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  motoModel: string;
  category: string;
  description: string;
  imageUrl: string;
  tag: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  moto: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  approved: boolean;
  verified: boolean;
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'en_taller' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  folio: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  motoBrand: string;
  motoModel: string;
  motoYear?: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: AppointmentStatus;
  internalNotes?: string;
}

export interface WorkshopConfig {
  name: string;
  tagline: string;
  logoText: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  mapEmbedUrl: string;
  accentColor: AccentColor;
  adminPin: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube?: string;
  };
  hero: {
    badge: string;
    title: string;
    highlightWord: string;
    subtitle: string;
    bgImage: string;
  };
  stats: {
    yearsExperience: number;
    bikesRepaired: number;
    satisfactionRate: number;
    expertMechanics: number;
  };
}
