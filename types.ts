
export enum PromptMode {
  GENERAL = 'General Purpose',
  CODE = 'Coding & Dev',
  MARKETING = 'Marketing & Copy',
  RESEARCH = 'Research & Analysis',
  CREATIVE = 'Creative Writing',
  DATA_ANALYTICS = 'Data & Analytics',
  TECHNICAL = 'Technical',
  ACADEMIC = 'Academic',
  BUSINESS = 'Business',
}

export const ModeDetails: Record<PromptMode, string> = {
  [PromptMode.GENERAL]: "Balanced optimization for any use case",
  [PromptMode.CODE]: "Optimized for algorithmic logic and syntax",
  [PromptMode.MARKETING]: "Persuasive copy, ads, and social media content",
  [PromptMode.RESEARCH]: "Structured for deep research and formal inquiry",
  [PromptMode.CREATIVE]: "Forged for storytelling and artistic depth",
  [PromptMode.DATA_ANALYTICS]: "Data processing, SQL, charts, and insights",
  [PromptMode.TECHNICAL]: "Focused on extreme precision and accuracy",
  [PromptMode.ACADEMIC]: "Academic papers, citations, and formal tone",
  [PromptMode.BUSINESS]: "Professional tone for high-stakes communication",
};

export const ModeIcons: Record<PromptMode, string> = {
  [PromptMode.GENERAL]: '⚡',
  [PromptMode.CODE]: '🧑‍💻',
  [PromptMode.MARKETING]: '📣',
  [PromptMode.RESEARCH]: '🔍',
  [PromptMode.CREATIVE]: '✍️',
  [PromptMode.DATA_ANALYTICS]: '📊',
  [PromptMode.TECHNICAL]: '🔧',
  [PromptMode.ACADEMIC]: '🎓',
  [PromptMode.BUSINESS]: '💼',
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
