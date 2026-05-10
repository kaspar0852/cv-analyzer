'use client';

import { motion } from 'framer-motion';
import { FileText, Brain, Sparkles, Search } from 'lucide-react';

interface ScanningViewProps {
  status: string;
  progress: number;
}

export const ScanningView = ({ status, progress }: ScanningViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 bg-background/50 backdrop-blur-xl border rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Animated Background Glow */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Document Icon with Scanning Laser */}
      <div className="relative group">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <FileText className="w-24 h-24 text-primary opacity-80" />
          
          {/* Floating Brain Icon */}
          <motion.div 
            className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Brain className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* The "Laser" Scan Line */}
        <motion.div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Glow behind the laser */}
        <motion.div
          className="absolute left-0 right-0 h-20 bg-gradient-to-b from-primary/20 to-transparent z-10"
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: "100%", opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Status Text & Progress */}
      <div className="text-center space-y-4 relative z-10">
        <motion.h3 
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center justify-center gap-2"
        >
          {status.includes('Uploading') && <Search className="w-5 h-5 animate-pulse" />}
          {status.includes('AI') && <Sparkles className="w-5 h-5 text-yellow-500" />}
          {status}
        </motion.h3>
        
        {/* Modern Progress Bar */}
        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden mx-auto">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground animate-pulse">
          Your CV is being reviewed by our multi-stage AI pipeline...
        </p>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
    </div>
  );
};
