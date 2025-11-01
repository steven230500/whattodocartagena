export type PoiType =
  | "historic"
  | "food"
  | "culture"
  | "photo"
  | "mall"
  | "commerce";

export type LatLng = { lat: number; lng: number };

export type BasePoint = {
  id: number | string;
  name: string;
  description?: string;
  category?: string;
  rating?: number;
  coords: LatLng;
  image?: string;
  details?: string;
  neighborhood?: string;
  type: PoiType;
  commerceData?: any;
};