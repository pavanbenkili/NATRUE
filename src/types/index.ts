export type Difficulty = 'easy' | 'medium' | 'hard';
export type ImpactType = 'co2e' | 'water' | 'plastic' | 'energy' | 'transport' | 'food';
export type Frequency = 'daily' | 'weekly' | 'occasional';

export type CategoryId =
  | 'transport'
  | 'cycling'
  | 'walking'
  | 'energy'
  | 'water'
  | 'shopping'
  | 'plastic'
  | 'food'
  | 'waste'
  | 'clothing'
  | 'electronics'
  | 'home'
  | 'nature'
  | 'community';

export interface Action {
  id: string;
  title: string;
  description: string;
  question: string;
  category: CategoryId;
  difficulty: Difficulty;
  frequency: Frequency;
  impactType: ImpactType;
  impactFactor: number;
  impactUnit: string;
  impactLabel: string;
  source: string;
  confidence: 'high' | 'medium' | 'estimated';
  points: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export interface CompletedAction {
  id: string;
  actionId: string;
  completedAt: string;
  impactValue: number;
  impactType: ImpactType;
  impactLabel: string;
  impactUnit: string;
  points: number;
  title: string;
  category: CategoryId;
}

export interface UserProfile {
  name: string;
  location: string;
  interests: CategoryId[];
  notificationTime: string;
  onboardingComplete: boolean;
}

export interface AppState {
  profile: UserProfile;
  completedActions: CompletedAction[];
  streak: number;
  longestStreak: number;
  streakFreezeUsed: boolean;
  lastCompletedDate: string | null;
  naturePoints: number;
  todaysActionId: string | null;
  todaysActionDate: string | null;
  skippedToday: boolean;
}
