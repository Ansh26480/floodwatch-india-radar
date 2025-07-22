// FloodWatch India Radar - Type Definitions

export interface FloodSensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  waterLevel: number;
  batteryLevel: number;
  status: 'active' | 'inactive' | 'maintenance';
  riskLevel: 'safe' | 'moderate' | 'danger';
  lastUpdated: string;
  district: string;
  state: string;
}

export interface FloodAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  location: {
    name: string;
    latitude: number;
    longitude: number;
    district: string;
    state: string;
  };
  timestamp: string;
  isActive: boolean;
  affectedAreas: string[];
  evacuationRequired: boolean;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  forecast: {
    date: string;
    rainfall: number;
    temperature: number;
  }[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  department: string;
  designation?: string;
  district?: string;
  state: string;
  level?: 'national' | 'state' | 'district' | 'local';
  priority?: number;
  is_active?: boolean;
  isAvailable?: boolean;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: {
    latitude: number;
    longitude: number;
    name: string;
  };
  endPoint: {
    latitude: number;
    longitude: number;
    name: string;
  };
  waypoints: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
  status: 'open' | 'blocked' | 'congested';
  capacity: number;
  currentOccupancy: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'responder' | 'admin';
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    district: string;
    state: string;
  };
  isVerified: boolean;
  preferences: {
    notifications: boolean;
    alertTypes: string[];
    language: 'en' | 'hi' | 'bn' | 'ta' | 'te';
  };
}

export interface HistoricalFloodData {
  id: string;
  date: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    district: string;
    state: string;
  };
  maxWaterLevel: number;
  duration: number; // hours
  affectedPopulation: number;
  economicLoss: number; // in INR
  casualties: number;
  evacuated: number;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'danger-zones' | 'affected-areas' | 'historical-data' | 'prediction-zones' | 'evacuation-routes';
  isVisible: boolean;
  opacity: number;
  color: string;
  data: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}
