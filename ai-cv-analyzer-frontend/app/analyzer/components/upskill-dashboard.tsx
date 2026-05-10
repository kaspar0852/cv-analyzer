'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningPaths } from '@/hooks/use-learning-paths';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';
import { SkillCard } from './skill-card';
import { ConceptChecklist } from './concept-checklist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen } from 'lucide-react';

export function UpskillDashboard() {
  const { result } = useCVAnalyzer();
  const {
    learningPaths,
    selectedSkillId,
    isLoading,
    loadPaths,
    selectSkill,
    markConceptLearned,
    getOverallProgress,
  } = useLearningPaths();

  useEffect(() => {
    if (result && learningPaths.length === 0) {
      loadPaths(result);
    }
  }, [result, learningPaths.length, loadPaths]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="mb-4" />
        <p className="text-muted-foreground">Generating personalized learning paths...</p>
      </div>
    );
  }

  const selectedPath = learningPaths.find((p) => p.id === selectedSkillId);
  const overallProgress = getOverallProgress();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Upskill Hub
        </h2>
        <p className="text-muted-foreground">
          Personalized learning paths to fill skill gaps and accelerate your career
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Completion</span>
              <span className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</span>
            </div>
            <motion.div className="w-full bg-border rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPaths.map((path, index) => (
            <SkillCard
              key={path.id}
              path={path}
              isSelected={selectedSkillId === path.id}
              onClick={() => selectSkill(path.id)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Concept Checklist */}
      <AnimatePresence mode="wait">
        {selectedPath && (
          <motion.div
            key={selectedPath.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{selectedPath.skill}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Estimated time: {selectedPath.estimatedDays} days • {selectedPath.concepts.length} concepts
                </p>
              </CardHeader>
              <CardContent>
                <ConceptChecklist
                  concepts={selectedPath.concepts}
                  onConceptToggle={(conceptId) =>
                    markConceptLearned(selectedPath.id, conceptId)
                  }
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivation Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-accent/5 border border-accent/20 rounded-lg p-4"
      >
        <p className="text-sm text-foreground font-semibold mb-2">Learning Tip:</p>
        <p className="text-sm text-muted-foreground">
          Dedicate 30 minutes daily to learning. Start with beginner concepts and gradually progress to advanced topics. Building consistent habits is more important than intensity.
        </p>
      </motion.div>
    </motion.div>
  );
}
