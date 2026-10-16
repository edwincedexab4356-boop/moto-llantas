import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ReviewItem } from '../../types';
import { 
  Star, 
  CheckCircle, 
  MessageSquare, 
  Plus, 
  X, 
  Quote, 
  ThumbsUp,
  ShieldCheck
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview, theme } = useWorkshop();
  const [modalOpen, setModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    moto: '',
    rating: 5,
    comment: '',
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Show only approved reviews on the public page
  const approvedReviews = reviews.filter(r => r.approved);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim() || !newReview.moto.trim()) {
      return;
    }

    addReview({
      author: newReview.author.trim(),
      moto: newReview.moto.trim(),
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      approved: true, // auto-approve for client demo, or moderated in admin
      verified: true,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setNewReview({ author: '', moto: '', rating: 5, comment: '' });
    }, 1500);
  };

  return (
    <section id="opiniones" className="py-24 bg-neutral-950 relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
              Opiniones de Clientes Reales
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide">
              La Confianza de la Comunidad Rider
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Reseñas y experiencias verificadas de motociclistas que mantienen sus máquinas en nuestro taller. Administradas directamente por el equipo.
            </p>
          </div>

          <div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Dejar una Opinión</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {approvedReviews.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 rounded-xl border border-neutral-800 text-neutral-400">
            Aún no hay reseñas publicadas en el sistema. Puedes agregar opiniones desde el Panel de Administración.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group relative overflow-hidden card-hover"
              >
                <Quote className="absolute top-4 right-4 w-12 h-12 text-neutral-800/40 pointer-events-none transform -rotate-6 group-hover:scale-110 transition-transform duration-300" />

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                            i < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {rev.date}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal italic">
                    «{rev.comment}»
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between relative z-10">
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading uppercase group-hover:text-red-400 transition-colors">
                      {rev.author}
                    </h4>
                    <span className="text-xs text-neutral-400 font-mono">
                      Moto: {rev.moto}
                    </span>
                  </div>

                  {rev.verified && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-emerald-400 font-semibold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cliente Verificado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to leave a review */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-heading uppercase text-white">
                Comparte tu Experiencia en el Taller
              </h3>
              <p className="text-xs text-neutral-400">
                Tu opinión nos ayuda a mantener los más altos estándares de calidad mecánica.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">¡Gracias por tu opinión!</p>
                <p className="text-xs">Se ha registrado exitosamente en el sistema.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Alejandro Cruz"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Tu Moto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Yamaha MT-07, BMW F850GS..."
                    value={newReview.moto}
                    onChange={(e) => setNewReview({ ...newReview, moto: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Calificación
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-neutral-500 hover:text-amber-400 focus:outline-none transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-neutral-400 ml-2 font-mono">
                      {newReview.rating} de 5 estrellas
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Comentario o Reseña *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Cuéntanos sobre el trabajo realizado, la atención recibida o el rendimiento de tu moto tras el servicio..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold uppercase text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white ${theme.bgPrimary} rounded-lg`}
                  >
                    Publicar Reseña
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
