import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { GalleryItem } from '../../types';
import { Sparkles, Eye, X, Tag } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, theme, config } = useWorkshop();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(gallery.map(g => g.category)))];

  const filteredGallery = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(g => g.category === activeFilter);

  return (
    <section id="galeria" className="py-24 bg-neutral-950 relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <span className={`w-1.5 h-1.5 rounded-full ${theme.bgPrimary}`} />
            Galería de Trabajos Realizados
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase font-heading text-white tracking-wide">
            Nuestras Reparaciones & Proyectos
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Evidencia real de los trabajos de mecánica de precisión, afinación y preparación que entregamos en nuestro taller.
          </p>
        </div>

        {/* Filter Pills with smooth active states */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 border ${
                activeFilter === cat
                  ? `${theme.bgPrimary} text-white border-transparent shadow-lg ${theme.glow}`
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              {cat === 'all' ? 'Todos los Proyectos' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid with fluid fade-in */}
        <div key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all duration-500 hover:border-neutral-500 hover:shadow-2xl card-hover"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-90 contrast-105"
                loading="lazy"
              />

              {/* Dark overlay with hover transition */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Top tag */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-[11px] font-bold text-white uppercase tracking-wider shadow">
                  {item.motoModel}
                </span>
              </div>

              {/* Action Eye on hover */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <Eye className="w-4 h-4" />
              </div>

              {/* Bottom text info */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </div>
                <h3 className="text-base font-bold font-heading uppercase text-white line-clamp-1 group-hover:text-red-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with smooth zoom-in */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/80 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
              aria-label="Cerrar vista"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-80 md:h-[450px] bg-black">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neutral-800 text-xs font-semibold text-red-400 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    {selectedPhoto.category}
                  </div>

                  <h3 className="text-2xl font-bold font-heading uppercase text-white leading-tight">
                    {selectedPhoto.title}
                  </h3>

                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                    <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-0.5">Motocicleta:</span>
                    <span className="text-white font-bold text-sm">{selectedPhoto.motoModel}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Detalle de la intervención técnica:
                    </h4>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {selectedPhoto.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-semibold">{config.name}</span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
