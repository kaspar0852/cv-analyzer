import { InterviewQuestion, CVAnalysisResult } from './types';

export const generateInterviewQuestions = (result: CVAnalysisResult): InterviewQuestion[] => {
  const questions: InterviewQuestion[] = [
    {
      id: '1',
      question: 'Tell me about a challenging project you worked on and how you overcame the obstacles.',
      context: `Based on your experience with ${result.keywords[0]} and ${result.keywords[1]}, this tests your problem-solving and technical depth.`,
      aiStrategy: `Discuss a specific project from your background. Use the STAR method: (Situation, Task, Action, Result). Highlight how you used ${result.keywords[0]} or ${result.keywords[1]} to solve a problem. Include metrics about the impact.`,
      difficulty: 'medium',
      isGapQuestion: false,
    },
    {
      id: '2',
      question: 'How do you stay current with new technologies in your field?',
      context: 'This assesses your commitment to continuous learning, which is critical for tech roles.',
      aiStrategy: `Mention specific learning strategies: online courses, conferences, contributing to open source, reading technical blogs. Reference one new skill you learned recently (ideally from ${result.keywords[2]} or ${result.keywords[3]}). Show genuine enthusiasm.`,
      difficulty: 'easy',
      isGapQuestion: false,
    },
    {
      id: '3',
      question: `Describe your experience with ${result.weaknesses[0]?.includes('testing') ? 'automated testing' : 'system design'}. How do you approach it?`,
      context: `This targets an area where you could strengthen: ${result.weaknesses[0] || 'technical depth'}. Showing knowledge here sets you apart.`,
      aiStrategy: `Even if you haven't worked extensively in this area, show you understand the concepts. Discuss a smaller project where you applied it, or explain how you'd approach learning it. Reference best practices and your learning path.`,
      difficulty: 'hard',
      isGapQuestion: true,
    },
    {
      id: '4',
      question: 'Describe a time when you had to collaborate with a difficult team member. How did you handle it?',
      context: 'Behavioral question to assess soft skills and workplace maturity.',
      aiStrategy: `Share a real example showing emotional intelligence and problem-solving. Focus on: what the issue was, what you did (not just blamed them), and the positive outcome. Keep it professional and avoid criticizing the person.`,
      difficulty: 'medium',
      isGapQuestion: false,
    },
    {
      id: '5',
      question: `Walk me through how you would approach building [a system using your top skills: ${result.keywords[0] && result.keywords[1]} integration].`,
      context: `This is a technical architecture question leveraging your core competencies: ${result.keywords[0]}, ${result.keywords[1]}.`,
      aiStrategy: `Outline a clear approach: (1) Understand requirements, (2) Design architecture, (3) Discuss technology choices, (4) Mention trade-offs and scalability. Use examples from your experience. Ask clarifying questions to show thoughtful analysis.`,
      difficulty: 'hard',
      isGapQuestion: false,
    },
    {
      id: '6',
      question: 'Why are you interested in this role and our company?',
      context: 'Motivation and cultural fit assessment.',
      aiStrategy: `Demonstrate genuine interest by referencing: company mission/products, growth opportunities, and how your skills align. Connect your technical background (${result.keywords[0]}, ${result.keywords[1]}) to what they build. Show you've done research.`,
      difficulty: 'easy',
      isGapQuestion: false,
    },
  ];

  return questions;
};

export const getMockInterviewQuestions = (result: CVAnalysisResult): Promise<InterviewQuestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateInterviewQuestions(result));
    }, 1500);
  });
};
