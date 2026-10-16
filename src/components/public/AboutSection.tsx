import React from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  ShieldCheck, 
  Wrench, 
  Video, 
  PackageOpen, 
  FileCheck, 
  CheckCircle,
  Cpu,
  BadgeCheck
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { config, theme } = useWorkshop();

  const commitments = [
    {
      icon: FileCheck,
      title: 'Presupuesto Transparente y Sin Sorpresas',
      description: 'Te entregamos una cotización previa detallada. Jamás realizamos un cambio de repuesto o costo extra sin tu autorización explícita.',
    },
    {
      icon: Video,
      title: 'Evidencia en Foto y Video por WhatsApp',
      description: 'Durante el desarme y reparación te compartimos fotos y videos del estado de las piezas para que tengas 100% de certeza del trabajo.',
    },
    {
      icon: PackageOpen,
      title: 'Devolución de Piezas Reemplazadas',
      description: 'Te entregamos en una caja todos los filtros, bujías, pastillas y repuestos viejos que fueron cambiados durante el servicio.',
    },
    {
      icon: ShieldCheck,
      title: 'Garantía por Escrito en Mano de Obra',
      description: 'Respaldamos cada intervención mecánica con garantía documentada por escrito para que viajes con total tranquilidad.',
    },
  ];

  const brands = [
    'Yamaha', 'Honda', 'Kawasaki', 'BMW Motorrad', 
    'Ducati', 'KTM', 'Suzuki', 'Triumph', 
    'Harley-Davidson', 'Bajaj', 'Royal Enfield', 'Husqvarna'
  ];

  return (
    <section id="nosotros" className="py-24 bg-neutral-900/60 relative overflow-hidden border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid: Story & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text & Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
              Sobre Nuestro Taller
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide leading-tight">
              Ingeniería, Pasión & Mecánica de Precisión
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              En <strong className="text-white">{config.name}</strong> entendemos que una motocicleta no es solo un medio de transporte: es libertad, adrenalina y precisión sobre dos ruedas. Por eso tratamos cada moto con el mismo rigor y pasión como si fuera la nuestra.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Contamos con más de {config.stats.yearsExperience} años de trayectoria en el sector. Nuestro equipo se capacita continuamente en las últimas tecnologías de inyección electrónica (EFI), sistemas de frenado ABS/IMU y suspensiones avanzadas para ofrecer una solución confiable y definitiva.
            </p>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                <CheckCircle className={`w-4 h-4 ${theme.textPrimary} shrink-0`} />
                <span>Herramientas neumáticas y de torque</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                <CheckCircle className={`w-4 h-4 ${theme.textPrimary} shrink-0`} />
                <span>Escáner multimarca OBD-II actualizado</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                <CheckCircle className={`w-4 h-4 ${theme.textPrimary} shrink-0`} />
                <span>Fluidos sintéticos de grado de competición</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                <CheckCircle className={`w-4 h-4 ${theme.textPrimary} shrink-0`} />
                <span>Recepción técnica detallada con inventario</span>
              </div>
            </div>

            {/* Quote badge */}
            <div className="p-4 rounded-lg bg-neutral-950/80 border-l-4 border-red-500 text-xs sm:text-sm italic text-neutral-300">
              «No creemos en soluciones provisionales ni remiendos. Aplicamos manual de taller de fábrica en cada torque y ajuste.»
            </div>
          </div>

          {/* Right: Modern Collage of Workshop & Team */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85"
                alt="Mecánico especializado en motocicleta de alta cilindrada"
                className="w-full h-[420px] object-cover filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />

              {/* Floating Certification Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${theme.bgPrimary} text-white shrink-0`}>
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading uppercase">
                    Técnicos Certificados en Sistemas EFI & ABS
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Capacitación homologada para marcas europeas y japonesas.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Floating Image */}
            <div className="hidden sm:block absolute -top-8 -right-8 w-44 h-44 rounded-xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80"
                alt="Detalle de motor desarmado"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase font-heading text-white">
              Nuestro Compromiso de Calidad
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Las 4 razones por las que los motociclistas en Panamá confían en Moto Llantas PTY.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 space-y-3 group card-hover shadow-lg"
                >
                  <div className={`w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center ${theme.textPrimary} group-hover:scale-110 group-hover:shadow-[0_0_15px_${theme.accentHex}44] transition-all duration-300 shadow`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold font-heading uppercase text-white group-hover:text-red-400 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brands Supported Strip */}
        <div className="mt-20 pt-10 border-t border-neutral-800/80 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-6">
            Marcas oficiales de llantas y motos atendidas
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              'Pirelli', 'Michelin', 'Metzeler', 'Dunlop', 'Bridgestone',
              'Yamaha', 'Honda', 'Kawasaki', 'BMW Motorrad', 'KTM', 
              'Suzuki', 'Ducati', 'Bajaj / Pulsar', 'Triumph'
            ].map((brand) => (
              <span
                key={brand}
                className="px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800/90 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
