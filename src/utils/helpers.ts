import type { Action, AppState, CategoryId, CompletedAction, ImpactType } from '../types';
import { ACTIONS } from '../data/actions';

export const STORAGE_KEY = 'nature-impact-state';

export const DEFAULT_STATE: AppState = {
  profile: {
    name: '',
    location: '',
    interests: [],
    notificationTime: '09:00',
    onboardingComplete: false,
  },
  completedActions: [],
  streak: 0,
  longestStreak: 0,
  streakFreezeUsed: false,
  lastCompletedDate: null,
  naturePoints: 0,
  todaysActionId: null,
  todaysActionDate: null,
  skippedToday: false,
};

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, profile: { ...DEFAULT_STATE.profile } };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE, profile: { ...DEFAULT_STATE.profile } };
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Rule-based daily action selection */
export function selectTodaysAction(state: AppState): Action {
  const today = todayKey();
  if (state.todaysActionId && state.todaysActionDate === today) {
    const existing = ACTIONS.find((a) => a.id === state.todaysActionId);
    if (existing) return existing;
  }

  const recentIds = new Set(
    state.completedActions.slice(0, 14).map((c) => c.actionId)
  );
  const recentCategories = state.completedActions
    .slice(0, 3)
    .map((c) => c.category);

  const interests = state.profile.interests;

  let pool = ACTIONS.filter((a) => !recentIds.has(a.id));
  if (pool.length < 10) pool = [...ACTIONS];

  // Prefer different category from last few
  const diversify = pool.filter((a) => !recentCategories.includes(a.category));
  if (diversify.length > 0) pool = diversify;

  // Prefer user interests
  if (interests.length > 0) {
    const interested = pool.filter((a) => interests.includes(a.category));
    if (interested.length > 0) pool = interested;
  }

  // Prefer easy/medium for habit building
  const easyMed = pool.filter((a) => a.difficulty !== 'hard');
  if (easyMed.length > 0) pool = easyMed;

  // Deterministic pick based on date so it stays stable for the day
  const seed = today.split('-').join('');
  const idx = parseInt(seed, 10) % pool.length;
  return pool[idx];
}

export function computeImpactTotals(completed: CompletedAction[]) {
  const totals: Record<ImpactType, number> = {
    co2e: 0,
    water: 0,
    plastic: 0,
    energy: 0,
    transport: 0,
    food: 0,
  };
  for (const c of completed) {
    totals[c.impactType] += c.impactValue;
  }
  return totals;
}

export function categoryContribution(completed: CompletedAction[]) {
  const map: Partial<Record<CategoryId, number>> = {};
  for (const c of completed) {
    map[c.category] = (map[c.category] || 0) + 1;
  }
  return Object.entries(map)
    .map(([id, count]) => ({ id: id as CategoryId, count: count! }))
    .sort((a, b) => b.count - a.count);
}

export function updateStreakOnComplete(state: AppState): Pick<
  AppState,
  'streak' | 'longestStreak' | 'lastCompletedDate' | 'streakFreezeUsed'
> {
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);

  let streak = state.streak;
  if (state.lastCompletedDate === today) {
    // already counted
  } else if (state.lastCompletedDate === yKey || state.lastCompletedDate === null) {
    streak = state.lastCompletedDate === null ? 1 : state.streak + 1;
  } else if (!state.streakFreezeUsed) {
    // streak freeze: one miss allowed
    streak = state.streak + 1;
  } else {
    streak = 1;
  }

  return {
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastCompletedDate: today,
    streakFreezeUsed: state.lastCompletedDate === yKey || state.lastCompletedDate === null || state.lastCompletedDate === today
      ? state.streakFreezeUsed
      : true,
  };
}

export function roundImpact(n: number): string {
  if (n >= 10) return n.toFixed(1);
  if (n >= 1) return n.toFixed(1);
  return n.toFixed(2);
}
