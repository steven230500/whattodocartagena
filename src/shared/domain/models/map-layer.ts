export interface MapLayer {
  id: string;
  label: string;
  color: string;
  icon: string;
  active?: boolean;
  category?: string;
  visible: boolean;
}