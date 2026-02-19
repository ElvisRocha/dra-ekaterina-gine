import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Award, Star, Quote, ChevronLeft, ChevronRight, X } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { testimonials } from '@/data/testimonials';
import type { Testimonial } from '@/data/testimonials';

// --- Constants ---

const DESKTOP_TRUNCATE = 200;
const MOBILE_TRUNCATE = 150;
const AUTO_ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 50;
const CAROUSEL_TRANSITION_MS = 400;

// --- Helpers ---

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

function getItemsPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

// --- Testimonial Card ---

interface TestimonialCardProps {
  testimonial: Testimonial;
  truncateLength: number;
  readMoreLabel: string;
  language: 'es' | 'en';
  onReadMore: (testimonial: Testimonial) => void;
}

const TestimonialCard = ({ testimonial, truncateLength, readMoreLabel, language, onReadMore }: TestimonialCardProps) => {
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('');
  const text = language === 'es' ? testimonial.textEs : testimonial.textEn;
  const isTruncated = text.length > truncateLength;
  const displayText = isTruncated ? truncateText(text, truncateLength) : text;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-[var(--shadow-card)] transition-shadow duration-300 flex flex-col h-full">
      <Quote className="w-8 h-8 text-coral/30 mb-3 shrink-0" />

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? 'fill-coral text-coral' : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>

      {/* Testimonial text with truncation */}
      <div className="text-muted-foreground leading-relaxed mb-6 flex-1">
        <p>
          &ldquo;{displayText}&rdquo;
        </p>
        {isTruncated && (
          <button
            onClick={() => onReadMore(testimonial)}
            className="text-primary font-medium text-sm mt-2 hover:underline focus:outline-none focus:underline"
          >
            {readMoreLabel}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/20 to-magenta/20 flex items-center justify-center shrink-0">
          <span className="text-primary font-semibold text-sm">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{testimonial.name}</p>
        </div>
      </div>
    </div>
  );
};

// --- Modal Animation Variants ---

const modalSlideVariants = {
  enter: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? -30 : 30,
    opacity: 0,
  }),
};

const modalSlideTransition = { duration: 0.3, ease: 'easeInOut' as const };

// --- Full Testimonial Modal with Navigation ---

interface TestimonialModalProps {
  testimonialIndex: number | null;
  direction: 'left' | 'right';
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
  language: 'es' | 'en';
}

const TestimonialModal = ({
  testimonialIndex,
  direction,
  onClose,
  onPrev,
  onNext,
  closeLabel,
  language,
}: TestimonialModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const testimonial = testimonialIndex !== null ? testimonials[testimonialIndex] : null;

  // Focus close button when modal opens
  useEffect(() => {
    if (testimonial) {
      closeButtonRef.current?.focus();
    }
  }, [testimonial]);

  // Keyboard: Escape to close, Arrow keys to navigate
  useEffect(() => {
    if (testimonialIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [testimonialIndex, onClose, onPrev, onNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (testimonial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [testimonial]);

  if (!testimonial) return null;

  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={testimonial.name}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label={language === 'es' ? 'Anterior' : 'Previous'}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label={language === 'es' ? 'Siguiente' : 'Next'}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Modal content wrapper */}
      <div
        className="relative max-w-lg w-full max-h-[85vh] z-[55]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — outside AnimatePresence so it stays static */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={testimonialIndex}
            custom={direction}
            variants={modalSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={modalSlideTransition}
            className="bg-card rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[85vh] border border-border/50"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            <Quote className="w-10 h-10 text-coral/30 mb-4 shrink-0" />

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating ? 'fill-coral text-coral' : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>

            {/* Full text */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              &ldquo;{language === 'es' ? testimonial.textEs : testimonial.textEn}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral/20 to-magenta/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold">{initials}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
              </div>
            </div>

            {/* Counter */}
            <div className="text-center mt-4 text-xs text-muted-foreground">
              {testimonialIndex! + 1} / {testimonials.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main Carousel Section ---

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  // Carousel state
  const [trackIndex, setTrackIndex] = useState(1); // 1 = first real page
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  // Modal state
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalDirection, setModalDirection] = useState<'left' | 'right'>('right');

  const isJumping = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalItems = testimonials.length;
  const totalPages = Math.ceil(totalItems / itemsPerView);
  const truncateLength = itemsPerView === 1 ? MOBILE_TRUNCATE : DESKTOP_TRUNCATE;

  // Build extended items array: [clone_last_page, ...padded_originals, clone_first_page]
  // Pad to fill incomplete last page (e.g. 9 items / 2 per view → pad to 10)
  const extendedItems = useMemo(() => {
    const paddedLength = totalPages * itemsPerView;
    const padded: (Testimonial | null)[] = [
      ...testimonials,
      ...Array<null>(paddedLength - totalItems).fill(null),
    ];
    const cloneBefore = padded.slice(-itemsPerView);
    const cloneAfter = padded.slice(0, itemsPerView);
    return [...cloneBefore, ...padded, ...cloneAfter];
  }, [itemsPerView, totalPages, totalItems]);

  // Track layout math
  const totalExtended = extendedItems.length;
  const trackWidthPercent = (totalExtended / itemsPerView) * 100;
  const itemWidthPercent = 100 / totalExtended;
  const translateXPercent = -(trackIndex * itemsPerView * 100) / totalExtended;

  // Map trackIndex to real page index for dot indicators
  const realPage = trackIndex <= 0
    ? totalPages - 1
    : trackIndex > totalPages
      ? 0
      : trackIndex - 1;

  // --- Effects ---

  // Responsive items-per-view
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first real page on breakpoint change (no animation)
  useEffect(() => {
    setSkipTransition(true);
    setTrackIndex(1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSkipTransition(false);
      });
    });
  }, [itemsPerView]);

  // Auto-rotation — resets interval on every page change (trackIndex dep)
  useEffect(() => {
    if (isPaused || modalIndex !== null) return;
    const interval = setInterval(() => {
      if (!isJumping.current) {
        setTrackIndex((prev) => {
          if (prev >= totalPages + 1) return prev;
          return prev + 1;
        });
      }
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [isPaused, modalIndex, totalPages, trackIndex]);

  // --- Carousel Navigation ---

  const goToNext = useCallback(() => {
    if (isJumping.current) return;
    setTrackIndex((prev) => {
      if (prev >= totalPages + 1) return prev; // already at after-clone
      return prev + 1;
    });
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    if (isJumping.current) return;
    setTrackIndex((prev) => {
      if (prev <= 0) return prev; // already at before-clone
      return prev - 1;
    });
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    if (isJumping.current) return;
    setTrackIndex(page + 1);
  }, []);

  // Instant jump after animating to a clone page
  const handleTrackTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    // Only handle the track's own transform transition, ignore bubbled child transitions
    if (e.target !== e.currentTarget) return;

    if (trackIndex === 0) {
      // Animated to before-clone → jump to real last page
      isJumping.current = true;
      setSkipTransition(true);
      setTrackIndex(totalPages);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSkipTransition(false);
          isJumping.current = false;
        });
      });
    } else if (trackIndex === totalPages + 1) {
      // Animated to after-clone → jump to real first page
      isJumping.current = true;
      setSkipTransition(true);
      setTrackIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSkipTransition(false);
          isJumping.current = false;
        });
      });
    }
  }, [trackIndex, totalPages]);

  // Keyboard navigation on the carousel container
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    },
    [goToNext, goToPrev]
  );

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) goToNext();
        else goToPrev();
      }
    },
    [goToNext, goToPrev]
  );

  // --- Modal Navigation ---

  const handleOpenModal = useCallback((testimonial: Testimonial) => {
    const idx = testimonials.indexOf(testimonial);
    setModalDirection('right');
    setModalIndex(idx >= 0 ? idx : 0);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalIndex(null);
  }, []);

  const handleModalPrev = useCallback(() => {
    setModalDirection('left');
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  }, []);

  const handleModalNext = useCallback(() => {
    setModalDirection('right');
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev === testimonials.length - 1 ? 0 : prev + 1;
    });
  }, []);

  // --- Render ---

  return (
    <section className="py-24 bg-soft-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-40 h-40 bg-coral/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-40 h-40 bg-magenta/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            {t('testimonials.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-elevated text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-coral" />
              <span className="font-display text-xl text-foreground">
                {t('testimonials.badge')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-5 h-5 fill-coral text-coral" />
              ))}
            </div>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              ref={carouselRef}
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label={t('testimonials.title')}
            >
              {/* Carousel viewport */}
              <div
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex items-stretch"
                  style={{
                    width: `${trackWidthPercent}%`,
                    transform: `translateX(${translateXPercent}%)`,
                    transition: skipTransition
                      ? 'none'
                      : `transform ${CAROUSEL_TRANSITION_MS}ms ease-in-out`,
                  }}
                  onTransitionEnd={handleTrackTransitionEnd}
                  aria-live="polite"
                >
                  {extendedItems.map((item, index) => (
                    <div
                      key={`slide-${index}`}
                      className="px-3"
                      style={{ width: `${itemWidthPercent}%` }}
                    >
                      {item ? (
                        <TestimonialCard
                          testimonial={item}
                          truncateLength={truncateLength}
                          readMoreLabel={t('testimonials.readMore')}
                          language={language}
                          onReadMore={handleOpenModal}
                        />
                      ) : (
                        <div className="invisible" aria-hidden="true">
                          <div className="bg-card rounded-2xl p-6 border border-border/50 h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={goToPrev}
                aria-label={t('testimonials.prev')}
                className="absolute top-1/2 -left-2 md:-left-5 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:shadow-[var(--shadow-soft)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                aria-label={t('testimonials.next')}
                className="absolute top-1/2 -right-2 md:-right-5 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:shadow-[var(--shadow-soft)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-2 mt-6" role="tablist">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    role="tab"
                    aria-selected={i === realPage}
                    aria-label={`${t('testimonials.goToSlide')} ${i + 1}`}
                    className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      i === realPage
                        ? 'w-8 h-3 bg-gradient-to-r from-coral to-magenta'
                        : 'w-3 h-3 bg-border hover:bg-muted-foreground/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Social Media CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-elevated mt-8"
          >
            <h3 className="font-display text-xl text-foreground mb-4 text-center">
              {t('testimonials.follow')}
            </h3>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-6">
              <a
                href="https://www.instagram.com/dra_ekaterina_gine"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-magenta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <span className="text-primary font-medium">Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/dra.ekaterina.malaspina.riazanova"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-magenta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-primary font-medium">Facebook</span>
              </a>
              <a
                href="https://www.tiktok.com/@dra.ekaterina.gine"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-magenta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TikTokIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-primary font-medium">TikTok</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full testimonial modal with navigation */}
      <TestimonialModal
        testimonialIndex={modalIndex}
        direction={modalDirection}
        onClose={handleCloseModal}
        onPrev={handleModalPrev}
        onNext={handleModalNext}
        closeLabel={t('testimonials.close')}
        language={language}
      />
    </section>
  );
};

export default TestimonialsSection;
