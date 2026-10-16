import React from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { Wrench, Phone, MessageSquare, MapPin, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminAuth }) => {
  const { config, isAdmin, theme } = useWorkshop();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-2xl font-extrabold tracking-tight font-heading uppercase text-white">
                  MOTO
                </span>
                <span className={`text-2xl font-extrabold tracking-tight font-heading uppercase ${theme.textPrimary}`}>
                  LLANTAS
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono">
                  PTY
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mt-1">
                {config.tagline}
              </p>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {config.description}
            </p>
            <div className="pt-2 text-[11px] text-neutral-400">
              Venta de llantas multimarca, balanceo dinámico & taller especializado en Panamá.
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Secciones Rápidas
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">Nuestros Servicios</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">Sobre el Taller</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">Galería de Trabajos</a>
              </li>
              <li>
                <a href="#cita" className="hover:text-white transition-colors">Solicitar una Cita</a>
              </li>
              <li>
                <a href="#opiniones" className="hover:text-white transition-colors">Opiniones de Clientes</a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">Ubicación & Horarios</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Direct Channels */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Contacto Directo
            </h4>
            <div className="space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{config.address}, {config.city}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`tel:${config.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {config.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {config.whatsapp}
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Business Hours & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Horario del Taller
            </h4>
            <div className="space-y-1 text-xs">
              <p className="text-neutral-300">Lun - Vie: <span className="text-white font-medium">{config.hours.weekdays}</span></p>
              <p className="text-neutral-300">Sábados: <span className="text-white font-medium">{config.hours.saturday}</span></p>
              <p className="text-neutral-400">Domingos: <span className="text-neutral-500 font-medium">{config.hours.sunday}</span></p>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <button
                onClick={onOpenAdminAuth}
                className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{isAdmin ? 'Ingresar al Panel de Control' : 'Acceso Administrador'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
          <p>© {new Date().getFullYear()} {config.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Plataforma Digital de Alto Rendimiento para Talleres Mecánicos
          </p>
        </div>
      </div>
    </footer>
  );
};
