'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNegotiation } from '@/hooks/use-negotiation';
import { useCVAnalyzer } from '@/hooks/use-cv-analyzer';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { SalaryDisplay } from './salary-display';
import { ValuePropositions } from './value-propositions';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export function NegotiationSimulator() {
  const { result } = useCVAnalyzer();
  const {
    messages,
    salaryData,
    isLoading,
    sessionActive,
    initializeScenario,
    sendMessage,
    getValuePropositions,
  } = useNegotiation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && !sessionActive) {
      initializeScenario(result);
    }
  }, [result, sessionActive, initializeScenario]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading && !salaryData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="mb-4" />
        <p className="text-muted-foreground">Initializing salary negotiation scenario...</p>
      </div>
    );
  }

  const valueProps = result ? getValuePropositions(result) : [];

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
          <Briefcase className="w-8 h-8 text-primary" />
          Salary Negotiation Simulator
        </h2>
        <p className="text-muted-foreground">
          Practice negotiating your offer with an AI hiring manager
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4 min-h-96 max-h-96">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage key={message.id} message={message} index={index} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-t p-4"
            >
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                disabled={!sessionActive}
              />
              <p className="text-xs text-muted-foreground mt-3">
                Try responses like: "I was expecting $150k" or "What about stock options and signing bonus?"
              </p>
            </motion.div>
          </Card>
        </motion.div>

        {/* Sidebar: Info and Resources */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 flex flex-col"
        >
          {/* Salary Display */}
          {salaryData && <SalaryDisplay salaryData={salaryData} delay={0.3} />}

          {/* Value Propositions */}
          {valueProps.length > 0 && (
            <ValuePropositions propositions={valueProps} delay={0.4} />
          )}

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-accent/5 border border-accent/20 rounded-lg p-4 text-sm space-y-2"
          >
            <p className="font-semibold text-foreground">Negotiation Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Always counter with a number higher than their offer</li>
              <li>Provide reasoning based on your value and market rates</li>
              <li>Consider total compensation (salary + benefits + equity)</li>
              <li>Be respectful but confident in your worth</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
