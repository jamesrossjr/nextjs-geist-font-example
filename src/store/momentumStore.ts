import { create } from 'zustand';

export interface ScoreData {
  score: number;
  delta: number;
  trend: number[];
  factors: string[];
  aiSuggestions: string[];
}

interface MomentumState {
  activity: ScoreData | null;
  quality: ScoreData | null;
  velocity: ScoreData | null;
  consistency: ScoreData | null;
  conversionEfficiency: ScoreData | null;
  focus: ScoreData | null;
  overallMomentum: ScoreData | null;
  loading: boolean;
  error: string | null;
  fetchMomentum: () => Promise<void>;
}

// Mock Gemini AI API response for development
const mockGeminiResponse = () => ({
  activity: {
    score: 85,
    delta: 5,
    trend: [75, 78, 80, 82, 83, 84, 85],
    factors: ['Increased call volume', 'More email responses', 'Higher meeting attendance'],
    aiSuggestions: ['Schedule follow-ups immediately after calls', 'Use email templates for faster responses']
  },
  quality: {
    score: 92,
    delta: 2,
    trend: [88, 89, 90, 90, 91, 91, 92],
    factors: ['Improved proposal quality', 'Better meeting preparation', 'Detailed follow-ups'],
    aiSuggestions: ['Create a pre-meeting checklist', 'Use case studies in proposals']
  },
  velocity: {
    score: 78,
    delta: -3,
    trend: [82, 81, 80, 79, 78, 78, 78],
    factors: ['Slower deal progression', 'Extended negotiation periods', 'Delayed responses'],
    aiSuggestions: ['Set clear next steps in every interaction', 'Use urgency triggers in communications']
  },
  consistency: {
    score: 88,
    delta: 4,
    trend: [82, 83, 84, 85, 86, 87, 88],
    factors: ['Regular client check-ins', 'Consistent follow-up schedule', 'Daily pipeline reviews'],
    aiSuggestions: ['Block time for daily prospecting', 'Create a weekly outreach schedule']
  },
  conversionEfficiency: {
    score: 75,
    delta: 8,
    trend: [65, 67, 69, 71, 73, 74, 75],
    factors: ['Improved qualification process', 'Better target account selection', 'Effective objection handling'],
    aiSuggestions: ['Document successful objection responses', 'Refine ideal customer profile']
  },
  focus: {
    score: 95,
    delta: 0,
    trend: [95, 95, 95, 95, 95, 95, 95],
    factors: ['Prioritized high-value opportunities', 'Time management improvement', 'Strategic account planning'],
    aiSuggestions: ['Use time blocking for key activities', 'Prioritize accounts by potential value']
  },
  overallMomentum: {
    score: 86,
    delta: 3,
    trend: [81, 82, 83, 84, 85, 85, 86],
    factors: ['Consistent improvement across metrics', 'Strong activity levels', 'Quality engagement'],
    aiSuggestions: ['Focus on maintaining high-performing areas', 'Address velocity challenges']
  }
});

export const useMomentumStore = create<MomentumState>((set) => ({
  activity: null,
  quality: null,
  velocity: null,
  consistency: null,
  conversionEfficiency: null,
  focus: null,
  overallMomentum: null,
  loading: false,
  error: null,
  fetchMomentum: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call to Gemini AI
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = mockGeminiResponse();
      set({
        ...data,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
