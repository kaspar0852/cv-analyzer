import { SalaryData, CVAnalysisResult, NegotiationMessage } from './types';

// Generate salary data based on CV score and experience level
export const generateSalaryData = (result: CVAnalysisResult): SalaryData => {
  const scoreMultiplier = result.score / 100;
  
  // Base salary ranges by location (can be extended)
  const baseRanges = {
    min: 80000,
    median: 120000,
    max: 160000,
  };

  // Adjust based on CV score
  const adjustedRanges: SalaryData = {
    position: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    currency: 'USD',
    min: Math.round(baseRanges.min * (0.8 + scoreMultiplier * 0.4)),
    median: Math.round(baseRanges.median * (0.8 + scoreMultiplier * 0.4)),
    max: Math.round(baseRanges.max * (0.8 + scoreMultiplier * 0.4)),
  };

  return adjustedRanges;
};

export const generateInitialOffer = (salaryData: SalaryData): NegotiationMessage => {
  return {
    id: '0',
    role: 'ai',
    content: `Thank you for joining our conversation. We're excited about your candidacy! Based on our evaluation, we'd like to extend an offer with a salary of $${salaryData.median.toLocaleString()}/year. This reflects our confidence in your abilities and the market rates for your experience level. We also offer comprehensive benefits including health insurance, 401k matching, remote work flexibility, and professional development opportunities. What are your thoughts on this offer?`,
    timestamp: new Date(),
  };
};

export const getMockInitialOffer = (result: CVAnalysisResult): Promise<NegotiationMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const salaryData = generateSalaryData(result);
      resolve(generateInitialOffer(salaryData));
    }, 1500);
  });
};

export const generateAIResponse = (
  userMessage: string,
  salaryData: SalaryData
): NegotiationMessage => {
  // Simple AI logic to generate responses based on keywords in user message
  let responseContent = '';

  const isCounterOffer = /\$|salary|offer|counter/.test(userMessage.toLowerCase());
  const isAsking = /\?/.test(userMessage);
  const mentionsExperience = /experience|background|skill|expert/.test(userMessage.toLowerCase());
  const mentionsBenefits = /benefit|stock|bonus|vacation|pto/.test(userMessage.toLowerCase());

  if (isCounterOffer) {
    // Extract number if present
    const numberMatch = userMessage.match(/\$?([\d,]+)/);
    if (numberMatch) {
      const offeredAmount = parseInt(numberMatch[1].replace(/,/g, ''));
      
      if (offeredAmount > salaryData.max) {
        responseContent = `I appreciate the counteroffer of $${offeredAmount.toLocaleString()}. That's above our typical range for this position, but I'm impressed with your confidence in your value. Let me discuss this with the hiring team and get back to you within 24 hours. In the meantime, we can also look at strengthening your total compensation package with additional benefits.`;
      } else if (offeredAmount > salaryData.median) {
        responseContent = `Great! We can work with $${offeredAmount.toLocaleString()}/year. That demonstrates you understand your market value. Combined with our benefits package, this represents a competitive total compensation. Can you start in 2 weeks?`;
      } else if (offeredAmount >= salaryData.min) {
        responseContent = `I appreciate you coming back with a figure. We can meet you at $${offeredAmount.toLocaleString()}, though I want to ensure you're comfortable with this number given your experience level. Beyond salary, let's discuss additional equity, performance bonuses, or professional development budget to maximize your total package.`;
      } else {
        responseContent = `I understand you're looking at $${offeredAmount.toLocaleString()}. Given your background and the current market, we'd ideally like to keep it above $${salaryData.min.toLocaleString()}. However, I'd love to hear your thinking here—are there specific factors that inform this number?`;
      }
    }
  } else if (mentionsBenefits) {
    responseContent = `Excellent point about benefits. Beyond the base salary, we offer: 4 weeks PTO, 401k matching up to 6%, comprehensive health insurance, stock options vesting over 4 years, $2,000 annual professional development budget, and unlimited remote work flexibility. These add approximately 20-25% to your total compensation value. How does this comprehensive package look to you?`;
  } else if (mentionsExperience) {
    responseContent = `Your experience is definitely valued in our assessment. With your background and proven track record, you're positioned to make a significant impact on our team. The salary we've proposed reflects that. If there are specific projects or areas where your expertise could shine, I'd love to hear about what you're most excited to contribute.`;
  } else if (isAsking) {
    responseContent = `That's a great question. To give you better context: this role operates in a competitive market, and the salary range is designed to reflect industry standards for your seniority level while ensuring our company can invest in your growth. We're committed to reviewing compensation annually and promoting high performers. What would help clarify things for you?`;
  } else {
    responseContent = `Thank you for that input. It's important that both of us feel this is a win-win situation. Let's continue the conversation—what are the most important factors for you in this role beyond base salary?`;
  }

  return {
    id: Date.now().toString(),
    role: 'ai',
    content: responseContent,
    timestamp: new Date(),
  };
};

export const getMockAIResponse = (userMessage: string, salaryData: SalaryData): Promise<NegotiationMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAIResponse(userMessage, salaryData));
    }, 1500);
  });
};
