import type { CompletedAction } from '../types';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface LeaderboardPeer {
  id: string;
  name: string;
  location: string;
  dailyPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  dailyActions: number;
  weeklyActions: number;
  monthlyActions: number;
  /** Demo community placeholders — not live verified accounts */
  isDemo: true;
}

export interface RankedEntry {
  id: string;
  name: string;
  location: string;
  points: number;
  actions: number;
  isYou: boolean;
  isDemo: boolean;
  rank: number;
}

export function startOfDay(d = new Date()): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Start of local week (Monday) */
export function startOfWeek(d = new Date()): Date {
  const date = startOfDay(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function periodStart(period: LeaderboardPeriod, d = new Date()): Date {
  if (period === 'daily') return startOfDay(d);
  if (period === 'weekly') return startOfWeek(d);
  return startOfMonth(d);
}

export function endOfPeriod(period: LeaderboardPeriod, d = new Date()): Date {
  if (period === 'daily') {
    const end = startOfDay(d);
    end.setDate(end.getDate() + 1);
    return end;
  }
  if (period === 'weekly') {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return end;
  }
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

export function periodLabel(period: LeaderboardPeriod): string {
  if (period === 'daily') {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
  if (period === 'weekly') {
    const start = startOfWeek();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (x: Date) =>
      x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Genuine points from actions the user actually logged in this period */
export function genuinePeriodStats(
  completed: CompletedAction[],
  period: LeaderboardPeriod
): { points: number; actions: number } {
  const start = periodStart(period);
  const end = endOfPeriod(period);
  const inPeriod = completed.filter((c) => {
    const t = new Date(c.completedAt).getTime();
    return t >= start.getTime() && t < end.getTime();
  });
  return {
    points: inPeriod.reduce((sum, c) => sum + c.points, 0),
    actions: inPeriod.length,
  };
}

/**
 * Demo peers for UI only. Their scores are fixed placeholders.
 * Your row always uses genuine logged actions — never inflated.
 */
export const DEMO_PEERS: LeaderboardPeer[] = [
  { id: 'd1', name: 'Aisha K.', location: 'Mumbai', dailyPoints: 25, weeklyPoints: 85, monthlyPoints: 320, dailyActions: 3, weeklyActions: 12, monthlyActions: 48, isDemo: true },
  { id: 'd2', name: 'Rohan M.', location: 'Bangalore', dailyPoints: 20, weeklyPoints: 70, monthlyPoints: 280, dailyActions: 2, weeklyActions: 10, monthlyActions: 42, isDemo: true },
  { id: 'd3', name: 'Priya S.', location: 'Pune', dailyPoints: 15, weeklyPoints: 55, monthlyPoints: 210, dailyActions: 2, weeklyActions: 8, monthlyActions: 35, isDemo: true },
  { id: 'd4', name: 'Dev Patel', location: 'Ahmedabad', dailyPoints: 15, weeklyPoints: 45, monthlyPoints: 190, dailyActions: 2, weeklyActions: 7, monthlyActions: 30, isDemo: true },
  { id: 'd5', name: 'Meera L.', location: 'Chennai', dailyPoints: 10, weeklyPoints: 40, monthlyPoints: 165, dailyActions: 1, weeklyActions: 6, monthlyActions: 28, isDemo: true },
  { id: 'd6', name: 'Arjun N.', location: 'Hyderabad', dailyPoints: 10, weeklyPoints: 30, monthlyPoints: 140, dailyActions: 1, weeklyActions: 5, monthlyActions: 24, isDemo: true },
  { id: 'd7', name: 'Sara T.', location: 'Delhi', dailyPoints: 5, weeklyPoints: 25, monthlyPoints: 120, dailyActions: 1, weeklyActions: 4, monthlyActions: 20, isDemo: true },
  { id: 'd8', name: 'Kabir R.', location: 'Kochi', dailyPoints: 5, weeklyPoints: 15, monthlyPoints: 95, dailyActions: 1, weeklyActions: 3, monthlyActions: 16, isDemo: true },
];

function peerScore(p: LeaderboardPeer, period: LeaderboardPeriod) {
  if (period === 'daily') return { points: p.dailyPoints, actions: p.dailyActions };
  if (period === 'weekly') return { points: p.weeklyPoints, actions: p.weeklyActions };
  return { points: p.monthlyPoints, actions: p.monthlyActions };
}

export function buildLeaderboard(
  you: { name: string; location: string; points: number; actions: number },
  period: LeaderboardPeriod
): RankedEntry[] {
  const peers: RankedEntry[] = DEMO_PEERS.map((p) => {
    const score = peerScore(p, period);
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      points: score.points,
      actions: score.actions,
      isYou: false,
      isDemo: true,
      rank: 0,
    };
  });

  const youEntry: RankedEntry = {
    id: 'you',
    name: you.name || 'You',
    location: you.location || 'Earth',
    points: you.points,
    actions: you.actions,
    isYou: true,
    isDemo: false,
    rank: 0,
  };

  const sorted = [...peers, youEntry].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.actions !== a.actions) return b.actions - a.actions;
    if (a.isYou) return -1;
    if (b.isYou) return 1;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function rankSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
