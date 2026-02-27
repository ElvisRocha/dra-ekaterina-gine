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
  /** Translation key for the modal title. Defaults to 'newpatient.title'. */
  titleKey?: string;
  /** Translation key for the modal message. Defaults to 'newpatient.message'. */
  messageKey?: string;
}

const NewPatientModal = ({
  isOpen,
  onChoice,
  titleKey = 'newpatient.title',
  messageKey = 'newpatient.message',
}: NewPatientModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <span>📋</span>
            {t(titleKey)}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <p className="text-muted-foreground mb-6">
            {t(messageKey)}
          </p>

          <div className="grid gap-3">
            <Button
              onClick={() => onChoice(true)}
              className="h-auto py-4 btn-gradient justify-start"
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="text-left">
                <span className="block font-medium">{t('newpatient.now')}</span>
              </span>
            </Button>

            <Button
              onClick={() => onChoice(false)}
              variant="outline"
              className="h-auto py-4 justify-start"
            >
              <Building2 className="w-5 h-5 mr-3" />
              <span className="text-left">
                <span className="block font-medium">{t('newpatient.clinic')}</span>
              </span>
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientModal;
