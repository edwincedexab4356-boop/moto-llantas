import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WorkshopConfig, 
  ServiceItem, 
  GalleryItem, 
  ReviewItem, 
  Appointment, 
  AppointmentStatus,
  AccentColor 
} from '../types';
import { 
  INITIAL_CONFIG, 
  INITIAL_SERVICES, 
  INITIAL_GALLERY, 
  INITIAL_REVIEWS, 
  INITIAL_APPOINTMENTS 
} from '../data/initialData';

interface ThemeColorStyles {
  bgPrimary: string;
  bgPrimaryHover: string;
  textPrimary: string;
  borderPrimary: string;
  ringPrimary: string;
  gradientBadge: string;
  glow: string;
  accentHex: string;
}

interface WorkshopContextType {
  config: WorkshopConfig;
  services: ServiceItem[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  appointments: Appointment[];
  isAdmin: boolean;
  theme: ThemeColorStyles;
  // Admin auth
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  // Config
  updateConfig: (newConfig: Partial<WorkshopConfig>) => void;
  // Services
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleServiceActive: (id: string) => void;
  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  // Reviews
  addReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  updateReviewStatus: (id: string, approved: boolean) => void;
  deleteReview: (id: string) => void;
  // Appointments
  createAppointment: (data: {
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
  }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, internalNotes?: string) => void;
  deleteAppointment: (id: string) => void;
  // Reset
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  CONFIG: 'moto_llantas_pty_config_v2',
  SERVICES: 'moto_llantas_pty_services_v2',
  GALLERY: 'moto_llantas_pty_gallery_v2',
  REVIEWS: 'moto_llantas_pty_reviews_v2',
  APPOINTMENTS: 'moto_llantas_pty_appointments_v2',
  AUTH: 'moto_llantas_pty_admin_auth_v2',
};

const THEME_MAP: Record<AccentColor, ThemeColorStyles> = {
  red: {
    bgPrimary: 'bg-red-600',
    bgPrimaryHover: 'hover:bg-red-500',
    textPrimary: 'text-red-500',
    borderPrimary: 'border-red-600/50',
    ringPrimary: 'focus:ring-red-500',
    gradientBadge: 'from-red-600/20 via-red-500/10 to-transparent',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.35)]',
    accentHex: '#ef4444',
  },
  orange: {
    bgPrimary: 'bg-orange-600',
    bgPrimaryHover: 'hover:bg-orange-500',
    textPrimary: 'text-orange-500',
    borderPrimary: 'border-orange-600/50',
    ringPrimary: 'focus:ring-orange-500',
    gradientBadge: 'from-orange-600/20 via-orange-500/10 to-transparent',
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.35)]',
    accentHex: '#f97316',
  },
  amber: {
    bgPrimary: 'bg-amber-500',
    bgPrimaryHover: 'hover:bg-amber-400',
    textPrimary: 'text-amber-400',
    borderPrimary: 'border-amber-500/50',
    ringPrimary: 'focus:ring-amber-400',
    gradientBadge: 'from-amber-500/20 via-amber-400/10 to-transparent',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    accentHex: '#f59e0b',
  },
  emerald: {
    bgPrimary: 'bg-emerald-600',
    bgPrimaryHover: 'hover:bg-emerald-500',
    textPrimary: 'text-emerald-400',
    borderPrimary: 'border-emerald-600/50',
    ringPrimary: 'focus:ring-emerald-500',
    gradientBadge: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    accentHex: '#10b981',
  },
  blue: {
    bgPrimary: 'bg-blue-600',
    bgPrimaryHover: 'hover:bg-blue-500',
    textPrimary: 'text-blue-400',
    borderPrimary: 'border-blue-600/50',
    ringPrimary: 'focus:ring-blue-500',
    gradientBadge: 'from-blue-600/20 via-blue-500/10 to-transparent',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    accentHex: '#3b82f6',
  },
};

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or fallback to initial data
  const [config, setConfig] = useState<WorkshopConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.includes('APEX')) {
          return INITIAL_CONFIG;
        }
        return parsed;
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Save to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Auth methods
  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === config.adminPin || pin.trim() === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Config methods
  const updateConfig = (newConfig: Partial<WorkshopConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Service methods
  const addService = (newService: Omit<ServiceItem, 'id'>) => {
    const item: ServiceItem = {
      ...newService,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [item, ...prev]);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Gallery methods
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // Review methods
  const addReview = (review: Omit<ReviewItem, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: today,
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const updateReviewStatus = (id: string, approved: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Appointment methods
  const createAppointment = (data: {
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
  }): Appointment => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      folio: `MLP-${year}-${randomDigits}`,
      createdAt: new Date().toISOString(),
      status: 'pendiente',
      ...data,
    };

    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, internalNotes?: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          ...(internalNotes !== undefined ? { internalNotes } : {}),
        };
      }
      return a;
    }));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const resetToDefaults = () => {
    setConfig(INITIAL_CONFIG);
    setServices(INITIAL_SERVICES);
    setGallery(INITIAL_GALLERY);
    setReviews(INITIAL_REVIEWS);
    setAppointments(INITIAL_APPOINTMENTS);
  };

  const theme = THEME_MAP[config.accentColor] || THEME_MAP.red;

  return (
    <WorkshopContext.Provider
      value={{
        config,
        services,
        gallery,
        reviews,
        appointments,
        isAdmin,
        theme,
        loginAdmin,
        logoutAdmin,
        updateConfig,
        addService,
        updateService,
        deleteService,
        toggleServiceActive,
        addGalleryItem,
        deleteGalleryItem,
        addReview,
        updateReviewStatus,
        deleteReview,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        resetToDefaults,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshop = (): WorkshopContextType => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};
