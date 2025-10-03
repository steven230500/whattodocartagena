export type CollectibleRarity = "common" | "rare" | "epic" | "legendary";

export interface Collectible {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: CollectibleRarity;
  category: string;
  points: number;
  isCollected: boolean;
  collectedAt?: Date;
  coordinates?: {
    lat: number;
    lng: number;
  };
  locationHint?: string;
  createdAt: Date;
  updatedAt: Date;
}