import { Appointment, WorkshopConfig } from '../types';

export function cleanPhoneNumber(phone: string): string {
  // Strip non-digit characters, but keep leading + if needed for wa.me
  return phone.replace(/[^\d]/g, '');
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function generateAppointmentWhatsAppMessage(
  appointment: Appointment,
  config: WorkshopConfig
): string {
  const lines = [
    `🏍️ *SOLICITUD DE CITA EN ${config.name.toUpperCase()}*`,
    `─────────────────────────`,
    `📋 *Folio de Cita:* #${appointment.folio}`,
    `👤 *Cliente:* ${appointment.clientName}`,
    `📞 *Teléfono:* ${appointment.clientPhone}`,
    appointment.clientEmail ? `📧 *Email:* ${appointment.clientEmail}` : null,
    `🏍️ *Motocicleta:* ${appointment.motoBrand} ${appointment.motoModel} ${appointment.motoYear ? `(${appointment.motoYear})` : ''}`,
    `🔧 *Servicio Solicitado:* ${appointment.serviceName}`,
    `📅 *Fecha Preferida:* ${appointment.preferredDate}`,
    `⏰ *Horario Deseado:* ${appointment.preferredTime}`,
    appointment.notes ? `📝 *Observaciones/Síntomas:* ${appointment.notes}` : null,
    `─────────────────────────`,
    `_Hola, acabo de registrar esta cita a través de su página web. ¿Me confirman si tienen disponibilidad en ese horario? ¡Gracias!_`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateAdminConfirmationMessage(
  appointment: Appointment,
  config: WorkshopConfig
): string {
  return [
    `Hola *${appointment.clientName}*, te saludamos de *${config.name}*. 🏍️`,
    ``,
    `Te confirmamos que tu cita con folio *#${appointment.folio}* para tu *${appointment.motoBrand} ${appointment.motoModel}* ha sido *CONFIRMADA* para el día *${appointment.preferredDate}* a las *${appointment.preferredTime}*.`,
    ``,
    `🔧 *Servicio:* ${appointment.serviceName}`,
    `📍 *Dirección del taller:* ${config.address}, ${config.city}`,
    ``,
    `Por favor llega 5-10 minutos antes para la recepción técnica de tu moto. ¡Te esperamos!`,
  ].join('\n');
}

export function generateAdminReadyMessage(
  appointment: Appointment,
  config: WorkshopConfig
): string {
  return [
    `¡Hola *${appointment.clientName}*! Buenas noticias de *${config.name}* 🏁`,
    ``,
    `El servicio técnico para tu *${appointment.motoBrand} ${appointment.motoModel}* ha sido *COMPLETADO*. Tu moto ya fue probada y se encuentra lista para entrega.`,
    ``,
    `📍 Puedes pasar a recogerla en nuestro horario habitual: ${config.hours.weekdays}.`,
    `¡Gracias por confiar en nosotros!`,
  ].join('\n');
}
