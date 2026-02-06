import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Building2 } from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onChoice: (fillNow: boolean) => void;
}

const NewPatientModal = ({ isOpen, onChoice }: NewPatientModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <span>📋</span>
            {t('newpatient.title')}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <p className="text-muted-foreground mb-6">
            {t('newpatient.message')}
          </p>

          <div className="grid gap-3">
            <Button
              onClick={() => onChoice(true)}
              className="h-12 rounded-full btn-gradient"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>{t('newpatient.now')}</span>
            </Button>

            <Button
              onClick={() => onChoice(false)}
              variant="outline"
              className="h-12 rounded-full btn-outline-gradient"
            >
              <Building2 className="w-5 h-5 mr-2" />
              <span>{t('newpatient.clinic')}</span>
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientModal;
