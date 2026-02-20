import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { services, formatPrice, type Service } from '@/data/services';
import { decisionTree, type QuestionNode, type ChoiceOption, type ServiceNode } from '@/data/decisionTree';

interface DecisionTreeFlowProps {
  onPreviewService: (service: Service | null) => void;
  onSelectService: (service: Service | null) => void;
  selectedService: Service | null;
  actionLabel?: string;
  onAction?: () => void;
  language: 'es' | 'en';
}

const DecisionTreeFlow = ({
  onPreviewService,
  onSelectService,
  selectedService,
  actionLabel,
  onAction,
  language,
}: DecisionTreeFlowProps) => {
  const [history, setHistory] = useState<QuestionNode[]>([decisionTree]);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentNode = history[history.length - 1];

  const handleChoice = (choice: ChoiceOption) => {
    if (choice.next.type === 'question') {
      setDirection(1);
      setHistory(prev => [...prev, choice.next as QuestionNode]);
      onPreviewService(null);
      onSelectService(null);
    } else {
      const svc = services.find(s => s.id === (choice.next as ServiceNode).serviceId) ?? null;
      if (svc) {
        onPreviewService(svc);
        onSelectService(svc);
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setDirection(-1);
      setHistory(prev => prev.slice(0, -1));
      onPreviewService(null);
      onSelectService(null);
    }
  };

  const isChoiceSelected = (choice: ChoiceOption): boolean => {
    if (choice.next.type !== 'service') return false;
    return selectedService?.id === (choice.next as ServiceNode).serviceId;
  };

  const resolveService = (choice: ChoiceOption): Service | null => {
    if (choice.next.type !== 'service') return null;
    return services.find(s => s.id === (choice.next as ServiceNode).serviceId) ?? null;
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <AnimatePresence>
        {history.length > 1 && (
          <motion.button
            key="back-btn"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === 'es' ? 'Atrás' : 'Back'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Question + Choices */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentNode.id}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
            center: { opacity: 1, x: 0 },
            exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="space-y-4"
        >
          {/* Icon (shown on question nodes that have one) */}
          {currentNode.icon && (
            <div className="flex justify-center">
              <img
                src={currentNode.icon}
                alt=""
                aria-hidden="true"
                className="w-14 h-14 object-contain"
              />
            </div>
          )}

          {/* Question text */}
          <h3 className="font-display text-lg text-foreground text-center">
            {language === 'es' ? currentNode.questionEs : currentNode.questionEn}
          </h3>

          {/* Choices */}
          <div className="space-y-2">
            {currentNode.choices.map((choice, i) => {
              const isTerminal = choice.next.type === 'service';
              const resolvedService = isTerminal ? resolveService(choice) : null;
              const isSelected = isTerminal && isChoiceSelected(choice);

              return (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  onMouseEnter={() => {
                    if (resolvedService) onPreviewService(resolvedService);
                  }}
                  onMouseLeave={() => {
                    onPreviewService(selectedService);
                  }}
                  className={cn(
                    'w-full p-4 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Option icon */}
                    {choice.icon && (
                      <img
                        src={choice.icon}
                        alt=""
                        aria-hidden="true"
                        className="w-10 h-10 flex-shrink-0 object-contain"
                      />
                    )}

                    {/* Label + metadata */}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground text-sm block">
                        {language === 'es' ? choice.labelEs : choice.labelEn}
                      </span>
                      {resolvedService && (
                        <span className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {resolvedService.duration}
                          <span className="font-semibold text-primary">
                            {formatPrice(resolvedService.price)}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Arrow for non-terminal choices */}
                    {!isTerminal && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}

                    {/* Action button on selected terminal choice */}
                    {isSelected && actionLabel && onAction && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction();
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
                      >
                        {actionLabel}
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DecisionTreeFlow;
