import React, { useState, useEffect } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ServiceItem, Appointment } from '../../types';
import { buildWhatsAppUrl, generateAppointmentWhatsAppMessage } from '../../utils/whatsapp';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Wrench, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';

interface AppointmentSectionProps {
  preselectedService?: ServiceItem | null;
  onClearPreselectedService?: () => void;
}

const COMMON_BRANDS = [
  'Yamaha', 'Honda', 'Kawasaki', 'BMW Motorrad', 'KTM', 
  'Suzuki', 'Ducati', 'Triumph', 'Harley-Davidson', 
  'Bajaj / Pulsar', 'Royal Enfield', 'Italika / Vento', 'Otra Marca'
];

const TIME_SLOTS = [
  'Mañana: 09:00 AM - 11:00 AM',
  'Mediodía: 11:30 AM - 02:00 PM',
  'Tarde: 03:00 PM - 05:00 PM',
  'Cierre de Turno: 05:00 PM - 06:30 PM',
];

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ 
  preselectedService,
  onClearPreselectedService 
}) => {
  const { services, config, theme, createAppointment } = useWorkshop();

  const activeServices = services.filter(s => s.active);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    motoBrand: 'Yamaha',
    customBrand: '',
    motoModel: '',
    motoYear: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: TIME_SLOTS[0],
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Sync preselected service from cards if any
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({
        ...prev,
        serviceId: preselectedService.id,
      }));
    } else if (activeServices.length > 0 && !formData.serviceId) {
      setFormData(prev => ({
        ...prev,
        serviceId: activeServices[0].id,
      }));
    }
  }, [preselectedService, activeServices]);

  // Set default min date to today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientPhone.trim() || !formData.motoModel.trim()) {
      return;
    }

    setIsSubmitting(true);

    const chosenService = activeServices.find(s => s.id === formData.serviceId) || activeServices[0];
    const finalBrand = formData.motoBrand === 'Otra Marca' && formData.customBrand.trim()
      ? formData.customBrand.trim()
      : formData.motoBrand;

    // Save appointment into Workshop Context and LocalStorage
    const newAppointment = createAppointment({
      clientName: formData.clientName.trim(),
      clientPhone: formData.clientPhone.trim(),
      clientEmail: formData.clientEmail.trim() || undefined,
      motoBrand: finalBrand,
      motoModel: formData.motoModel.trim(),
      motoYear: formData.motoYear.trim() || undefined,
      serviceId: chosenService ? chosenService.id : 'srv-custom',
      serviceName: chosenService ? chosenService.title : 'Revisión General',
      preferredDate: formData.preferredDate || todayStr,
      preferredTime: formData.preferredTime,
      notes: formData.notes.trim() || undefined,
    });

    setConfirmedAppointment(newAppointment);
    setIsSubmitting(false);

    if (onClearPreselectedService) {
      onClearPreselectedService();
    }
  };

  const handleOpenWhatsApp = (appointment: Appointment) => {
    const message = generateAppointmentWhatsAppMessage(appointment, config);
    const url = buildWhatsAppUrl(config.whatsapp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResetForm = () => {
    setConfirmedAppointment(null);
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      motoBrand: 'Yamaha',
      customBrand: '',
      motoModel: '',
      motoYear: '',
      serviceId: activeServices[0]?.id || '',
      preferredDate: '',
      preferredTime: TIME_SLOTS[0],
      notes: '',
    });
  };

  return (
    <section id="cita" className="py-24 bg-neutral-900/90 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
            Atención Rápida & Sin Filas
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide">
            Agenda la Cita Para Tu Moto
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Completa los datos de tu motocicleta y elige la fecha que mejor te convenga. Al registrarte se generará tu folio de cita y podrás enviarlo directamente a nuestro WhatsApp oficial para confirmación inmediata.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          {confirmedAppointment ? (
            /* Success confirmation card with fluid bounce and fade-in-up */
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in-up">
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-2xl ${theme.bgPrimary} mx-auto flex items-center justify-center text-white shadow-xl ${theme.glow} animate-float`}>
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase font-heading text-white">
                  ¡Cita Registrada en Moto Llantas PTY!
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                  Tu turno ha sido apartado en nuestro taller. Para confirmar la recepción técnica inmediatamente, envíala a nuestro WhatsApp oficial:
                </p>
              </div>

              {/* Ticket Preview Box */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Folio Oficial</span>
                    <span className={`text-base font-bold text-white font-heading ${theme.textPrimary}`}>
                      #{confirmedAppointment.folio}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Taller</span>
                    <span className="text-neutral-300 font-bold">{config.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Cliente:</span>
                    <span className="text-white font-medium">{confirmedAppointment.clientName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Teléfono / WhatsApp:</span>
                    <span className="text-white font-medium">{confirmedAppointment.clientPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Motocicleta:</span>
                    <span className="text-white font-medium">
                      {confirmedAppointment.motoBrand} {confirmedAppointment.motoModel} {confirmedAppointment.motoYear ? `(${confirmedAppointment.motoYear})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Servicio:</span>
                    <span className="text-emerald-400 font-semibold">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Fecha Preferida:</span>
                    <span className="text-white font-medium">{confirmedAppointment.preferredDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Horario:</span>
                    <span className="text-white font-medium">{confirmedAppointment.preferredTime}</span>
                  </div>
                </div>

                {confirmedAppointment.notes && (
                  <div className="pt-2 border-t border-neutral-800/80">
                    <span className="text-neutral-500 text-[11px] block">Observaciones:</span>
                    <span className="text-neutral-300 font-sans text-xs italic">{confirmedAppointment.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleOpenWhatsApp(confirmedAppointment)}
                  className="w-full py-4 text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Enviar Cita al WhatsApp del Taller Ahora</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleResetForm}
                    className="text-xs text-neutral-400 hover:text-white underline decoration-neutral-600 transition-colors"
                  >
                    ← Agendar otra cita
                  </button>
                  <span className="text-xs text-neutral-500">
                    Guardado en sistema interno del taller
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form
              onSubmit={handleSubmit}
              className="bg-neutral-950/90 border border-neutral-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8"
            >
              {/* Form Section 1: Customer Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <User className={`w-4 h-4 ${theme.textPrimary}`} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    1. Datos de Contacto del Propietario
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Roberto Mendoza"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: +52 55 1234 5678"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Correo Electrónico (Opcional, para orden de servicio)
                    </label>
                    <input
                      type="email"
                      placeholder="Ej: roberto@ejemplo.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Motorcycle Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <Wrench className={`w-4 h-4 ${theme.textPrimary}`} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    2. Información de tu Motocicleta
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Marca *
                    </label>
                    <select
                      value={formData.motoBrand}
                      onChange={(e) => setFormData({ ...formData, motoBrand: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-red-500 transition-colors"
                    >
                      {COMMON_BRANDS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {formData.motoBrand === 'Otra Marca' && (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Especifica la Marca *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Benelli, Aprilia..."
                        value={formData.customBrand}
                        onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Modelo Exacto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: MT-09, Duke 390, Pulsar NS200..."
                      value={formData.motoModel}
                      onChange={(e) => setFormData({ ...formData, motoModel: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Año / Cilindrada
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 2022 / 600cc"
                      value={formData.motoYear}
                      onChange={(e) => setFormData({ ...formData, motoYear: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 3: Service & Date Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <Calendar className={`w-4 h-4 ${theme.textPrimary}`} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    3. Servicio Requerido y Horario Deseado
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Selecciona el Servicio Técnico *
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-red-500 transition-colors"
                    >
                      {activeServices.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.title} ({service.currency}{service.priceFrom} - {service.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Fecha Preferida *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-red-500 transition-colors [color-scheme:dark]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Franja Horaria de Recepción *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-red-500 transition-colors"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      ¿Qué síntomas presenta tu moto? (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe si escuchas algún ruido raro, pérdida de potencia, testigo encendido en tablero o detalles específicos..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin anticipo obligatorio. La confirmación es inmediata vía WhatsApp.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} ${theme.glow} rounded-lg transition-all shadow-xl flex items-center justify-center gap-2`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Registrar Cita y Abrir WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
