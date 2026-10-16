import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  Wrench, 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  Lock, 
  MessageSquare,
  MapPin,
  Clock
} from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdminAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdminAuth }) => {
  const { config, isAdmin, theme } = useWorkshop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Opiniones', href: '#opiniones' },
    { name: 'Ubicación', href: '#contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      {/* Top micro bar for quick contact & hours */}
      <div className="hidden md:block border-b border-neutral-900 bg-neutral-900/60 px-4 py-1.5 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {config.address}, {config.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              Lun - Vie: {config.hours.weekdays} | Sáb: {config.hours.saturday}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${config.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-neutral-400" />
              {config.phone}
            </a>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onOpenAdminAuth}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              title="Acceso Administración"
            >
              <Lock className="w-3 h-3" />
              {isAdmin ? 'Panel Admin (Activo)' : 'Modo Administrador'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo: Clean modern typographic identity without generic icon box */}
          <a href="#inicio" className="flex items-center gap-2 group py-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading uppercase text-white transition-colors duration-300 group-hover:text-neutral-100">
                  MOTO
                </span>
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-heading uppercase ${theme.textPrimary} transition-all duration-300 group-hover:drop-shadow-[0_0_12px_${theme.accentHex}88]`}>
                  LLANTAS
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700/80 text-white font-mono shadow-inner ml-0.5 group-hover:border-neutral-500 transition-colors">
                  PTY
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium tracking-wider uppercase mt-1 transition-colors group-hover:text-neutral-300">
                {config.tagline}
              </p>
            </div>
          </a>

          {/* Desktop Nav with smooth hover transitions */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-wider font-bold text-neutral-400 hover:text-white transition-all duration-300 relative py-2 group/link"
              >
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${theme.bgPrimary} rounded-full transition-all duration-300 ease-out group-hover/link:w-full`} />
              </a>
            ))}
          </nav>

          {/* Action CTAs with smooth lift and glow */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hola Moto Llantas PTY, me gustaría cotizar unas llantas o un servicio para mi moto.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenBooking}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg shadow-lg ${theme.glow} transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-md flex items-center justify-center gap-2`}
            >
              <Calendar className="w-4 h-4" />
              Solicitar Cita Ahora
            </button>

            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Contactar por WhatsApp
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminAuth();
              }}
              className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              {isAdmin ? 'Acceder al Panel Admin' : 'Acceso Administrador del Taller'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
