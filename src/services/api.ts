import axios from 'axios';
import { ApiResponse } from '@/types';

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather Service
export class WeatherService {
  private static openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  private static baseUrl = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await api.get(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric`
      );
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return {
        success: false,
        error: 'Failed to fetch weather data',
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async getWeatherForecast(lat: number, lon: number) {
    try {
      const response = await api.get(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric`
      );
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Forecast API Error:', error);
      return {
        success: false,
        error: 'Failed to fetch forecast data',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Emergency Services API
export class EmergencyService {
  private static baseUrl = import.meta.env.VITE_EMERGENCY_API_URL;

  static async getEmergencyContacts(district: string, state: string) {
    try {
      // Mock data for now - replace with actual API call
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Mumbai Fire Brigade',
            phone: '101',
            department: 'Fire Department',
            designation: 'Emergency Response',
            district: 'Mumbai',
            state: 'Maharashtra',
            isAvailable: true,
          },
          {
            id: '2',
            name: 'Mumbai Police Control Room',
            phone: '100',
            department: 'Police',
            designation: 'Emergency Response',
            district: 'Mumbai',
            state: 'Maharashtra',
            isAvailable: true,
          },
        ],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Emergency Service API Error:', error);
      return {
        success: false,
        error: 'Failed to fetch emergency contacts',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Location Service
export class LocationService {
  static async getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  static async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await api.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      return {
        success: true,
        data: response.data[0],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        success: false,
        error: 'Failed to get location details',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Utility functions
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
