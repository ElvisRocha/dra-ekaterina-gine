import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQProps {
  onBookClick: () => void;
}

const faqKeys = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
  { q: 'faq.q8', a: 'faq.a8' },
  { q: 'faq.q9', a: 'faq.a9' },
  { q: 'faq.q10', a: 'faq.a10' },
];

const FAQ = ({ onBookClick }: FAQProps) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-coral/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-magenta/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-coral/50" />
            <img src="/src/assets/Isotipo.png" alt="" className="w-10 h-10" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-coral/50" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t('faq.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqKeys.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div
                  className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
                    openIndex === index
                      ? 'border-primary/30 shadow-soft'
                      : 'border-border/50 hover:border-primary/20'
                  }`}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-blush/30 transition-colors duration-200"
                  >
                    <span className="text-base md:text-lg font-medium text-foreground pr-4">
                      {t(faq.q)}
                    </span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                        openIndex === index ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </motion.span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6">
                          <div className="pt-2 border-t border-border/30">
                            <p className="pt-4 text-muted-foreground leading-relaxed">
                              {t(faq.a)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className="bg-soft-gradient rounded-2xl p-8 md:p-12 text-center border border-border/30">
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
              {t('faq.ctaTitle')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('faq.ctaDescription')}
            </p>
            <Button
              onClick={onBookClick}
              size="lg"
              className="btn-gradient rounded-full px-8 py-6 text-lg"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="!size-5" />
                {t('faq.ctaButton')}
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
