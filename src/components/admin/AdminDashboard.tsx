import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  Appointment, 
  AppointmentStatus, 
  ServiceItem, 
  GalleryItem, 
  ReviewItem, 
  AccentColor, 
  ServiceCategory 
} from '../../types';
import { ServiceIcon, AVAILABLE_ICONS } from '../../utils/iconResolver';
import { 
  buildWhatsAppUrl, 
  generateAdminConfirmationMessage, 
  generateAdminReadyMessage 
} from '../../utils/whatsapp';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  Image as ImageIcon, 
  Star, 
  Settings, 
  LogOut, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  Phone, 
  MapPin, 
  Palette, 
  Search, 
  Save, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

type TabType = 'resumen' | 'citas' | 'servicios' | 'galeria' | 'resenas' | 'ajustes';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { 
    config, 
    services, 
    gallery, 
    reviews, 
    appointments, 
    logoutAdmin,
    updateConfig,
    addService,
    updateService,
    deleteService,
    toggleServiceActive,
    addGalleryItem,
    deleteGalleryItem,
    addReview,
    updateReviewStatus,
    deleteReview,
    updateAppointmentStatus,
    deleteAppointment,
    resetToDefaults,
    theme
  } = useWorkshop();

  const [activeTab, setActiveTab] = useState<TabType>('resumen');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Filter states ---
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('todos');

  // --- Modal states for Services ---
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    category: 'mantenimiento',
    priceFrom: 50,
    currency: '$',
    estimatedTime: '2 horas',
    shortDesc: '',
    features: ['Inspección completa', 'Garantía por escrito'],
    popular: false,
    active: true,
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
  });
  const [tempFeatureText, setTempFeatureText] = useState('');

  // --- Modal states for Gallery ---
  const [isNewGalleryModalOpen, setIsNewGalleryModalOpen] = useState(false);
  const [newGalleryForm, setNewGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    motoModel: '',
    category: 'Mantenimiento General',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=85',
    tag: 'Moto Deportiva',
  });

  // --- Modal states for Reviews ---
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    author: '',
    moto: '',
    rating: 5,
    comment: '',
    verified: true,
  });

  // --- Config Form State ---
  const [configForm, setConfigForm] = useState(config);

  // Sync config form if config changes
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(configForm);
    showNotification('Ajustes del taller guardados exitosamente');
  };

  // Appointments filtering
  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = appointmentFilter === 'todos' || apt.status === appointmentFilter;
    const matchesSearch = 
      apt.clientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.motoModel.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.folio.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.clientPhone.includes(appointmentSearch);
    return matchesFilter && matchesSearch;
  });

  // Statistics calculation
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pendiente').length;
  const inWorkshopCount = appointments.filter(a => a.status === 'en_taller').length;
  const completedCount = appointments.filter(a => a.status === 'completada').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmada').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
                MOTO
              </span>
              <span className={`text-xl sm:text-2xl font-black font-heading uppercase ${theme.textPrimary}`}>
                LLANTAS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-white font-bold ml-1">
                PTY ADMIN
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Panel de Control y Gestión del Taller
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
            title="Ver sitio web como visitante"
          >
            <Eye className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Ver Sitio Web</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              onExitAdmin();
            }}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 bg-neutral-950 hover:bg-red-950/40 border border-red-900/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Cerrar Sesión de Administración"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-neutral-900/60 border-b md:border-b-0 md:border-r border-neutral-800 p-4 space-y-1">
          <div className="text-[11px] uppercase font-bold tracking-widest text-neutral-500 px-3 py-2">
            Navegación
          </div>

          <button
            onClick={() => setActiveTab('resumen')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'resumen'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Resumen / KPI</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citas')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'citas'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Citas & Clientes</span>
            </div>
            {pendingAppointments > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-neutral-950 font-bold">
                {pendingAppointments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('servicios')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'servicios'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4" />
              <span>Servicios & Precios</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('galeria')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'galeria'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Galería de Trabajos</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              {gallery.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resenas')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'resenas'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>Opiniones Reales</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ajustes')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'ajustes'
                ? `${theme.bgPrimary} text-white shadow-md`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Ajustes del Taller</span>
            </div>
          </button>

          {/* Quick theme accent indicator */}
          <div className="pt-6 px-3">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <span className="text-neutral-500 uppercase font-bold tracking-wider block">Color Activo:</span>
              <div className="flex items-center gap-2 text-white font-semibold capitalize">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: theme.accentHex }}
                />
                <span>{config.accentColor} Racing</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: RESUMEN / DASHBOARD */}
          {activeTab === 'resumen' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-heading uppercase text-white">
                  Resumen Operativo del Taller
                </h2>
                <p className="text-xs text-neutral-400">
                  Monitorea las solicitudes de servicio, el estado de las motos en taller y la actividad reciente.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    Total Citas Registradas
                  </span>
                  <div className="text-3xl font-bold font-heading text-white">
                    {totalAppointments}
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Historial guardado en el sistema
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    Pendientes de Confirmar
                  </span>
                  <div className="text-3xl font-bold font-heading text-amber-300">
                    {pendingAppointments}
                  </div>
                  <span className="text-[11px] text-amber-400/80">
                    Requieren respuesta al cliente
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-1">
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    En Taller / En Proceso
                  </span>
                  <div className="text-3xl font-bold font-heading text-blue-300">
                    {inWorkshopCount}
                  </div>
                  <span className="text-[11px] text-blue-400/80">
                    Motos en rampas de mecánica
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    Completadas con Éxito
                  </span>
                  <div className="text-3xl font-bold font-heading text-emerald-300">
                    {completedCount}
                  </div>
                  <span className="text-[11px] text-emerald-400/80">
                    Listas para entrega o entregadas
                  </span>
                </div>
              </div>

              {/* Recent Appointments Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading uppercase text-white">
                    Últimas Solicitudes de Cita Recibidas
                  </h3>
                  <button
                    onClick={() => setActiveTab('citas')}
                    className={`text-xs font-semibold uppercase tracking-wider ${theme.textPrimary} hover:underline`}
                  >
                    Ver todas las citas →
                  </button>
                </div>

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div className="divide-y divide-neutral-800">
                    {appointments.slice(0, 4).map((apt) => (
                      <div key={apt.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-red-400">
                              #{apt.folio}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {apt.clientName}
                            </span>
                            <span className="text-xs text-neutral-400">
                              • {apt.motoBrand} {apt.motoModel}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 font-medium">
                            {apt.serviceName}
                          </p>
                          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                            <span>Fecha: {apt.preferredDate}</span>
                            <span>Horario: {apt.preferredTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                            apt.status === 'pendiente' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' :
                            apt.status === 'confirmada' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/30' :
                            apt.status === 'en_taller' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/30' :
                            apt.status === 'completada' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30' :
                            'bg-red-400/10 text-red-400 border border-red-400/30'
                          }`}>
                            {apt.status.replace('_', ' ')}
                          </span>

                          <button
                            onClick={() => {
                              const msg = generateAdminConfirmationMessage(apt, config);
                              const url = buildWhatsAppUrl(apt.clientPhone, msg);
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }}
                            className="p-2 text-emerald-400 hover:text-emerald-300 bg-neutral-950 hover:bg-neutral-800 rounded border border-neutral-800 transition-colors"
                            title="Confirmar por WhatsApp con el cliente"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Workshop Info Review */}
              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
                    WhatsApp Configurado
                  </span>
                  <span className="text-sm font-mono text-emerald-400 font-bold">
                    {config.whatsapp}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
                    Dirección Registrada
                  </span>
                  <span className="text-sm text-neutral-300">
                    {config.address}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
                    Servicios Activos
                  </span>
                  <span className="text-sm text-white font-bold">
                    {services.filter(s => s.active).length} de {services.length} disponibles
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GESTIÓN DE CITAS (APPOINTMENTS CRM) */}
          {activeTab === 'citas' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading uppercase text-white">
                    Control y Seguimiento de Citas
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Administra las solicitudes, actualiza estados en tiempo real y notifica a los clientes vía WhatsApp.
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                <div className="w-full sm:w-80 relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, moto o folio..."
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['todos', 'pendiente', 'confirmada', 'en_taller', 'completada', 'cancelada'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAppointmentFilter(status)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                        appointmentFilter === status
                          ? `${theme.bgPrimary} text-white`
                          : 'bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/40 rounded-xl border border-neutral-800 text-neutral-500 text-sm">
                  No se encontraron citas con los filtros aplicados.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4 hover:border-neutral-700 transition-all shadow-md"
                    >
                      {/* Top Row: Folio, Status, Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-red-400">
                            #{apt.folio}
                          </span>
                          <span className="text-xs text-neutral-500">
                            Registrada el {new Date(apt.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 uppercase font-semibold">
                            Estado:
                          </span>
                          <select
                            value={apt.status}
                            onChange={(e) => {
                              updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus);
                              showNotification(`Estado actualizado a ${e.target.value}`);
                            }}
                            className={`text-xs font-bold uppercase rounded px-2.5 py-1 border transition-colors ${
                              apt.status === 'pendiente' ? 'bg-amber-950/60 border-amber-700 text-amber-300' :
                              apt.status === 'confirmada' ? 'bg-blue-950/60 border-blue-700 text-blue-300' :
                              apt.status === 'en_taller' ? 'bg-purple-950/60 border-purple-700 text-purple-300' :
                              apt.status === 'completada' ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' :
                              'bg-neutral-950 border-neutral-700 text-neutral-400'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="en_taller">En Taller</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>

                          <button
                            onClick={() => {
                              if (confirm(`¿Deseas eliminar permanentemente la cita #${apt.folio}?`)) {
                                deleteAppointment(apt.id);
                                showNotification('Cita eliminada');
                              }
                            }}
                            className="p-1.5 text-neutral-500 hover:text-red-400 rounded transition-colors ml-2"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Data Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-neutral-500 uppercase font-bold block mb-1">
                            Cliente & Contacto
                          </span>
                          <p className="text-sm font-bold text-white">{apt.clientName}</p>
                          <a
                            href={`tel:${apt.clientPhone.replace(/\s+/g, '')}`}
                            className="text-neutral-400 hover:text-white flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3 text-neutral-500" />
                            <span>{apt.clientPhone}</span>
                          </a>
                          {apt.clientEmail && (
                            <span className="text-neutral-500 text-[11px] block">{apt.clientEmail}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-neutral-500 uppercase font-bold block mb-1">
                            Motocicleta & Servicio
                          </span>
                          <p className="text-sm font-bold text-white">
                            {apt.motoBrand} {apt.motoModel} {apt.motoYear ? `(${apt.motoYear})` : ''}
                          </p>
                          <p className="text-emerald-400 font-medium mt-0.5">{apt.serviceName}</p>
                          {apt.notes && (
                            <p className="text-neutral-400 text-[11px] mt-1 italic">
                              «{apt.notes}»
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-neutral-500 uppercase font-bold block mb-1">
                            Fecha y Horario Agendado
                          </span>
                          <div className="flex items-center gap-1.5 text-neutral-200">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="font-semibold">{apt.preferredDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-400 mt-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{apt.preferredTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Internal Mechanics Notes */}
                      <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Notas internas del mecánico (ej: piezas requeridas, diagnóstico preliminar)..."
                            defaultValue={apt.internalNotes || ''}
                            onBlur={(e) => {
                              updateAppointmentStatus(apt.id, apt.status, e.target.value);
                              showNotification('Notas internas guardadas');
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                          />
                        </div>

                        {/* WhatsApp Notification Shortcuts */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              const msg = generateAdminConfirmationMessage(apt, config);
                              const url = buildWhatsAppUrl(apt.clientPhone, msg);
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }}
                            className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-emerald-800/60 text-emerald-400 hover:text-emerald-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Enviar Confirmación WhatsApp</span>
                          </button>

                          <button
                            onClick={() => {
                              const msg = generateAdminReadyMessage(apt, config);
                              const url = buildWhatsAppUrl(apt.clientPhone, msg);
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }}
                            className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <span>Avisar Moto Lista</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICIOS Y PRECIOS */}
          {activeTab === 'servicios' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading uppercase text-white">
                    Catálogo de Servicios y Tarifas
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Agrega, edita los precios, desactiva o crea nuevos servicios mecánicos para tu taller.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewServiceModalOpen(true)}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg flex items-center gap-2 shadow`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Servicio</span>
                </button>
              </div>

              {/* Services Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-5 rounded-xl bg-neutral-900 border transition-all ${
                      service.active ? 'border-neutral-800' : 'border-neutral-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${theme.bgPrimary} text-white`}>
                          <ServiceIcon name={service.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold font-heading uppercase text-white">
                              {service.title}
                            </h4>
                            {service.popular && (
                              <span className="text-[10px] bg-amber-400 text-neutral-950 font-bold px-1.5 py-0.2 rounded">
                                DESTACADO
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400 font-mono">
                            {service.category} • {service.estimatedTime}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block">Tarifa:</span>
                        <span className="text-lg font-bold font-heading text-white">
                          {service.currency}{service.priceFrom}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            toggleServiceActive(service.id);
                            showNotification(service.active ? 'Servicio ocultado' : 'Servicio activado');
                          }}
                          className={`text-xs px-2.5 py-1 rounded font-semibold ${
                            service.active 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                          }`}
                        >
                          {service.active ? 'Activo en Web' : 'Oculto'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar servicio "${service.title}"?`)) {
                              deleteService(service.id);
                              showNotification('Servicio eliminado');
                            }
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALERÍA DE TRABAJOS */}
          {activeTab === 'galeria' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading uppercase text-white">
                    Galería de Proyectos Realizados
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Administra las fotografías de motos reparadas y proyectos entregados para inspirar a nuevos clientes.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewGalleryModalOpen(true)}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg flex items-center gap-2 shadow`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Subir Fotografía</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 space-y-3">
                    <div className="relative h-48 bg-neutral-950">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] font-bold text-white uppercase font-mono">
                        {item.motoModel}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold font-heading uppercase text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-neutral-800 flex justify-end">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar imagen "${item.title}"?`)) {
                              deleteGalleryItem(item.id);
                              showNotification('Foto eliminada');
                            }
                          }}
                          className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESEÑAS */}
          {activeTab === 'resenas' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading uppercase text-white">
                    Opiniones y Reseñas Reales
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Supervisa y añade comentarios reales de clientes para fortalecer la credibilidad del taller.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewReviewModalOpen(true)}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg flex items-center gap-2 shadow`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Reseña Real</span>
                </button>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase font-heading">
                          {rev.author}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          ({rev.moto})
                        </span>
                        <div className="flex items-center text-amber-400 text-xs ml-2">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 italic">
                        «{rev.comment}»
                      </p>
                      <span className="text-[10px] text-neutral-500 font-mono">Fecha: {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          updateReviewStatus(rev.id, !rev.approved);
                          showNotification(rev.approved ? 'Reseña ocultada' : 'Reseña aprobada');
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${
                          rev.approved 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                        }`}
                      >
                        {rev.approved ? 'Visible en Web' : 'Oculta'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta reseña?')) {
                            deleteReview(rev.id);
                            showNotification('Reseña eliminada');
                          }
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
                        title="Eliminar reseña"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AJUSTES GENERALES DEL TALLER */}
          {activeTab === 'ajustes' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold font-heading uppercase text-white">
                  Identidad y Configuración General
                </h2>
                <p className="text-xs text-neutral-400">
                  Personaliza el nombre del taller, logotipo, color de acento, teléfono, dirección y horario de atención.
                </p>
              </div>

              <form onSubmit={handleSaveConfig} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Palette Accent Chooser */}
                <div className="space-y-3 pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-2 text-white font-heading uppercase text-sm font-bold">
                    <Palette className="w-4 h-4 text-neutral-400" />
                    <span>Color de Acento Deportivo de la Web</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'red', name: 'Rojo Racing', color: '#ef4444' },
                      { id: 'orange', name: 'Naranja KTM', color: '#f97316' },
                      { id: 'amber', name: 'Oro Motul', color: '#f59e0b' },
                      { id: 'emerald', name: 'Verde Ninja', color: '#10b981' },
                      { id: 'blue', name: 'Azul Yamaha', color: '#3b82f6' },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        type="button"
                        onClick={() => setConfigForm({ ...configForm, accentColor: accent.id as AccentColor })}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          configForm.accentColor === accent.id
                            ? 'border-white bg-neutral-800 shadow-md ring-2 ring-white/20'
                            : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                        }`}
                      >
                        <span 
                          className="w-6 h-6 rounded-full shadow" 
                          style={{ backgroundColor: accent.color }}
                        />
                        <span className="text-[11px] font-bold text-neutral-200">
                          {accent.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Datos Principales del Taller
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Nombre Oficial del Taller
                      </label>
                      <input
                        type="text"
                        value={configForm.name}
                        onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Texto de Logotipo (Navbar)
                      </label>
                      <input
                        type="text"
                        value={configForm.logoText}
                        onChange={(e) => setConfigForm({ ...configForm, logoText: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Slogan o Lema Comercial
                      </label>
                      <input
                        type="text"
                        value={configForm.tagline}
                        onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Channels */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Contacto y Canales Digitales
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Número de WhatsApp (con lada internacional)
                      </label>
                      <input
                        type="text"
                        value={configForm.whatsapp}
                        onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Teléfono Fijo del Taller
                      </label>
                      <input
                        type="text"
                        value={configForm.phone}
                        onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Dirección Física
                      </label>
                      <input
                        type="text"
                        value={configForm.address}
                        onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Ciudad / Código Postal
                      </label>
                      <input
                        type="text"
                        value={configForm.city}
                        onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Horarios de Atención
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Lunes a Viernes
                      </label>
                      <input
                        type="text"
                        value={configForm.hours.weekdays}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          hours: { ...configForm.hours, weekdays: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Sábados
                      </label>
                      <input
                        type="text"
                        value={configForm.hours.saturday}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          hours: { ...configForm.hours, saturday: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Domingos
                      </label>
                      <input
                        type="text"
                        value={configForm.hours.sunday}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          hours: { ...configForm.hours, sunday: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin PIN */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Seguridad de Acceso
                  </h3>

                  <div className="max-w-xs">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      PIN de Administrador
                    </label>
                    <input
                      type="text"
                      value={configForm.adminPin}
                      onChange={(e) => setConfigForm({ ...configForm, adminPin: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      (También puedes usar "admin" para acceso de demostración).
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Restaurar todos los datos iniciales de demostración?')) {
                        resetToDefaults();
                        showNotification('Datos de fábrica restaurados');
                      }
                    }}
                    className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Datos de Demostración</span>
                  </button>

                  <button
                    type="submit"
                    className={`px-8 py-3 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg shadow-lg flex items-center gap-2`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios del Taller</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: NUEVO SERVICIO */}
      {isNewServiceModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setIsNewServiceModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading uppercase text-white">
                Crear Nuevo Servicio Mecánico
              </h3>
              <button onClick={() => setIsNewServiceModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  placeholder="Ej: Cambio de Kit de Arrastre Reforzado"
                  value={newServiceForm.title}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 uppercase font-semibold mb-1">Categoría</label>
                  <select
                    value={newServiceForm.category}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value as ServiceCategory })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  >
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="diagnostico">Diagnóstico ECU</option>
                    <option value="motor">Motor</option>
                    <option value="frenos">Frenos</option>
                    <option value="suspension">Suspensión</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="transmision">Transmisión</option>
                    <option value="llantas">Llantas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 uppercase font-semibold mb-1">Precio Desde ($)</label>
                  <input
                    type="number"
                    value={newServiceForm.priceFrom}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, priceFrom: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Tiempo Estimado</label>
                <input
                  type="text"
                  placeholder="Ej: 1 a 2 horas"
                  value={newServiceForm.estimatedTime}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, estimatedTime: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  placeholder="Describe qué hace y para qué motos está indicado..."
                  value={newServiceForm.shortDesc}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, shortDesc: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Ícono</label>
                <select
                  value={newServiceForm.iconName}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, iconName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">URL de Fotografía</label>
                <input
                  type="text"
                  value={newServiceForm.image}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewServiceModalOpen(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newServiceForm.title.trim()) return;
                  addService(newServiceForm);
                  setIsNewServiceModalOpen(false);
                  showNotification('Servicio agregado correctamente');
                }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg`}
              >
                Guardar Servicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR SERVICIO */}
      {editingService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setEditingService(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading uppercase text-white">
                Editar Servicio: {editingService.title}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Título</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 uppercase font-semibold mb-1">Tarifa Desde ($)</label>
                  <input
                    type="number"
                    value={editingService.priceFrom}
                    onChange={(e) => setEditingService({ ...editingService, priceFrom: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 uppercase font-semibold mb-1">Tiempo Estimado</label>
                  <input
                    type="text"
                    value={editingService.estimatedTime}
                    onChange={(e) => setEditingService({ ...editingService, estimatedTime: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.popular}
                    onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-red-500 focus:ring-0"
                  />
                  <span className="text-neutral-300">Marcar como "Más Solicitado"</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  updateService(editingService.id, editingService);
                  setEditingService(null);
                  showNotification('Servicio actualizado');
                }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg`}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUBIR FOTO GALERÍA */}
      {isNewGalleryModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setIsNewGalleryModalOpen(false)}
        >
          <div 
            className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading uppercase text-white">
                Añadir Trabajo a la Galería
              </h3>
              <button onClick={() => setIsNewGalleryModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Título del Trabajo *</label>
                <input
                  type="text"
                  placeholder="Ej: Calibración de Inyección y Dinamómetro"
                  value={newGalleryForm.title}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Modelo de Moto *</label>
                <input
                  type="text"
                  placeholder="Ej: Yamaha MT-09 SP 2024"
                  value={newGalleryForm.motoModel}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, motoModel: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Categoría</label>
                <input
                  type="text"
                  placeholder="Ej: Motor & Rendimiento"
                  value={newGalleryForm.category}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Descripción del Trabajo</label>
                <textarea
                  rows={2}
                  placeholder="Detalles técnicos de lo realizado..."
                  value={newGalleryForm.description}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={newGalleryForm.imageUrl}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewGalleryModalOpen(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newGalleryForm.title.trim() || !newGalleryForm.motoModel.trim()) return;
                  addGalleryItem(newGalleryForm);
                  setIsNewGalleryModalOpen(false);
                  showNotification('Foto añadida a la galería');
                }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg`}
              >
                Añadir a Galería
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA RESEÑA REAL */}
      {isNewReviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setIsNewReviewModalOpen(false)}
        >
          <div 
            className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold font-heading uppercase text-white">
                Agregar Opinión Real de Cliente
              </h3>
              <button onClick={() => setIsNewReviewModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  placeholder="Ej: David Morales"
                  value={newReviewForm.author}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, author: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Moto del Cliente *</label>
                <input
                  type="text"
                  placeholder="Ej: Kawasaki Z900"
                  value={newReviewForm.moto}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, moto: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Calificación en Estrellas</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewForm({ ...newReviewForm, rating: s })}
                      className="p-1 text-neutral-600 hover:text-amber-400"
                    >
                      <Star className={`w-5 h-5 ${s <= newReviewForm.rating ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-semibold mb-1">Comentario o Testimonio *</label>
                <textarea
                  rows={3}
                  placeholder="Lo que el cliente comentó sobre el servicio recibido..."
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewReviewModalOpen(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newReviewForm.author.trim() || !newReviewForm.comment.trim()) return;
                  addReview({
                    author: newReviewForm.author,
                    moto: newReviewForm.moto,
                    rating: newReviewForm.rating,
                    comment: newReviewForm.comment,
                    approved: true,
                    verified: true,
                  });
                  setIsNewReviewModalOpen(false);
                  showNotification('Reseña agregada');
                }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg`}
              >
                Guardar Reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
