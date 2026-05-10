'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Sparkles, Book, Briefcase } from 'lucide-react';
import { CVAnalysisResult } from '@/lib/types';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';
import { ScoreDisplay } from './score-display';
import { FeedbackCard } from './feedback-card';
import { KeywordTags } from './keyword-tags';
import { ATSTips } from './ats-tips';
import { InterviewSession } from './interview-session';
import { UpskillDashboard } from './upskill-dashboard';
import { NegotiationSimulator } from './negotiation-simulator';

interface ResultsDashboardProps {
  result: CVAnalysisResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { resetState } = useCVAnalyzer();
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Career Development Hub</h2>
          <p className="text-muted-foreground mt-2">
            Analyze, prepare, upskill, and negotiate with confidence
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-3"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={resetState}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Analyze Another
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="negotiate" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Negotiate</span>
            </TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <AnimatePresence mode="wait">
            <TabsContent value="analysis" className="space-y-8">
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Score Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:col-span-1 flex justify-center"
                  >
                    <ScoreDisplay score={result.score} delay={0.2} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="md:col-span-2"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-card border border-green-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {result.strengths.map((strength) => (
                            <li
                              key={strength}
                              className="text-sm text-muted-foreground flex gap-2"
                            >
                              <span className="text-green-600 dark:text-green-400">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="bg-card border border-orange-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">
                          Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                          {result.weaknesses.map((weakness) => (
                            <li
                              key={weakness}
                              className="text-sm text-muted-foreground flex gap-2"
                            >
                              <span className="text-orange-600 dark:text-orange-400">⚠</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Feedback Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4">Detailed Feedback</h3>
                  <div className="space-y-3">
                    {result.feedback.map((item, index) => (
                      <FeedbackCard key={item.category} item={item} delay={0.3 + index * 0.1} />
                    ))}
                  </div>
                </motion.div>

                {/* Recommendations Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Top Recommendations
                  </h3>
                  <ol className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <motion.li
                        key={rec}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex gap-3 text-muted-foreground"
                      >
                        <span className="font-semibold text-accent flex-shrink-0">{index + 1}.</span>
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ol>
                </motion.div>

                {/* Keywords Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <KeywordTags keywords={result.keywords} delay={0.5} />
                </motion.div>

                {/* ATS Tips Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <ATSTips tips={result.atsTips} delay={0.55} />
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Interview Tab */}
            <TabsContent value="interview">
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <InterviewSession />
              </motion.div>
            </TabsContent>

            {/* Learn Tab */}
            <TabsContent value="learn">
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <UpskillDashboard />
              </motion.div>
            </TabsContent>

            {/* Negotiate Tab */}
            <TabsContent value="negotiate">
              <motion.div
                key="negotiate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <NegotiationSimulator />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
