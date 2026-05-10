'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/hero-section';
import { UploadCard } from './components/upload-card';
import { ScanningView } from '@/components/analyzer/ScanningView';
import { ResultView } from '@/components/analyzer/ResultView';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';

export default function AnalyzerPage() {
  const { hasUploaded, isLoading, result, statusText, progress } = useCVAnalyzer();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <HeroSection />

      <section className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            
            {/* Phase 1: Upload Selection */}
            {!hasUploaded && !isLoading && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <UploadCard />
              </motion.div>
            )}

            {/* Phase 2: AI Processing (Scanning) */}
            {isLoading && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <ScanningView status={statusText} progress={progress} />
              </motion.div>
            )}

            {/* Phase 3: Results (Staggered Reveal) */}
            {hasUploaded && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <ResultView data={result} />
                
                {/* Reset Button */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-12 text-center"
                >
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
                  >
                    Start New Analysis
                  </button>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
