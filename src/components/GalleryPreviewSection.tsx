import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Row 1 — featured cards with descriptions + lightbox
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


const GalleryPreviewSection = () => {
  const { language } = useLanguage();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
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

  const ctaLabel = language === 'es' ? 'Ver toda la galería' : 'View full gallery';

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

        {/* ── ROW 1: Featured cards ── */}

        {/* Desktop: 4-column grid, text always visible */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setLightboxIndex(index)}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Zoom icon on hover */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
              {/* Always-visible description */}
              <div className="relative bg-card px-4 py-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-coral via-fuchsia to-magenta" />
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: image carousel + fixed description panel + CTA button (no dots) */}
        <div className="md:hidden">
          {/* Image slider with arrows */}
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

          {/* Fixed description — fades between cards */}
          <div className="bg-card rounded-b-2xl shadow-card px-4 pt-4 pb-5">
            <div className="h-px bg-gradient-to-r from-coral via-fuchsia to-magenta mb-3" />
            <AnimatePresence mode="wait">
              <motion.p
                key={carouselIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-foreground/70 text-sm leading-relaxed"
              >
                {featuredCards[carouselIndex].description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA button — replaces dot indicators */}
          <div className="flex justify-center mt-6">
            <Link to="/galeria" className="btn-gradient">
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* CTA button — desktop */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hidden md:flex justify-center mt-8"
        >
          <Link to="/galeria" className="btn-gradient">
            {ctaLabel}
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex flex-col items-center justify-center gap-6 p-4"
            onClick={closeLightbox}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev arrow */}
            <button
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Next arrow */}
            <button
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image with caption overlay */}
            <div
              className="relative rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={featuredCards[lightboxIndex].src}
                alt={featuredCards[lightboxIndex].alt}
                className="max-w-full max-h-[72vh] object-contain block"
              />
              {/* Caption — semi-transparent gradient footer inside the image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desc-${lightboxIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-0 left-0 right-0"
                >
                  <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 pb-4 pt-12">
                    <p className="text-white text-sm text-center leading-relaxed drop-shadow-sm">
                      {featuredCards[lightboxIndex].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* "Ver toda la galería" */}
            <Link
              to="/galeria"
              className="btn-gradient"
              onClick={(e) => e.stopPropagation()}
            >
              {ctaLabel}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreviewSection;
