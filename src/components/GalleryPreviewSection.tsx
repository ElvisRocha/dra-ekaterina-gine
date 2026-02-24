import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Row 1 — featured cards with descriptions (lightbox + carousel on mobile)
const featuredCards = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1770786745/atencion_en_camilla_f5gwim.jpg',
    alt: 'Atención en camilla',
    description: 'Atención con equipo de última tecnología 3D y 4D, para que experimentes el realismo de ver a tu bebé como nunca antes. Te ofrecemos imágenes detalladas con una claridad excepcional en un ambiente cálido y profesional.',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771469858/ultrasonido3_jnws6f.jpg',
    alt: 'Ultrasonido 3D',
    description: 'Ultrasonidos realizados con calidad y esmero para que puedas disfrutar plenamente del vínculo con tu bebé. Cada sesión es un momento único, capturado con precisión y amor.',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771898892/consultorio_gx8i9x.jpg',
    alt: 'Consultorio',
    description: 'Un lugar seguro, confiable y con todas las comodidades para que te sientas como en casa. Nuestro consultorio está diseñado pensando en tu bienestar y tranquilidad durante cada visita.',
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771469858/ultrasonido6_rqrwvg.jpg',
    alt: 'Ultrasonido bebé',
    description: 'Desde las primeras etapas de tu embarazo puedes disfrutar de estas hermosas escenas. Escucharás el latido de tu bebé y vivirás momentos que atesorarás para siempre.',
  },
];

// Row 2 — extra preview images, no duplicates with row 1, shown with fade
const previewImages = [
  {
    id: 5,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771107568/doctora_computadora_lhpazz.jpg',
    alt: 'Doctora en consultorio',
  },
  {
    id: 6,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/w_550,h_450,c_fill,g_face,f_auto,q_auto/v1770786745/doctora_ekaterina_sjbvon.jpg',
    alt: 'Doctora Ekaterina',
  },
  {
    id: 7,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771106361/equipo_medico_abij92.jpg',
    alt: 'Equipo médico',
  },
  {
    id: 8,
    src: 'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771251714/ultrasounds_zwqznm.jpg',
    alt: 'Ecografía 4D',
  },
];

const GalleryPreviewSection = () => {
  const { language } = useLanguage();

  // Lightbox state (featured cards only)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mobile carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselTouchStartX = useRef<number | null>(null);
  const lightboxTouchStartX = useRef<number | null>(null);

  // --- Lightbox ---

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % featuredCards.length : null,
    );
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + featuredCards.length) % featuredCards.length : null,
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - lightboxTouchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    lightboxTouchStartX.current = null;
  };

  // --- Mobile carousel ---

  const goCarouselNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % featuredCards.length);
  }, []);

  const goCarouselPrev = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + featuredCards.length) % featuredCards.length);
  }, []);

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    carouselTouchStartX.current = e.touches[0].clientX;
  };

  const handleCarouselTouchEnd = (e: React.TouchEvent) => {
    if (carouselTouchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - carouselTouchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? goCarouselNext() : goCarouselPrev();
    carouselTouchStartX.current = null;
  };

  return (
    <section id="galeria" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {language === 'es' ? 'Galería' : 'Gallery'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'es'
              ? 'Conoce nuestras instalaciones y el cuidado que brindamos a cada paciente'
              : 'Get to know our facilities and the care we provide to every patient'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="max-w-5xl mx-auto">

          {/* ── ROW 1: Featured cards ── */}

          {/* Desktop: 4-column grid */}
          <div className="hidden md:grid md:grid-cols-4 gap-4">
            {featuredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3] shadow-card hover:shadow-elevated transition-all duration-300"
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Number badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                  <span className="text-primary font-bold text-xs leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-magenta/90 via-fuchsia/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col p-4">
                  <div className="flex-1 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <p className="text-white text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden">
            <div className="relative">
              <div
                className="overflow-hidden rounded-t-2xl cursor-pointer"
                onClick={() => setLightboxIndex(carouselIndex)}
                onTouchStart={handleCarouselTouchStart}
                onTouchEnd={handleCarouselTouchEnd}
              >
                <div
                  className="flex"
                  style={{
                    transform: `translateX(-${carouselIndex * 100}%)`,
                    transition: 'transform 400ms ease-in-out',
                  }}
                >
                  {featuredCards.map((card, index) => (
                    <div key={card.id} className="w-full flex-shrink-0 relative aspect-[4/3]">
                      <img
                        src={card.src}
                        alt={card.alt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                        <span className="text-primary font-bold text-xs leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft">
                        <ZoomIn className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); goCarouselPrev(); }}
                aria-label="Imagen anterior"
                className="absolute top-1/2 left-2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-border/30 text-foreground/70 hover:text-foreground transition-colors shadow-soft"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goCarouselNext(); }}
                aria-label="Imagen siguiente"
                className="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-border/30 text-foreground/70 hover:text-foreground transition-colors shadow-soft"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Description panel — fixed, animates on change */}
            <div className="bg-card rounded-b-2xl shadow-card px-5 pt-4 pb-4">
              <div className="h-px bg-gradient-to-r from-coral via-fuchsia to-magenta mb-4" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={carouselIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-foreground/70 text-sm leading-relaxed mb-3"
                >
                  {featuredCards[carouselIndex].description}
                </motion.p>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold tracking-wider uppercase">
                <ZoomIn className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Ampliar imagen</span>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-4" role="tablist">
              {featuredCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  role="tab"
                  aria-selected={i === carouselIndex}
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    i === carouselIndex
                      ? 'w-8 h-3 bg-gradient-to-r from-coral to-magenta'
                      : 'w-3 h-3 bg-border hover:bg-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── ROW 2: Extra preview images with fade ── */}
          <div className="relative mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
            {/* Gradient fade — blends the row into the background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[10%] to-background pointer-events-none" />
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mt-8"
          >
            <Link to="/galeria" className="btn-gradient">
              {language === 'es' ? 'Ver toda la galería' : 'View full gallery'}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              className="absolute right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={featuredCards[lightboxIndex].src}
              alt={featuredCards[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-background text-sm">
              {lightboxIndex + 1} / {featuredCards.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreviewSection;
