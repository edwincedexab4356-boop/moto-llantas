import React, { useState } from 'react';
import { WorkshopProvider, useWorkshop } from './context/WorkshopContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { GallerySection } from './components/public/GallerySection';
import { AppointmentSection } from './components/public/AppointmentSection';
import { ReviewsSection } from './components/public/ReviewsSection';
import { LocationSection } from './components/public/LocationSection';
import { Footer } from './components/public/Footer';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServiceItem } from './types';

const WorkshopAppContent: React.FC = () => {
  const { isAdmin } = useWorkshop();
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);

  const handleOpenBooking = () => {
    const el = document.getElementById('cita');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setPreselectedService(service);
    const el = document.getElementById('cita');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setView('admin');
    } else {
      setAuthModalOpen(true);
    }
  };

  if (view === 'admin' && isAdmin) {
    return <AdminDashboard onExitAdmin={() => setView('public')} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Public Header */}
      <Navbar 
        onOpenBooking={handleOpenBooking} 
        onOpenAdminAuth={handleOpenAdmin} 
      />

      {/* Main Public Sections */}
      <main className="flex-1">
        <Hero onOpenBooking={handleOpenBooking} />
        <ServicesSection onSelectServiceForBooking={handleSelectServiceForBooking} />
        <AboutSection />
        <GallerySection />
        <AppointmentSection 
          preselectedService={preselectedService} 
          onClearPreselectedService={() => setPreselectedService(null)} 
        />
        <ReviewsSection />
        <LocationSection />
      </main>

      {/* Public Footer */}
      <Footer onOpenAdminAuth={handleOpenAdmin} />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setView('admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <WorkshopProvider>
      <WorkshopAppContent />
    </WorkshopProvider>
  );
}
