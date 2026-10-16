import React from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  Wrench, 
  CheckCircle2, 
  ChevronRight,
  Gauge
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { config, theme } = useWorkshop();

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-950 pt-12 pb-20">
      {/* Background Image with Dark & Industrial Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={config.hero.bgImage}
          alt="Taller de motocicletas especializado"
          className="w-full h-full object-cover object-center filter brightness-40 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        {/* Subtle mesh & glow */}
        <div className="absolute inset-0 bg-carbon opacity-60 mix-blend-overlay" />
        <div 
          className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.accentHex }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fade-in">
        <div className="max-w-3xl space-y-6">
          {/* Badge with gentle float & pulse */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-700 bg-neutral-900/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-neutral-300 shadow-md hover:border-neutral-500 transition-colors">
            <span className={`w-2.5 h-2.5 rounded-full ${theme.bgPrimary} animate-pulse`} />
            <span className="text-white font-mono">{config.hero.badge}</span>
          </div>

          {/* Main Headline with smooth fade in */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase font-heading leading-tight animate-fade-in-up">
            {config.hero.title}{' '}
            <span className={`relative inline-block ${theme.textPrimary}`}>
              {config.hero.highlightWord}
              <span className={`absolute -bottom-2 left-0 w-full h-1 ${theme.bgPrimary} rounded-full opacity-80`} />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
            {config.hero.subtitle}
          </p>

          {/* Fast Features Badges with smooth hover lift */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs sm:text-sm text-neutral-300 font-medium">
            <div className="flex items-center gap-1.5 bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-0.5">
              <CheckCircle2 className={`w-4 h-4 ${theme.textPrimary}`} />
              <span>Instalación & Balanceo Computarizado</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-0.5">
              <CheckCircle2 className={`w-4 h-4 ${theme.textPrimary}`} />
              <span>Garantía por escrito</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-0.5">
              <CheckCircle2 className={`w-4 h-4 ${theme.textPrimary}`} />
              <span>Diagnóstico Computarizado</span>
            </div>
          </div>

          {/* Action Buttons with high-energy transitions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onOpenBooking}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} ${theme.glow} rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 flex items-center justify-center gap-3 shadow-xl group`}
            >
              <Calendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Solicitar una Cita</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hola Moto Llantas PTY, me comunico desde su página web para cotizar llantas o servicio para mi moto.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-neutral-100 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 flex items-center justify-center gap-3 group shadow-md"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>

          {/* Quick Notice */}
          <p className="text-xs text-neutral-400 flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Atención personalizada de lunes a sábado en Ciudad de Panamá.
          </p>
        </div>

        {/* Stats Grid Bar with smooth card-hover and glowing borders */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 shadow-2xl">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950/40 border border-transparent hover:border-neutral-700 transition-all duration-300 card-hover">
            <div className={`p-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 ${theme.textPrimary} shadow`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-white">
                +{config.stats.yearsExperience}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Años de Trayectoria</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950/40 border border-transparent hover:border-neutral-700 transition-all duration-300 card-hover">
            <div className={`p-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 ${theme.textPrimary} shadow`}>
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-white">
                +{config.stats.bikesRepaired.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Motos & Llantas Instaladas</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950/40 border border-transparent hover:border-neutral-700 transition-all duration-300 card-hover">
            <div className={`p-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 ${theme.textPrimary} shadow`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {config.stats.satisfactionRate}%
              </div>
              <div className="text-xs text-neutral-400 font-medium">Clientes Satisfechos</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950/40 border border-transparent hover:border-neutral-700 transition-all duration-300 card-hover">
            <div className={`p-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 ${theme.textPrimary} shadow`}>
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {config.stats.expertMechanics}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Técnicos Especialistas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
