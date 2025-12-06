export enum ViewMode {
  BREATHE = 'BREATHE',
  SOUND = 'SOUND',
  VISUAL = 'VISUAL',
  INSIGHT = 'INSIGHT',
  AI_GUIDE = 'AI_GUIDE',
  ABOUT = 'ABOUT',
  RELEASE = 'RELEASE',
  NATURE_DIALOGUE = 'NATURE_DIALOGUE',
  SELF_HEAL = 'SELF_HEAL',
  SLEEP_HEAL = 'SLEEP_HEAL',
  ARTICLES = 'ARTICLES'
}

export interface Article {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  title: string;
  author: string;
  content: string;
  images?: string[]; // Array of image URLs
  externalUrl?: string; // External URL reference
  pdfUrl?: string; // PDF file URL
  wordUrl?: string; // Word file URL
  pdfFileName?: string; // PDF file name for display
  wordFileName?: string; // Word file name for display
}

export interface Quote {
  text: string;
  author: string;
}

export enum BreathingPhase {
  IDLE = 'IDLE',
  INHALE = 'INHALE',
  HOLD = 'HOLD',
  EXHALE = 'EXHALE'
}

export interface SoundTrack {
  id: string;
  name: string;
  type: 'brown' | 'pink' | 'white'; // Noise types generated via WebAudio
  color: string;
}

export interface AIResponseState {
  loading: boolean;
  content: string | null;
  error: string | null;
}
