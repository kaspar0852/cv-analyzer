import { LearningPath, CVAnalysisResult } from './types';

export const generateLearningPaths = (result: CVAnalysisResult): LearningPath[] => {
  // Focus on missing or weak skills from CV analysis
  const skillGaps = result.weaknesses.length > 0 
    ? result.weaknesses 
    : ['System Design', 'Performance Optimization'];

  const paths: LearningPath[] = [
    {
      id: '1',
      skill: 'Advanced System Design',
      difficulty: 'advanced',
      estimatedDays: 21,
      progress: 0,
      concepts: [
        {
          id: '1.1',
          name: 'Scalability Principles',
          description: 'Learn how to design systems that can handle millions of users.',
          resources: [
            {
              id: 'r1.1.1',
              title: 'System Design Primer',
              url: 'https://github.com/donnemartin/system-design-primer',
              type: 'course',
            },
            {
              id: 'r1.1.2',
              title: 'Designing Data-Intensive Applications',
              url: 'https://dataintensive.net/',
              type: 'course',
            },
          ],
          learned: false,
        },
        {
          id: '1.2',
          name: 'Database Optimization',
          description: 'Master query optimization and database indexing strategies.',
          resources: [
            {
              id: 'r1.2.1',
              title: 'SQL Performance Explained',
              url: 'https://sql-performance-explained.com/',
              type: 'docs',
            },
            {
              id: 'r1.2.2',
              title: 'Database Optimization Course',
              url: 'https://www.udemy.com/course/sql-and-database-design/',
              type: 'video',
            },
          ],
          learned: false,
        },
        {
          id: '1.3',
          name: 'Caching Strategies',
          description: 'Understand Redis, Memcached, and caching patterns.',
          resources: [
            {
              id: 'r1.3.1',
              title: 'Redis Official Documentation',
              url: 'https://redis.io/docs/',
              type: 'docs',
            },
            {
              id: 'r1.3.2',
              title: 'Cache Patterns Video',
              url: 'https://www.youtube.com/watch?v=U3RkDLtS7uY',
              type: 'video',
            },
          ],
          learned: false,
        },
      ],
    },
    {
      id: '2',
      skill: 'Testing & Test Automation',
      difficulty: 'intermediate',
      estimatedDays: 14,
      progress: 0,
      concepts: [
        {
          id: '2.1',
          name: 'Unit Testing Best Practices',
          description: 'Write effective unit tests with Jest or Vitest.',
          resources: [
            {
              id: 'r2.1.1',
              title: 'Jest Documentation',
              url: 'https://jestjs.io/docs/getting-started',
              type: 'docs',
            },
            {
              id: 'r2.1.2',
              title: 'Unit Testing Fundamentals',
              url: 'https://www.egghead.io/courses/unit-testing-fundamentals',
              type: 'video',
            },
          ],
          learned: false,
        },
        {
          id: '2.2',
          name: 'Integration Testing',
          description: 'Test interactions between multiple components and services.',
          resources: [
            {
              id: 'r2.2.1',
              title: 'React Testing Library Guide',
              url: 'https://testing-library.com/docs/react-testing-library/intro/',
              type: 'docs',
            },
          ],
          learned: false,
        },
        {
          id: '2.3',
          name: 'End-to-End Testing',
          description: 'Master Cypress or Playwright for E2E test automation.',
          resources: [
            {
              id: 'r2.3.1',
              title: 'Cypress Documentation',
              url: 'https://docs.cypress.io/',
              type: 'docs',
            },
            {
              id: 'r2.3.2',
              title: 'Playwright Getting Started',
              url: 'https://playwright.dev/docs/intro',
              type: 'docs',
            },
          ],
          learned: false,
        },
      ],
    },
    {
      id: '3',
      skill: 'DevOps & Deployment',
      difficulty: 'advanced',
      estimatedDays: 28,
      progress: 0,
      concepts: [
        {
          id: '3.1',
          name: 'Docker Containerization',
          description: 'Learn to containerize applications with Docker.',
          resources: [
            {
              id: 'r3.1.1',
              title: 'Docker Official Guide',
              url: 'https://docs.docker.com/get-started/',
              type: 'docs',
            },
            {
              id: 'r3.1.2',
              title: 'Docker Mastery Course',
              url: 'https://www.udemy.com/course/docker-mastery/',
              type: 'video',
            },
          ],
          learned: false,
        },
        {
          id: '3.2',
          name: 'Kubernetes Orchestration',
          description: 'Manage containerized applications at scale.',
          resources: [
            {
              id: 'r3.2.1',
              title: 'Kubernetes Documentation',
              url: 'https://kubernetes.io/docs/',
              type: 'docs',
            },
          ],
          learned: false,
        },
        {
          id: '3.3',
          name: 'CI/CD Pipelines',
          description: 'Implement continuous integration and deployment.',
          resources: [
            {
              id: 'r3.3.1',
              title: 'GitHub Actions Guide',
              url: 'https://docs.github.com/en/actions',
              type: 'docs',
            },
            {
              id: 'r3.3.2',
              title: 'GitLab CI/CD',
              url: 'https://docs.gitlab.com/ee/ci/',
              type: 'docs',
            },
          ],
          learned: false,
        },
      ],
    },
  ];

  return paths;
};

export const getMockLearningPaths = (result: CVAnalysisResult): Promise<LearningPath[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateLearningPaths(result));
    }, 1500);
  });
};
