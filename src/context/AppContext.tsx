import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Action, AppState, CompletedAction, UserProfile } from '../types';
import {
  loadState,
  saveState,
  selectTodaysAction,
  todayKey,
  updateStreakOnComplete,
} from '../utils/helpers';
import { ACTIONS_MAP } from '../data/actions';

interface AppContextValue {
  state: AppState;
  todaysAction: Action;
  completedToday: boolean;
  completeOnboarding: (profile: Omit<UserProfile, 'onboardingComplete'>) => void;
  completeAction: (action?: Action) => CompletedAction;
  skipToday: () => void;
  tryAction: (action: Action) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Ensure today's action is assigned
  useEffect(() => {
    const today = todayKey();
    if (state.todaysActionDate !== today || !state.todaysActionId) {
      const action = selectTodaysAction(state);
      setState((s) => ({
        ...s,
        todaysActionId: action.id,
        todaysActionDate: today,
        skippedToday: s.todaysActionDate === today ? s.skippedToday : false,
      }));
    }
  }, [state.todaysActionDate, state.todaysActionId]);

  const todaysAction = useMemo(() => {
    if (state.todaysActionId && ACTIONS_MAP[state.todaysActionId]) {
      return ACTIONS_MAP[state.todaysActionId];
    }
    return selectTodaysAction(state);
  }, [state]);

  const completedToday = useMemo(() => {
    const today = todayKey();
    return state.completedActions.some((c) => c.completedAt.startsWith(today));
  }, [state.completedActions]);

  const completeOnboarding = useCallback(
    (profile: Omit<UserProfile, 'onboardingComplete'>) => {
      setState((s) => ({
        ...s,
        profile: { ...profile, onboardingComplete: true },
      }));
    },
    []
  );

  const completeAction = useCallback(
    (action?: Action) => {
      const a = action || todaysAction;
      const entry: CompletedAction = {
        id: `${a.id}-${Date.now()}`,
        actionId: a.id,
        completedAt: new Date().toISOString(),
        impactValue: a.impactFactor,
        impactType: a.impactType,
        impactLabel: a.impactLabel,
        impactUnit: a.impactUnit,
        points: a.points,
        title: a.title,
        category: a.category,
      };

      setState((s) => {
        const streakUpdate = updateStreakOnComplete(s);
        return {
          ...s,
          ...streakUpdate,
          completedActions: [entry, ...s.completedActions],
          naturePoints: s.naturePoints + a.points,
          skippedToday: false,
        };
      });

      return entry;
    },
    [todaysAction]
  );

  const skipToday = useCallback(() => {
    setState((s) => ({ ...s, skippedToday: true }));
  }, []);

  const tryAction = useCallback((action: Action) => {
    setState((s) => ({
      ...s,
      todaysActionId: action.id,
      todaysActionDate: todayKey(),
      skippedToday: false,
    }));
  }, []);

  const resetApp = useCallback(() => {
    localStorage.removeItem('nature-impact-state');
    setState(loadState());
  }, []);

  const value: AppContextValue = {
    state,
    todaysAction,
    completedToday,
    completeOnboarding,
    completeAction,
    skipToday,
    tryAction,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
