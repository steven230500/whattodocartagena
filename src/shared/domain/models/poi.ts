import { Coordinates } from './commerce';

export type POICategory = "historic" | "food" | "culture" | "photo" | "mall" | "commerce";

export interface POIAction {
  label: string;
  href: string;
  type: "link" | "route" | "commerce";
}

export interface POI {
  id: string;
  title: string;
  slug: string;
  category: POICategory;
  coordinates: Coordinates;
  image: string;
  excerpt: string;
  content?: string;
  actions?: POIAction[];
  rating?: number;
  visitCount?: number;
  createdAt: Date;
  updatedAt: Date;
}