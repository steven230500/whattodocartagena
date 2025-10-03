import { Coordinates } from './commerce';

export type EventType = "festival" | "concierto" | "feria" | "mall_event" | "gastronomia" | "cultural";

export interface Event {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate?: Date;
  type: EventType;
  venue: string;
  relatedCommerceId?: string;
  coordinates: Coordinates;
  image: string;
  tags: string[];
  description: string;
  content?: string;
  price?: number;
  capacity?: number;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
}