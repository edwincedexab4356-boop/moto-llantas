import React, { useState, useMemo } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { ServiceIcon } from '../../utils/iconResolver';
import { 
  Clock, 
  Check, 
  Search, 
  Calendar, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

const CATEGORIES: { label: string; value: 'all' | ServiceCategory }[] = [
  { label: 'Todos los Servicios', value: 'all' },
  { label: 'Mantenimiento & Aceite', value: 'mantenimiento' },
  { label: 'Diagnóstico & ECU', value: 'diagnostico' },
  { label: 'Motor & Afinación', value: 'motor' },
  { label: 'Frenos & ABS', value: 'frenos' },
  { label: 'Suspensión', value: 'suspension' },
  { label: 'Sistema Eléctrico', value: 'electricidad' },
  { label: 'Transmisión & Cadena', value: 'transmision' },
  { label: 'Llantas & Balanceo', value: 'llantas' },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const { services, config, theme } = useWorkshop();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only active services for the public page
  const filteredServices = useMemo(() => {
    return services
      .filter(s => s.active)
      .filter(service => {
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        const matchesSearch = 
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
  }, [services, selectedCategory, searchQuery]);

  return (
    <section id="servicios" className="py-24 bg-neutral-950 relative border-t border-neutral-900">
      {/* Decorative gradient glow */}
      <div 
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentHex }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
            Servicios Especializados
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide">
            Llantas, Mantenimiento & Mecánica Especializada
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            En Moto Llantas PTY contamos con desarmadoras neumáticas de última generación para no rayar tus rines, balanceo dinámico y servicio técnico multimarca.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="space-y-4 mb-10">
          {/* Search bar with smooth focus */}
          <div className="max-w-md mx-auto relative group">
            <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-red-400 transition-colors duration-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar llantas, frenos, aceite, cadena, balanceo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Filter Pills with smooth sliding and active transitions */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 transform active:scale-95 border ${
                    isSelected
                      ? `${theme.bgPrimary} text-white border-transparent shadow-lg ${theme.glow}`
                      : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700 hover:bg-neutral-800/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid with smooth fade transition */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800/80 p-8 animate-fade-in">
            <Filter className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-300">No encontramos servicios con ese criterio</h3>
            <p className="text-sm text-neutral-500 mt-1 mb-4">
              Prueba con otro término de búsqueda o categoría.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg transition-transform active:scale-95`}
            >
              Ver todos los servicios
            </button>
          </div>
        ) : (
          <div key={`${selectedCategory}-${searchQuery}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-neutral-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Image Header with Badge */}
                <div className="relative h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-90 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />

                  {/* Icon floating */}
                  <div className={`absolute top-4 left-4 p-2.5 rounded-lg ${theme.bgPrimary} text-white shadow-lg`}>
                    <ServiceIcon name={service.iconName} className="w-5 h-5" />
                  </div>

                  {/* Popular pill */}
                  {service.popular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-neutral-950 text-[11px] font-bold tracking-wider uppercase shadow-md">
                      <Sparkles className="w-3 h-3 fill-current" />
                      Más Solicitado
                    </div>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-4 px-3 py-1 rounded bg-neutral-950/90 backdrop-blur-md border border-neutral-800 text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Desde</span>
                    <span className="text-lg font-bold font-heading text-white">
                      {service.currency}{service.priceFrom}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Time estimate */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Tiempo estimado: <strong className="text-neutral-300">{service.estimatedTime}</strong></span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-heading uppercase text-white group-hover:text-red-400 transition-colors leading-snug">
                      {service.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Checklist */}
                    <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        ¿Qué incluye este trabajo?
                      </p>
                      <ul className="space-y-1.5">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                            <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${theme.textPrimary}`} />
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center gap-2">
                    <button
                      onClick={() => onSelectServiceForBooking(service)}
                      className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg transition-all flex items-center justify-center gap-2 shadow`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Agendar Cita</span>
                    </button>

                    <a
                      href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hola, me interesa solicitar información sobre el servicio de: ${service.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-neutral-400 hover:text-emerald-400 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition-colors"
                      title="Consultar por WhatsApp"
                      aria-label="Consultar por WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold font-heading uppercase text-white">
              ¿Tu moto presenta una falla rara o requiere un trabajo a medida?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Realizamos revisiones minuciosas, proyectos especiales de cableado, adaptaciones y preparación de motores. Contáctanos para un presupuesto exacto.
            </p>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hola, mi moto tiene una falla que no aparece en la lista de servicios. ¿Podrían revisarla?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-100 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Consultar Falla Especial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
