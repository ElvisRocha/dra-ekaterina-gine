import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Award, Star, Quote, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import type { Testimonial } from '@/data/testimonials';

// --- Helpers ---

const DESKTOP_TRUNCATE = 200;
const MOBILE_TRUNCATE = 150;
const AUTO_ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 50;

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
  onReadMore: (testimonial: Testimonial) => void;
}

const TestimonialCard = ({ testimonial, truncateLength, readMoreLabel, onReadMore }: TestimonialCardProps) => {
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('');
  const isTruncated = testimonial.text.length > truncateLength;
  const displayText = isTruncated ? truncateText(testimonial.text, truncateLength) : testimonial.text;

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

// --- Full Testimonial Modal ---

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  closeLabel: string;
}

const TestimonialModal = ({ testimonial, onClose, closeLabel }: TestimonialModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when modal opens
  useEffect(() => {
    if (testimonial) {
      closeButtonRef.current?.focus();
    }
  }, [testimonial]);

  // Close on Escape
  useEffect(() => {
    if (!testimonial) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [testimonial, onClose]);

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

      {/* Modal content */}
      <div className="relative bg-card rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-border/50 animate-scale-in"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="w-4 h-4" />
        </button>

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
          &ldquo;{testimonial.text}&rdquo;
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
      </div>
    </div>
  );
};

// --- Main Carousel Section ---

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [modalTestimonial, setModalTestimonial] = useState<Testimonial | null>(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalItems = testimonials.length;
  const totalPages = Math.ceil(totalItems / itemsPerView);
  const truncateLength = itemsPerView === 1 ? MOBILE_TRUNCATE : DESKTOP_TRUNCATE;

  // Responsive items-per-view
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset page when items-per-view changes to avoid out-of-bounds
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerView]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || modalTestimonial) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [isPaused, totalPages, modalTestimonial]);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
      // Only trigger swipe if horizontal movement is dominant
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) goToNext();
        else goToPrev();
      }
    },
    [goToNext, goToPrev]
  );

  const handleCloseModal = useCallback(() => {
    setModalTestimonial(null);
  }, []);

  // Carousel track positioning:
  // Track width = (totalItems / itemsPerView) * 100% of the container
  // Each item width = (100 / totalItems)% of the track
  // TranslateX = -(currentPage * itemsPerView * 100 / totalItems)% of the track
  const trackWidthPercent = (totalItems / itemsPerView) * 100;
  const itemWidthPercent = 100 / totalItems;
  const translateXPercent = -(currentPage * itemsPerView * 100) / totalItems;

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
                    transition: 'transform 500ms ease-in-out',
                  }}
                  aria-live="polite"
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="px-3"
                      style={{ width: `${itemWidthPercent}%` }}
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        truncateLength={truncateLength}
                        readMoreLabel={t('testimonials.readMore')}
                        onReadMore={setModalTestimonial}
                      />
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
                    aria-selected={i === currentPage}
                    aria-label={`${t('testimonials.goToSlide')} ${i + 1}`}
                    className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      i === currentPage
                        ? 'w-8 h-3 bg-gradient-to-r from-coral to-magenta'
                        : 'w-3 h-3 bg-border hover:bg-muted-foreground/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Instagram CTA */}
          <motion.a
            href="https://instagram.com/dra_ekaterina_gine"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block card-elevated group hover:border-primary/20 transition-colors mt-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-magenta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground mb-1">
                  {t('testimonials.follow')}
                </h3>
                <p className="text-primary font-medium">@dra_ekaterina_gine</p>
              </div>
            </div>
          </motion.a>
        </div>
      </div>

      {/* Full testimonial modal */}
      <TestimonialModal
        testimonial={modalTestimonial}
        onClose={handleCloseModal}
        closeLabel={t('testimonials.close')}
      />
    </section>
  );
};

export default TestimonialsSection;
