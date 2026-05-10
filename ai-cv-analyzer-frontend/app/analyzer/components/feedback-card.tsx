'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { FeedbackItem } from '@/lib/types';

interface FeedbackCardProps {
  item: FeedbackItem;
  delay: number;
}

export function FeedbackCard({ item, delay }: FeedbackCardProps) {
  const getIcon = () => {
    switch (item.severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-accent flex-shrink-0" />;
    }
  };

  const getBackgroundColor = () => {
    switch (item.severity) {
      case 'error':
        return 'bg-destructive/10 border-destructive/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-accent/10 border-accent/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className={`border rounded-lg p-4 flex gap-3 transition-all cursor-default ${getBackgroundColor()}`}
    >
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
        {getIcon()}
      </motion.div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm">{item.category}</h4>
        <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
      </div>
    </motion.div>
  );
}
