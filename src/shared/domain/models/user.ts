import { Collectible } from './collectible';

export interface UserStats {
  totalPoints: number;
  collectedItems: number;
  completedRoutes: number;
  visitedPlaces: number;
  level: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  points: number;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  stats: UserStats;
  collectedItems: string[]; // collectible IDs
  completedRoutes: string[]; // route IDs
  achievements: UserAchievement[];
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}