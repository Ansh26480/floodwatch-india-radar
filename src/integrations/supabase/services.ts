import { supabase } from './client';
import { Database } from './types';
import { FloodSensor, FloodAlert, EmergencyContact } from '@/types';

type FloodSensorRow = Database['public']['Tables']['flood_sensors']['Row'];
type SensorReadingRow = Database['public']['Tables']['sensor_readings']['Row'];
type FloodAlertRow = Database['public']['Tables']['flood_alerts']['Row'];
type EmergencyContactRow = Database['public']['Tables']['emergency_contacts']['Row'];

// Enhanced Flood Sensors Service
export class FloodSensorService {
  static async getAllSensors(): Promise<FloodSensor[]> {
    try {
      const { data, error } = await supabase
        .from('flood_sensors')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      // Get latest readings for each sensor
      const sensorsWithReadings = await Promise.all(
        data.map(async (sensor) => {
          const { data: readings } = await supabase
            .from('sensor_readings')
            .select('*')
            .eq('sensor_id', sensor.id)
            .order('timestamp', { ascending: false })
            .limit(1);

          const latestReading = readings?.[0];

          return {
            id: sensor.id,
            name: sensor.name,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            waterLevel: latestReading?.water_level || 0,
            batteryLevel: sensor.battery_level,
            status: sensor.status,
            riskLevel: latestReading?.risk_level || 'safe',
            lastUpdated: latestReading?.timestamp || sensor.updated_at,
            district: sensor.district,
            state: sensor.state,
          } as FloodSensor;
        })
      );

      return sensorsWithReadings;
    } catch (error) {
      console.error('Error fetching flood sensors:', error);
      return [];
    }
  }

  static async getSensorById(id: string): Promise<FloodSensor | null> {
    try {
      const { data: sensor, error } = await supabase
        .from('flood_sensors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { data: readings } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('sensor_id', id)
        .order('timestamp', { ascending: false })
        .limit(1);

      const latestReading = readings?.[0];

      return {
        id: sensor.id,
        name: sensor.name,
        latitude: sensor.latitude,
        longitude: sensor.longitude,
        waterLevel: latestReading?.water_level || 0,
        batteryLevel: sensor.battery_level,
        status: sensor.status,
        riskLevel: latestReading?.risk_level || 'safe',
        lastUpdated: latestReading?.timestamp || sensor.updated_at,
        district: sensor.district,
        state: sensor.state,
      } as FloodSensor;
    } catch (error) {
      console.error('Error fetching sensor:', error);
      return null;
    }
  }

  static async getSensorsByDistrict(district: string): Promise<FloodSensor[]> {
    try {
      const { data, error } = await supabase
        .from('flood_sensors')
        .select('*')
        .eq('district', district)
        .eq('status', 'active');

      if (error) throw error;

      const sensorsWithReadings = await Promise.all(
        data.map(async (sensor) => {
          const { data: readings } = await supabase
            .from('sensor_readings')
            .select('*')
            .eq('sensor_id', sensor.id)
            .order('timestamp', { ascending: false })
            .limit(1);

          const latestReading = readings?.[0];

          return {
            id: sensor.id,
            name: sensor.name,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            waterLevel: latestReading?.water_level || 0,
            batteryLevel: sensor.battery_level,
            status: sensor.status,
            riskLevel: latestReading?.risk_level || 'safe',
            lastUpdated: latestReading?.timestamp || sensor.updated_at,
            district: sensor.district,
            state: sensor.state,
          } as FloodSensor;
        })
      );

      return sensorsWithReadings;
    } catch (error) {
      console.error('Error fetching sensors by district:', error);
      return [];
    }
  }

  // Subscribe to real-time sensor updates
  static subscribeToSensorUpdates(
    callback: (sensors: FloodSensor[]) => void,
    district?: string
  ) {
    const channel = supabase
      .channel('sensor_readings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensor_readings',
        },
        async () => {
          // Refetch sensors when readings update
          const sensors = district 
            ? await this.getSensorsByDistrict(district)
            : await this.getAllSensors();
          callback(sensors);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
}

// Flood Alerts Service
export class FloodAlertService {
  static async getActiveAlerts(district?: string): Promise<FloodAlert[]> {
    try {
      let query = supabase
        .from('flood_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (district) {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(alert => ({
        id: alert.id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        location: {
          name: alert.location_name,
          latitude: alert.latitude,
          longitude: alert.longitude,
          district: alert.district,
          state: alert.state,
        },
        timestamp: alert.created_at,
        isActive: alert.is_active,
        affectedAreas: alert.affected_areas,
        evacuationRequired: alert.evacuation_required,
      })) as FloodAlert[];
    } catch (error) {
      console.error('Error fetching flood alerts:', error);
      return [];
    }
  }

  static async createAlert(alert: Omit<FloodAlert, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('flood_alerts')
        .insert({
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          location_name: alert.location.name,
          latitude: alert.location.latitude,
          longitude: alert.location.longitude,
          district: alert.location.district,
          state: alert.location.state,
          affected_areas: alert.affectedAreas,
          evacuation_required: alert.evacuationRequired,
          is_active: alert.isActive,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating alert:', error);
      return false;
    }
  }

  static async deactivateAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('flood_alerts')
        .update({ is_active: false })
        .eq('id', alertId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating alert:', error);
      return false;
    }
  }

  // Subscribe to real-time alert updates
  static subscribeToAlertUpdates(
    callback: (alerts: FloodAlert[]) => void,
    district?: string
  ) {
    const channel = supabase
      .channel('flood_alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flood_alerts',
        },
        async () => {
          const alerts = await this.getActiveAlerts(district);
          callback(alerts);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
}

// Historical Data Service
export class HistoricalDataService {
  static async getHistoricalFloods(district?: string, limit: number = 50) {
    try {
      let query = supabase
        .from('historical_floods')
        .select('*')
        .order('flood_date', { ascending: false })
        .limit(limit);

      if (district) {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching historical floods:', error);
      return [];
    }
  }

  static async getFloodsByDateRange(startDate: string, endDate: string, district?: string) {
    try {
      let query = supabase
        .from('historical_floods')
        .select('*')
        .gte('flood_date', startDate)
        .lte('flood_date', endDate)
        .order('flood_date', { ascending: false });

      if (district) {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching floods by date range:', error);
      return [];
    }
  }
}

// Incident Reports Service
export class IncidentReportService {
  static async createIncidentReport(report: {
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    district?: string;
    state?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    images?: string[];
  }) {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .insert({
          title: report.title,
          description: report.description,
          latitude: report.latitude,
          longitude: report.longitude,
          location_name: report.locationName,
          district: report.district,
          state: report.state,
          severity: report.severity,
          images: report.images || [],
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating incident report:', error);
      return false;
    }
  }

  static async getIncidentReports(district?: string) {
    try {
      let query = supabase
        .from('incident_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (district) {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching incident reports:', error);
      return [];
    }
  }
}

// Emergency Contacts Service
export class EmergencyContactService {
  static async getAllContacts() {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      throw error;
    }
  }

  static async getContactsByState(state: string) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('state', state)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching state contacts:', error);
      throw error;
    }
  }

  static async getContactsByDepartment(department: string) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('department', department)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching department contacts:', error);
      throw error;
    }
  }

  static async getNationalEmergencyContacts() {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('level', 'national')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching national contacts:', error);
      throw error;
    }
  }

  static async addContact(contact: any) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([contact])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  static async updateContact(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
}

// Real-time Statistics Service
export class StatisticsService {
  static async getDashboardStats() {
    try {
      // Get sensor statistics
      const { data: sensors, error: sensorError } = await supabase
        .from('flood_sensors')
        .select('status');
      
      if (sensorError) throw sensorError;

      // Get alert statistics
      const { data: alerts, error: alertError } = await supabase
        .from('flood_alerts')
        .select('severity, is_active')
        .eq('is_active', true);
      
      if (alertError) throw alertError;

      const stats = {
        totalSensors: sensors?.length || 0,
        activeSensors: sensors?.filter(s => s.status === 'active').length || 0,
        dangerZones: alerts?.filter(a => a.severity === 'high').length || 0,
        activeAlerts: alerts?.length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  static async getLocationRiskLevel(latitude: number, longitude: number) {
    try {
      // This would typically involve GIS calculations
      // For now, return mock data based on proximity to known flood zones
      const mockRiskData = {
        name: 'Mumbai Central',
        status: 'moderate' as const,
        riskLevel: 3
      };

      return mockRiskData;
    } catch (error) {
      console.error('Error calculating risk level:', error);
      throw error;
    }
  }
}

// Notification Service
export class NotificationService {
  static async sendPushNotification(message: string, title: string, userId?: string) {
    try {
      // In a real app, this would integrate with push notification services
      // For now, we'll use browser notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }

      // Also log to database for tracking
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          message,
          title,
          user_id: userId,
          type: 'push',
          sent_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  static async requestNotificationPermission() {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
}

// Location and Navigation Service
export class LocationService {
  static async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getLocationFromCoordinates(latitude: number, longitude: number): Promise<{
    district: string;
    state: string;
    city?: string;
    country?: string;
  }> {
    try {
      // Use OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }
      
      const data = await response.json();
      const address = data.address || {};
      
      // Map OpenStreetMap data to Indian administrative divisions
      const state = address.state || address.region || 'Unknown State';
      let district = address.county || address.district || address.city || 'Unknown District';
      
      // Clean up district name (remove " District" suffix if present)
      if (district.toLowerCase().endsWith(' district')) {
        district = district.slice(0, -9);
      }
      
      return {
        district,
        state,
        city: address.city || address.town || address.village,
        country: address.country || 'India'
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      
      // Fallback: Determine state based on rough coordinate ranges for major Indian states
      const stateFromCoords = this.getStateFromCoordinates(latitude, longitude);
      
      return {
        district: 'Unknown District',
        state: stateFromCoords,
        country: 'India'
      };
    }
  }

  static getStateFromCoordinates(lat: number, lng: number): string {
    // Rough coordinate boundaries for major Indian states
    const stateBoundaries = [
      { name: 'Punjab', minLat: 29.5, maxLat: 32.5, minLng: 74.0, maxLng: 76.9 },
      { name: 'Haryana', minLat: 27.6, maxLat: 30.9, minLng: 74.4, maxLng: 77.4 },
      { name: 'Rajasthan', minLat: 23.0, maxLat: 30.2, minLng: 69.5, maxLng: 78.3 },
      { name: 'Uttar Pradesh', minLat: 23.8, maxLat: 30.4, minLng: 77.1, maxLng: 84.6 },
      { name: 'Madhya Pradesh', minLat: 21.1, maxLat: 26.9, minLng: 74.0, maxLng: 82.8 },
      { name: 'Maharashtra', minLat: 15.6, maxLat: 22.0, minLng: 72.6, maxLng: 80.9 },
      { name: 'Gujarat', minLat: 20.1, maxLat: 24.7, minLng: 68.2, maxLng: 74.5 },
      { name: 'Karnataka', minLat: 11.3, maxLat: 18.5, minLng: 74.1, maxLng: 78.6 },
      { name: 'Kerala', minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.4 },
      { name: 'Tamil Nadu', minLat: 8.1, maxLat: 13.6, minLng: 76.2, maxLng: 80.3 },
      { name: 'Andhra Pradesh', minLat: 12.6, maxLat: 19.9, minLng: 77.0, maxLng: 84.8 },
      { name: 'Telangana', minLat: 15.8, maxLat: 19.9, minLng: 77.3, maxLng: 81.1 },
      { name: 'Odisha', minLat: 17.8, maxLat: 22.6, minLng: 81.4, maxLng: 87.5 },
      { name: 'West Bengal', minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 },
      { name: 'Bihar', minLat: 24.3, maxLat: 27.5, minLng: 83.3, maxLng: 88.1 },
      { name: 'Jharkhand', minLat: 21.9, maxLat: 25.3, minLng: 83.3, maxLng: 87.6 },
      { name: 'Chhattisgarh', minLat: 17.8, maxLat: 24.1, minLng: 80.2, maxLng: 84.1 },
      { name: 'Himachal Pradesh', minLat: 30.2, maxLat: 33.2, minLng: 75.6, maxLng: 79.0 },
      { name: 'Uttarakhand', minLat: 28.4, maxLat: 31.5, minLng: 77.6, maxLng: 81.0 },
      { name: 'Assam', minLat: 24.1, maxLat: 28.2, minLng: 89.7, maxLng: 96.0 },
      { name: 'Jammu and Kashmir', minLat: 32.3, maxLat: 36.6, minLng: 73.3, maxLng: 80.3 },
      { name: 'Delhi', minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.3 }
    ];

    for (const state of stateBoundaries) {
      if (lat >= state.minLat && lat <= state.maxLat && 
          lng >= state.minLng && lng <= state.maxLng) {
        return state.name;
      }
    }

    return 'Unknown State';
  }

  static async shareLocation(latitude: number, longitude: number, message?: string) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Current Location',
          text: message || 'I am sharing my current location for emergency assistance.',
          url: `https://maps.google.com/?q=${latitude},${longitude}`
        });
        return true;
      } else {
        // Fallback: copy to clipboard
        const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        await navigator.clipboard.writeText(`${message || 'My location'}: ${locationUrl}`);
        return true;
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      return false;
    }
  }

  static getEvacuationRouteUrl(fromLat: number, fromLng: number, toLat: number, toLng: number) {
    return `https://maps.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
  }
}
