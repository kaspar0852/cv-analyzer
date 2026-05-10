import { CVAnalysisResult } from './types';

export const mockCVAnalysisResult: CVAnalysisResult = {
  score: 78,
  feedback: [
    {
      category: 'Structure',
      message: 'CV structure is well-organized with clear sections.',
      severity: 'info',
    },
    {
      category: 'Keywords',
      message: 'Consider adding more industry-specific keywords.',
      severity: 'warning',
    },
    {
      category: 'Length',
      message: 'CV length is appropriate for your experience level.',
      severity: 'info',
    },
  ],
  recommendations: [
    'Add quantifiable achievements with metrics',
    'Include relevant certifications and licenses',
    'Use power verbs to start bullet points',
    'Tailor CV for specific job descriptions',
  ],
  keywords: [
    'React',
    'TypeScript',
    'Node.js',
    'Database Design',
    'API Development',
    'Agile',
    'AWS',
    'Git',
  ],
  atsTips: [
    {
      title: 'Use Standard Formatting',
      description: 'Avoid complex formatting, graphics, and unusual fonts that ATS systems may not parse correctly.',
      priority: 'high',
    },
    {
      title: 'Match Job Description Keywords',
      description: 'Include keywords from the job posting to improve ATS matching.',
      priority: 'high',
    },
    {
      title: 'Use Common Section Headers',
      description: 'Stick to standard headers like "Experience", "Education", and "Skills".',
      priority: 'medium',
    },
    {
      title: 'Include Contact Information',
      description: 'Ensure your email, phone, and LinkedIn are clearly visible.',
      priority: 'medium',
    },
  ],
  strengths: [
    'Clear professional summary',
    'Well-organized work experience',
    'Relevant technical skills listed',
  ],
  weaknesses: [
    'Missing quantifiable metrics in achievements',
    'Could expand on technical stack details',
    'Limited action verbs in descriptions',
  ],
};

// Simulate API delay
export const getMockAnalysisResult = (): Promise<CVAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCVAnalysisResult);
    }, 2000);
  });
};
