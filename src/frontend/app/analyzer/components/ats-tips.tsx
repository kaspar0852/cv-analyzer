'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { ATSTip } from '@/lib/types';

interface ATSTipsProps {
  tips: ATSTip[];
  delay: number;
}

export function ATSTips({ tips, delay }: ATSTipsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-destructive/30 bg-destructive/10';
      case 'medium':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="font-semibold text-foreground mb-4">ATS Optimization Tips</h3>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + index * 0.1 }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
            className={`border rounded-lg p-4 flex gap-3 transition-all cursor-default ${getPriorityColor(tip.priority)}`}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2 }}>
              {getPriorityIcon(tip.priority)}
            </motion.div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm">{tip.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
