import React, { useMemo } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Navigation, 
  AlertTriangle,
  Instagram,
  Facebook,
  Share2,
  ExternalLink
} from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { config, theme } = useWorkshop();

  // Calculate if workshop is currently open based on real-time
  const isOpenNow = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeVal = hours * 60 + minutes;

    if (day === 0) {
      // Sunday: closed
      return false;
    } else if (day === 6) {
      // Saturday: 9:00 AM (540m) to 3:00 PM (900m)
      return currentTimeVal >= 540 && currentTimeVal <= 900;
    } else {
      // Weekdays: 8:30 AM (510m) to 7:00 PM (1140m)
      return currentTimeVal >= 510 && currentTimeVal <= 1140;
    }
  }, []);

  return (
    <section id="contacto" className="py-24 bg-neutral-900/60 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
            Visítanos en el Taller
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide">
            Ubicación & Canales de Contacto
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Estamos ubicados en una zona de fácil acceso para motocicletas, con rampa directa y área de recepción técnica techada.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Hours Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Open / Closed Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isOpenNow 
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-heading">
                  {isOpenNow ? 'Taller Abierto en este Momento' : 'Taller Cerrado Ahora'}
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                {isOpenNow ? 'Recepción activa' : 'Abre a las 08:30 AM'}
              </span>
            </div>

            {/* Address & Direct Phone Card with card-hover */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 shadow-xl card-hover transition-all duration-300 hover:border-neutral-700">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white ${theme.textPrimary} shrink-0`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Dirección Física
                  </h4>
                  <p className="text-base font-bold text-white mt-0.5">
                    {config.address}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {config.city}
                  </p>
                  <a
                    href={config.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold mt-2 transition-colors"
                  >
                    <span>Abrir en Google Maps / Waze</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white ${theme.textPrimary} shrink-0`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Teléfono del Taller
                  </h4>
                  <a
                    href={`tel:${config.phone.replace(/\s+/g, '')}`}
                    className="text-base font-bold text-white hover:text-red-400 transition-colors block mt-0.5"
                  >
                    {config.phone}
                  </a>
                  <p className="text-xs text-neutral-400">Línea directa para citas y consultas técnicas</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    WhatsApp Oficial
                  </h4>
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-400 hover:text-emerald-300 transition-colors block mt-0.5"
                  >
                    {config.whatsapp}
                  </a>
                  <p className="text-xs text-neutral-400">Respuestas rápidas y cotizaciones de refacciones</p>
                </div>
              </div>

              {config.email && (
                <div className="pt-4 border-t border-neutral-800/80 flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white ${theme.textPrimary} shrink-0`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Correo Electrónico
                    </h4>
                    <a
                      href={`mailto:${config.email}`}
                      className="text-sm font-medium text-white hover:text-red-400 transition-colors block mt-0.5"
                    >
                      {config.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Hours Table */}
            <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-white font-heading uppercase text-sm font-bold border-b border-neutral-800 pb-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>Horarios de Atención Técnica</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Lunes a Viernes:</span>
                  <span className="font-semibold text-white">{config.hours.weekdays}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Sábados:</span>
                  <span className="font-semibold text-white">{config.hours.saturday}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Domingos:</span>
                  <span className="font-medium text-neutral-500">{config.hours.sunday}</span>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Síguenos:</span>
              {config.socials.instagram && (
                <a
                  href={config.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-pink-400 hover:border-neutral-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.socials.facebook && (
                <a
                  href={config.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-blue-400 hover:border-neutral-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.socials.tiktok && (
                <a
                  href={config.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors text-xs font-bold"
                  aria-label="TikTok"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>

          {/* Right: Interactive Map & Emergency Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Map Wrapper */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 relative h-[380px] sm:h-[450px]">
              <iframe
                title="Ubicación del Taller en Mapa"
                src={config.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Floating Card */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-xl bg-neutral-950/95 backdrop-blur-md border border-neutral-800 shadow-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${theme.bgPrimary}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    {config.name}
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  {config.address}
                </p>
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-md transition-colors flex items-center justify-center gap-1.5 shadow`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Iniciar Ruta GPS</span>
                </a>
              </div>
            </div>

            {/* Emergency & Tow Assistance Card */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase font-heading text-white">
                    ¿Te quedaste varado o accidentado?
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-md">
                    Coordinamos auxilio vial y traslado en camioneta equipada con rampas especiales para no maltratar tu moto.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('🚨 AUXILIO VIAL: Me quedé varado con mi motocicleta y requiero asistencia o traslado.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Solicitar Auxilio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
