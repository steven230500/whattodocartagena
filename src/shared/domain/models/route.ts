import { Coordinates } from './commerce';

export type RouteDifficulty = "easy" | "moderate" | "difficult";

export interface RouteStop {
  id: string;
  title: string;
  description: string;
  coordinates: Coordinates;
  image?: string;
  duration?: number; // in minutes
  distance?: number; // in meters
}

export interface Route {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: RouteDifficulty;
  duration: string; // e.g., "2-3 hours"
  distance: string; // e.g., "3.2 km"
  highlights: string[];
  stops: RouteStop[];
  image: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}