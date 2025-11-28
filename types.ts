export enum View {
  DASHBOARD = 'DASHBOARD',
  LEVEL_CHECK = 'LEVEL_CHECK',
  ROLEPLAY = 'ROLEPLAY',
  LIVE_CONVERSATION = 'LIVE_CONVERSATION',
  DOC_REVIEW = 'DOC_REVIEW',
  MULTIMODAL = 'MULTIMODAL'
}

export enum CEFRLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export interface UserProfile {
  name: string;
  level: CEFRLevel;
  industry: string;
  streak: number;
  lessonsCompleted: number;
  badges: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  feedback?: string; // Grammar/tone correction for user messages
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
}
