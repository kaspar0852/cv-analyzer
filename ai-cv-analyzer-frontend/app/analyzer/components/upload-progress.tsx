'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';

export function UploadProgress() {
  const { isLoading, progress } = useCVAnalyzer();

  if (!isLoading) return null;

  const messages = [
    'Parsing your CV...',
    'Analyzing content...',
    'Checking ATS compatibility...',
    'Generating recommendations...',
    'Finalizing insights...',
  ];

  const currentMessageIndex = Math.floor((progress / 100) * (messages.length - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-accent" />
          </motion.div>
        </div>

        <h3 className="text-center font-semibold text-lg mb-2">
          {messages[currentMessageIndex]}
        </h3>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {progress}% complete
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          This usually takes 30-60 seconds
        </p>
      </div>
    </motion.div>
  );
}
