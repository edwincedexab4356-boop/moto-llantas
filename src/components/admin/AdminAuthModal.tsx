import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { Lock, KeyRound, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, config, theme } = useWorkshop();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pin);
    if (success) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-full ${theme.bgPrimary} mx-auto flex items-center justify-center text-white shadow-xl`}>
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-wide">
            Panel de Administración
          </h3>
          <p className="text-xs text-neutral-400">
            Ingresa tu clave de acceso para gestionar citas, servicios, precios y configuración de <strong className="text-neutral-200">{config.name}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Contraseña o PIN de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                placeholder="Ingresa PIN..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorrecto. Vuelve a intentarlo.</span>
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Acceso de Demostración:</strong> La contraseña predeterminada es <code className="text-emerald-300 font-mono font-bold bg-neutral-900 px-1.5 py-0.5 rounded">admin</code>. Puedes cambiarla dentro de los ajustes.
            </span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} ${theme.bgPrimaryHover} rounded-lg shadow-lg transition-all`}
            >
              Entrar al Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
