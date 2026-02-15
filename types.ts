
export enum PromptMode {
  GENERAL = 'General Purpose',
  CREATIVE = 'Creative Writing',
  TECHNICAL = 'Technical',
  ACADEMIC = 'Academic',
  BUSINESS = 'Business',
  CODE = 'Code Generation'
}

export const ModeDetails: Record<PromptMode, string> = {
  [PromptMode.GENERAL]: "Balanced optimization for any use case",
  [PromptMode.CREATIVE]: "Forged for storytelling and artistic depth",
  [PromptMode.TECHNICAL]: "Focused on extreme precision and accuracy",
  [PromptMode.ACADEMIC]: "Structured for research and formal inquiry",
  [PromptMode.BUSINESS]: "Professional tone for high-stakes communication",
  [PromptMode.CODE]: "Optimized for algorithmic logic and syntax"
};

// Added missing AuthMode type for authentication state management
export type AuthMode = 'signin' | 'signup' | 'forgot-password';

export interface PromptMetrics {
  clarity: number;
  specificity: number;
  context: number;
  goalOrientation: number;
  structure: number;
  constraints: number;
}

export interface AnalysisResult {
  score: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  useCase: string;
  detailedAnalysis: string;
  metrics: PromptMetrics;
  strengths: string[];
  improvements: string[];
  improvedPrompt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  phone_verified?: boolean;
  plan: 'free' | 'pro';
  preferences?: {
    theme: 'dark' | 'light' | 'system';
    model?: string;
    outputFormat?: 'structured' | 'conversational';
    depthLevel?: number;
  };
  token_version?: number;
}

export interface PromptHistoryItem {
  id: string;
  original_prompt: string;
  improved_prompt: string;
  score: number;
  created_at: string;
  score_breakdown?: PromptMetrics;
  model?: string;
  duration_ms?: number;
  status?: string;
}

export interface AppState {
  originalPrompt: string;
  mode: PromptMode;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  user: User | null;
  currentView: 'workbench' | 'auth' | 'history';
  history: PromptHistoryItem[];
}
