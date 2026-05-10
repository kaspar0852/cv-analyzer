'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Animated background gradient blob */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">AI-Powered CV Analysis</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
            Optimize Your Resume with
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {' '}AI Intelligence
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Get instant AI feedback on your CV. Improve ATS compatibility, add missing keywords, and land your dream job.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="text-center text-sm text-muted-foreground">
              ⬇️ Upload your CV to get started
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
