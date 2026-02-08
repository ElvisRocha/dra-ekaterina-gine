import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

interface FinalCTAProps {
  onBookClick: () => void;
}

const FinalCTA = ({ onBookClick }: FinalCTAProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-br from-magenta via-fuchsia to-coral relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0xaC02MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
      
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Decorative */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/50" />
            <span className="text-3xl">🌷</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/50" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-8 max-w-3xl mx-auto">
            {t('cta.headline')}
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              onClick={onBookClick}
              size="lg"
              className="bg-white text-magenta hover:bg-white/90 text-lg px-10 py-6 rounded-full shadow-elevated font-semibold"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="!size-5 text-magenta" />
                {t('cta.button')}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
