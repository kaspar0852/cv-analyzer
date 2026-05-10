'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InterviewQuestion {
    id: string;
    category: string;
    difficulty: string;
    question: string;
    whyTheyreAsking: string;
    evaluationCriteria: string[];
    redFlags: string[];
    answerStrategy: {
        framework: string;
        stepByStep: Array<{ step: string; guidance: string }>;
    };
    personalizedAnchors: Array<{ cvReference: string; howToUse: string }>;
    isGapQuestion: boolean;
    gapBridgeStrategy?: {
        gapTopic: string;
        honestPivotApproach: string;
        transferableExperience: string;
        learningCommitment: string;
    };
}

interface InterviewPrepSectionProps {
    data: any; // The full interviewPrepPackage
}

export function InterviewPrepSection({ data }: InterviewPrepSectionProps) {
    // Robust data mapping to handle AI variability
    const questions: InterviewQuestion[] = 
        data?.questions || 
        data?.interview_questions_to_prepare || 
        data?.interviewPrepPackage?.questions || 
        [];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI is Crafting Your Strategy</h3>
                <p className="text-muted-foreground max-w-md">
                    We're analyzing your CV gaps to generate personalized interview questions and STAR-method responses. This will pop up automatically in a few seconds.
                </p>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const nextQuestion = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % questions.length);
    };

    const prevQuestion = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Personalized Interview Prep</h2>
                <p className="text-muted-foreground">
                    Strategic questions generated specifically for your profile and target role.
                </p>
            </div>

            {/* Navigation & Progress */}
            <div className="flex items-center justify-between px-4">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevQuestion}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextQuestion}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                    Question {currentIndex + 1} of {questions.length}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentIndex(0)}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
            </div>

            {/* Flashcard Area */}
            <div className="relative h-[500px] perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex + (isFlipped ? '-back' : '-front')}
                        initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                    >
                        <Card 
                            className={`w-full h-full cursor-pointer transition-all duration-300 border-2 ${
                                isFlipped ? 'border-primary/50 shadow-primary/10' : 'border-border hover:border-primary/30'
                            } ${currentQuestion.isGapQuestion && !isFlipped ? 'border-amber-500/30' : ''}`}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <CardContent className="h-full p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                
                                {/* Background Decoration for Gap Questions */}
                                {currentQuestion.isGapQuestion && !isFlipped && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                            <ShieldAlert className="w-3 h-3 mr-1" /> Gap Defense
                                        </Badge>
                                    </div>
                                )}

                                {!isFlipped ? (
                                    <div className="space-y-6">
                                        <Badge variant="secondary" className="mb-4">
                                            {currentQuestion.category}
                                        </Badge>
                                        <h3 className="text-2xl font-semibold leading-tight px-4">
                                            "{currentQuestion.question}"
                                        </h3>
                                        <p className="text-muted-foreground text-sm animate-bounce mt-8">
                                            Click to reveal AI Strategy
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full text-left flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary tracking-widest mb-1">Interviewer Intent</h4>
                                            <p className="text-sm italic text-muted-foreground">{currentQuestion.whyTheyreAsking}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-foreground mb-2">Strategy: {currentQuestion.answerStrategy.framework}</h4>
                                                <ul className="text-xs space-y-1">
                                                    {currentQuestion.answerStrategy.stepByStep.slice(0, 3).map((s, i) => (
                                                        <li key={i} className="flex gap-2">
                                                            <span className="text-primary font-bold">{i+1}.</span>
                                                            <span>{s.guidance}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-foreground mb-2">Personalized Anchors</h4>
                                                <div className="space-y-2">
                                                    {currentQuestion.personalizedAnchors.map((a, i) => (
                                                        <div key={i} className="bg-muted p-2 rounded text-[10px] leading-tight border-l-2 border-primary">
                                                            <strong>Use:</strong> {a.cvReference}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {currentQuestion.isGapQuestion && currentQuestion.gapBridgeStrategy && (
                                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mt-auto">
                                                <h4 className="text-xs font-bold uppercase text-amber-600 mb-1 flex items-center">
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> Bridge Strategy (Pivot)
                                                </h4>
                                                <p className="text-xs text-amber-900 dark:text-amber-200">
                                                    {currentQuestion.gapBridgeStrategy.honestPivotApproach}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <p className="text-center text-[10px] text-muted-foreground mt-4 italic">
                                            Click to see question again
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
