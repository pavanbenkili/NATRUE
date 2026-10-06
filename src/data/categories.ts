import type { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'transport', name: 'Transport', icon: 'DirectionsCar', color: '#2E7D4F' },
  { id: 'cycling', name: 'Cycling', icon: 'PedalBike', color: '#43A047' },
  { id: 'walking', name: 'Walking', icon: 'DirectionsWalk', color: '#66BB6A' },
  { id: 'energy', name: 'Energy', icon: 'Bolt', color: '#F9A825' },
  { id: 'water', name: 'Water', icon: 'WaterDrop', color: '#0288D1' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#8D6E63' },
  { id: 'plastic', name: 'Plastic', icon: 'Recycling', color: '#00897B' },
  { id: 'food', name: 'Food', icon: 'Restaurant', color: '#EF6C00' },
  { id: 'waste', name: 'Waste', icon: 'DeleteOutline', color: '#6D4C41' },
  { id: 'clothing', name: 'Clothing', icon: 'Checkroom', color: '#7E57C2' },
  { id: 'electronics', name: 'Electronics', icon: 'Devices', color: '#546E7A' },
  { id: 'home', name: 'Home', icon: 'Home', color: '#5D4037' },
  { id: 'nature', name: 'Nature', icon: 'Park', color: '#2E7D32' },
  { id: 'community', name: 'Community', icon: 'Groups', color: '#1565C0' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export const DIFFICULTY_POINTS = {
  easy: 5,
  medium: 10,
  hard: 20,
} as const;

export const MILESTONES = [
  { id: 'first-step', name: 'First Step', description: 'Complete your first action', threshold: 1, icon: '🌱' },
  { id: 'getting-started', name: 'Getting Started', description: 'Complete 7 actions', threshold: 7, icon: '🌿' },
  { id: 'habit-builder', name: 'Habit Builder', description: 'Complete 30 actions', threshold: 30, icon: '🌳' },
  { id: 'impact-maker', name: 'Impact Maker', description: 'Complete 100 actions', threshold: 100, icon: '🌍' },
];
