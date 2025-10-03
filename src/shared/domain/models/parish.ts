export interface MassSchedule {
  day: string;
  times: string[];
}

export interface Parish {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  schedules: MassSchedule[];
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}