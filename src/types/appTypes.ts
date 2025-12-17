// Types for GeminiMind Application

export interface Question {
  id: number;
  text: string;
  type: 'analytical' | 'inferential' | 'evaluative' | 'application' | 'synthesis';
  difficulty: 'medium' | 'hard' | 'expert';
}

export interface UserAnswer {
  questionId: number;
  answer: string;
}

export interface QuestionFeedback {
  questionId: number;
  score: number; // 0-100
  isCorrect: boolean;
  feedback: string;
  keyInsightsMissed: string[];
  suggestedImprovement: string;
}

export interface EvaluationResult {
  overallScore: number;
  feedbacks: QuestionFeedback[];
  summary: string;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  tone: 'professional' | 'casual' | 'technical' | 'creative' | 'academic';
  expertiseAreas: string[];
  outputPreferences: {
    length: 'concise' | 'balanced' | 'detailed';
    format: 'structured' | 'flowing' | 'bullet-points';
    style: string;
  };
  systemPrompt: string;
  isDefault?: boolean;
}

export interface ContentType {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptTemplate: string;
}

export interface GeneratedContent {
  id: string;
  content: string;
  personaId: string;
  contentType: string;
  prompt: string;
  timestamp: Date;
}

export type AppTab = 'learning' | 'content';

export interface AppState {
  apiKey: string | null;
  activeTab: AppTab;
  isLoading: boolean;
}
