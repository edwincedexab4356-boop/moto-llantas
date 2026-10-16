import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { MessageSquare, X, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { config } = useWorkshop();
  const [isOpen, setIsOpen] = useState(false);

  const quickOptions = [
    {
      title: 'Consultar Presupuesto o Piezas',
      text: 'Hola, quisiera cotizar refacciones y mano de obra para mi moto.',
      icon: MessageSquare,
      badge: 'Consulta',
    },
    {
      title: 'Agendar Cita Rápida',
      text: 'Hola, me gustaría agendar una cita para servicio de mantenimiento.',
      icon: Calendar,
      badge: 'Citas',
    },
    {
      title: 'Auxilio Vial / Moto Varada',
      text: '¡Hola! Requiero auxilio mecánico o grúa, mi moto se apagó.',
      icon: AlertTriangle,
      badge: 'Urgente',
    },
  ];

  const handleOpenChat = (msg: string) => {
    const url = buildWhatsAppUrl(config.whatsapp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Menu with fluid entrance */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden animate-fade-in-up transition-all duration-300">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{config.name}</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Atención en línea por WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick choices */}
          <div className="p-3 bg-neutral-950 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1 pt-1">
              ¿En qué podemos ayudarte hoy?
            </p>

            {quickOptions.map((opt, idx) => {
              const IconComp = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenChat(opt.text)}
                  className="w-full p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-neutral-950 text-emerald-400 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                        {opt.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">
                        {opt.text}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              );
            })}

            {/* Direct Open Button */}
            <div className="pt-1">
              <button
                onClick={() => handleOpenChat('Hola, me comunico desde su página web.')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 bg-neutral-900 border border-emerald-900/40 rounded-lg text-center"
              >
                Abrir conversación directa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main floating pill/button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:shadow-emerald-900/50 transition-all duration-300 transform hover:scale-105 group"
          aria-label="Abrir WhatsApp del taller"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" />

          <MessageSquare className="w-6 h-6 fill-current relative z-10" />
          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider relative z-10">
            WhatsApp Taller
          </span>
        </button>
      </div>
    </div>
  );
};
