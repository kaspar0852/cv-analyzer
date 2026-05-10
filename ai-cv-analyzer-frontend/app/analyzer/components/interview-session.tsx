'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewPrep } from '@/hooks/use-interview-prep';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';
import { InterviewFlashcard } from './interview-flashcard';
import { InterviewNav } from './interview-nav';
import { Spinner } from '@/components/ui/spinner';

export function InterviewSession() {
  const { result } = useCVAnalyzer();
  const {
    questions,
    currentIndex,
    isLoading,
    loadQuestions,
    nextQuestion,
    prevQuestion,
    getProgress,
  } = useInterviewPrep();

  useEffect(() => {
    if (result && questions.length === 0) {
      loadQuestions(result);
    }
  }, [result, questions.length, loadQuestions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="mb-4" />
        <p className="text-muted-foreground">Generating personalized interview questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No interview questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const { current, total } = getProgress();

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
        <h2 className="text-3xl font-bold text-foreground mb-2">Interview Prep</h2>
        <p className="text-muted-foreground">
          Practice with {total} AI-generated interview questions tailored to your CV
        </p>
      </motion.div>

      {/* Flashcard Container */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <InterviewFlashcard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <InterviewNav
        currentIndex={currentIndex}
        totalQuestions={total}
        onNext={nextQuestion}
        onPrev={prevQuestion}
      />

      {/* Tip Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm text-foreground font-semibold mb-2">Interview Tip:</p>
        <p className="text-sm text-muted-foreground">
          Use the STAR method (Situation, Task, Action, Result) for behavioral questions. For technical questions, think out loud and explain your reasoning step by step.
        </p>
      </motion.div>
    </motion.div>
  );
}
