'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/hero-section';
import { UploadCard } from './components/upload-card';
import { UploadProgress } from './components/upload-progress';
import { ResultsDashboard } from './components/results-dashboard';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';

export default function AnalyzerPage() {
  const { hasUploaded, isLoading, result } = useCVAnalyzer();

  return (
    <>
      <HeroSection />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!hasUploaded ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UploadCard />
                {isLoading && (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <UploadProgress />
                  </motion.div>
                )}
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ResultsDashboard result={result} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
