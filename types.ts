

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface TaskAnalysis {
  subtasks: Subtask[];
  risks: string[];
  estimatedEffort: string;
  strategicAdvice: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  tags: string[];
  dueDate?: string; // ISO Date string (YYYY-MM-DDTHH:mm)
  priority: number; // Higher number = higher priority
  aiGenerated?: boolean;
  imageUrl?: string;
  analysis?: TaskAnalysis;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  coverUrl?: string;
  lastModified: Date;
  tags: string[];
}

export type AITextOperation = 'summarize' | 'fix_grammar' | 'expand' | 'professional_tone' | 'continue';

export interface MiniAppChat {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export interface MiniApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  createdAt: Date;
  chatHistory: MiniAppChat[];
}

export interface Asset {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'video' | 'zip' | 'txt' | 'other';
  uploadDate: string;
  url?: string; // For preview
}

export interface WorldVault {
  id: string;
  name: string;
  description: string;
  isLocked: boolean;
  password?: string;
  content: Asset[];
}

export interface LinkResource {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email?: string;
  bio: string;
  age: string;     // New Field
  country: string; // New Field
  avatarUrl?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// --- NEW FEATURES ---

export interface JobOpportunity {
  id: string;
  role: string;
  company: string;
  location: string;
  salaryRange: string;
  link: string;
  postedAt: string;
  description: string;
  requirements: string[];
}

// Career Chat Types
export interface CareerChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'result';
  data?: CareerPathResult;
}

export interface CareerPathResult {
  roleTitle: string;
  salaryRange: string;
  growthTrend: string;
  roadmap: string[];
  recommendedSkills: string[];
}

export interface SavedQuery {
  id: string;
  query: string;
  type: 'job' | 'general';
  createdAt: Date;
}

// --- DYNAMIC GLOBE INTELLIGENCE ---

export type GlobalWidgetType = 'stat' | 'list' | 'tags' | 'text' | 'insight';

export interface GlobalWidgetContent {
  value?: string;      // For stats
  trend?: string;      // For stats (e.g., "+5%")
  label?: string;      // For stats (e.g., "Annual Growth")
  items?: string[];    // For lists and tags
  text?: string;       // For text blocks
}

export interface GlobalWidget {
  id: string;
  type: GlobalWidgetType;
  title: string;
  icon: string;        // Lucide icon name string
  content: GlobalWidgetContent;
  width: 'full' | 'half';
}

export interface GlobalAnalysisResult {
  summary: string; // High-level AI summary
  relevantContinents: string[]; // For map highlighting
  widgets: GlobalWidget[]; // Dynamic UI components
}

export interface TrendDeepDive {
  explanation: string;
  visualPrompt: string;
}

export interface GlobalChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}