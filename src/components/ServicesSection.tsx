import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Service } from '@/data/services';
import { initialTreeState, type QuestionNode } from '@/data/decisionTree';
import ServiceInfoPanel from '@/components/booking/ServiceInfoPanel';
import DecisionTreeFlow from '@/components/booking/DecisionTreeFlow';
import IsotipoImg from '@/assets/Isotipo.png';

const photographyCards = [
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

interface ServicesSectionProps {
  onBookService: (service: Service) => void;
}

const ServicesSection = ({ onBookService }: ServicesSectionProps) => {
  const { t, language } = useLanguage();
  const [treeHistory, setTreeHistory] = useState<QuestionNode[]>(initialTreeState.history);
  const [treeChoiceKey, setTreeChoiceKey] = useState<string | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(null);

  // Photo lightbox state
  const [photoLightboxIndex, setPhotoLightboxIndex] = useState<number | null>(null);

  // Mobile carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselTouchStartX = useRef<number | null>(null);
  const lightboxTouchStartX = useRef<number | null>(null);

  const panelService = previewService ?? confirmedService;

  const handleSelectService = (service: Service | null) => {
    setConfirmedService(service);
  };

  const handleBook = () => {
    if (confirmedService) {
      onBookService(confirmedService);
    }
  };

  // Lightbox navigation
  const closePhotoLightbox = useCallback(() => setPhotoLightboxIndex(null), []);

  const goPhotoNext = useCallback(() => {
    setPhotoLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % photographyCards.length : null,
    );
  }, []);

  const goPhotoPrev = useCallback(() => {
    setPhotoLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + photographyCards.length) % photographyCards.length : null,
    );
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (photoLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePhotoLightbox();
      else if (e.key === 'ArrowLeft') goPhotoPrev();
      else if (e.key === 'ArrowRight') goPhotoNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photoLightboxIndex, closePhotoLightbox, goPhotoPrev, goPhotoNext]);

  // Lightbox touch/swipe handlers
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - lightboxTouchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? goPhotoNext() : goPhotoPrev();
    }
    lightboxTouchStartX.current = null;
  };

  // Mobile carousel navigation
  const goCarouselNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % photographyCards.length);
  }, []);

  const goCarouselPrev = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + photographyCards.length) % photographyCards.length);
  }, []);

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    carouselTouchStartX.current = e.touches[0].clientX;
  };

  const handleCarouselTouchEnd = (e: React.TouchEvent) => {
    if (carouselTouchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - carouselTouchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? goCarouselNext() : goCarouselPrev();
    }
    carouselTouchStartX.current = null;
  };

  return (
    <section id="servicios" className="py-24 bg-background relative">
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
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Decision Tree + Info Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Decision tree - 60% */}
            <div className="w-full lg:w-[60%]">
              <DecisionTreeFlow
                treeHistory={treeHistory}
                onTreeHistoryChange={setTreeHistory}
                treeChoiceKey={treeChoiceKey}
                onTreeChoiceKeyChange={setTreeChoiceKey}
                onPreviewService={setPreviewService}
                onSelectService={handleSelectService}
                selectedService={confirmedService}
                actionLabel={t('services.book')}
                onAction={handleBook}
                language={language as 'es' | 'en'}
              />
            </div>

            {/* Info panel - 40% (desktop only) */}
            <div className="hidden lg:block w-full lg:w-[40%]">
              <AnimatePresence mode="wait">
                {panelService ? (
                  <motion.div
                    key={panelService.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="lg:sticky lg:top-24"
                  >
                    <ServiceInfoPanel
                      service={panelService}
                      className="h-fit"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/30"
                  >
                    <p className="text-muted-foreground text-sm text-center px-4">
                      {language === 'es'
                        ? 'Selecciona un servicio para ver más información'
                        : 'Select a service to see more information'}
                    </p>
                    <motion.img
                      src={IsotipoImg}
                      alt="Isotipo clínica"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.65 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mt-6 w-[130px] h-auto"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Photography Cards */}
        <div className="max-w-5xl mx-auto mt-16">

          {/* Desktop Grid — 2 columns — hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {photographyCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => setPhotoLightboxIndex(index)}
              >
                {/* Image */}
                <div className="aspect-[3/2] overflow-hidden relative">
                  <img
                    src={card.src}
                    alt={card.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Number badge */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                    <span className="text-primary font-bold text-xs leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {/* Zoom circle — appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/0 group-hover:bg-white/90 transition-all duration-300 flex items-center justify-center scale-50 group-hover:scale-100">
                      <ZoomIn className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </div>

                {/* Text content — always visible */}
                <div className="relative bg-card px-5 pt-5 pb-4">
                  {/* Gradient separator */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-coral via-fuchsia to-magenta opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="text-foreground/70 text-sm leading-relaxed mb-3">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-primary text-xs font-semibold tracking-wider uppercase">
                    <ZoomIn className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Ampliar imagen</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel — visible only on mobile */}
          <div className="md:hidden">
            {/* Image slider */}
            <div className="relative">
              <div
                className="overflow-hidden rounded-t-2xl cursor-pointer"
                onClick={() => setPhotoLightboxIndex(carouselIndex)}
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
                  {photographyCards.map((card, index) => (
                    <div key={card.id} className="w-full flex-shrink-0 relative aspect-[3/2]">
                      <img
                        src={card.src}
                        alt={card.alt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Number badge */}
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                        <span className="text-primary font-bold text-xs leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {/* Zoom hint */}
                      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft">
                        <ZoomIn className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Prev arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); goCarouselPrev(); }}
                aria-label="Imagen anterior"
                className="absolute top-1/2 left-2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-border/30 text-foreground/70 hover:text-foreground transition-colors shadow-soft"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {/* Next arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); goCarouselNext(); }}
                aria-label="Imagen siguiente"
                className="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-border/30 text-foreground/70 hover:text-foreground transition-colors shadow-soft"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Description — stays in place, animates on card change */}
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
                  {photographyCards[carouselIndex].description}
                </motion.p>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold tracking-wider uppercase">
                <ZoomIn className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Ampliar imagen</span>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-4" role="tablist">
              {photographyCards.map((_, i) => (
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

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex justify-center mt-10"
          >
            <Link to="/galeria" className="btn-gradient">
              {language === 'es' ? 'Ver toda la galería' : 'View full gallery'}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {photoLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={closePhotoLightbox}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={closePhotoLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev button */}
            <button
              className="absolute left-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPhotoPrev(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Next button */}
            <button
              className="absolute right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPhotoNext(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.img
              key={photoLightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={photographyCards[photoLightboxIndex].src}
              alt={photographyCards[photoLightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-background text-sm">
              {photoLightboxIndex + 1} / {photographyCards.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;
