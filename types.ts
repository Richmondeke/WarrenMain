export enum Role {
  INVESTOR = 'INVESTOR',
  FOUNDER = 'FOUNDER'
}

export enum StartupStage {
  SEED = 'Seed',
  SERIES_A = 'Series A',
  SERIES_B = 'Series B',
  GROWTH = 'Growth'
}

export enum DealStage {
  SOURCED = 'Sourced',
  REVIEWING = 'Reviewing',
  DUE_DILIGENCE = 'Due Diligence',
  CLOSED = 'Closed',
  PASSED = 'Passed'
}

export interface Profile {
  id: string;
  role: Role;
  name: string;
  firm_name?: string; // For Investors
  title?: string;
  avatar_url?: string;
}

export interface Startup {
  id: string;
  founder_id: string;
  name: string;
  description: string;
  sector: string;
  stage: StartupStage;
  ask: number;
  valuation: number;
  location: string;
  logo_url?: string;
  match_score?: number; // Calculated field
  stats?: {
    mrr: number;
    growth: number; // percentage
  };
}

export interface Deal {
  id: string;
  investor_id: string;
  startup_id: string;
  startup: Startup;
  stage: DealStage;
  is_shortlisted: boolean;
  notes?: string;
  updated_at: string;
}

export interface Document {
  id: string;
  startup_id: string;
  name: string;
  type: 'PDF' | 'Excel' | 'Deck' | 'Legal';
  size: string;
  uploaded_at: string;
  status: 'Ready' | 'Processing';
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_ai_generated?: boolean;
}

export interface Thread {
  id: string;
  participants: Profile[];
  last_message?: Message;
  unread_count: number;
}

export interface InvestorDirectoryItem {
  id: string;
  name: string;
  website: string;
  hq: string;
  stages: string[];
  thesis: string;
  type: string;
  cheque_range: string;
  match_score: number;
}