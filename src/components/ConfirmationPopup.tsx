import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationPopup = ({ isOpen, onClose }: ConfirmationPopupProps) => {
  const { t } = useLanguage();

  // Get greeting based on Costa Rica time (CST, UTC-6)
  const getGreeting = () => {
    const now = new Date();
    // Convert to Costa Rica time
    const costaRicaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Costa_Rica' }));
    const hour = costaRicaTime.getHours();

    if (hour >= 5 && hour < 12) {
      return t('confirm.greeting.morning');
    } else if (hour >= 12 && hour < 18) {
      return t('confirm.greeting.afternoon');
    } else {
      return t('confirm.greeting.evening');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-4"
        >
          {/* Header */}
          <div className="text-4xl mb-4">🌿</div>
          <h2 className="font-display text-2xl text-foreground mb-6">
            {getGreeting()}
          </h2>

          {/* Content */}
          <div className="space-y-4 text-muted-foreground text-sm">
            <p>{t('confirm.thanks')}</p>
            <p>{t('confirm.punctuality')}</p>
            <p>{t('confirm.arrive')}</p>

            <div className="py-4 border-y border-border my-4">
              <p className="font-medium text-foreground mb-2">{t('confirm.important')}</p>
              <p className="text-xs">{t('confirm.late')}</p>
              <p className="text-xs mt-2">{t('confirm.understanding')}</p>
            </div>

            <p className="text-lg">{t('confirm.waiting')}</p>
            <p className="font-display text-lg text-primary">{t('confirm.signature')}</p>
            <p className="text-primary">{t('confirm.clinic')}</p>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="mt-6 btn-gradient rounded-full"
          >
            <span>{t('confirm.close')}</span>
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationPopup;
