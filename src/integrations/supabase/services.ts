import { supabase } from './client';
import { Database } from './types';
import { FloodSensor, FloodAlert, EmergencyContact } from '@/types';

type FloodSensorRow = Database['public']['Tables']['flood_sensors']['Row'];
type SensorReadingRow = Database['public']['Tables']['sensor_readings']['Row'];
type FloodAlertRow = Database['public']['Tables']['flood_alerts']['Row'];
type EmergencyContactRow = Database['public']['Tables']['emergency_contacts']['Row'];

// Flood Sensors Service
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

// Emergency Contacts Service
export class EmergencyContactService {
  static async getEmergencyContacts(district: string, state: string): Promise<EmergencyContact[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('district', district)
        .eq('state', state)
        .eq('is_available', true)
        .order('is_primary', { ascending: false })
        .order('department');

      if (error) throw error;

      return data.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        department: contact.department,
        designation: contact.designation,
        district: contact.district,
        state: contact.state,
        isAvailable: contact.is_available,
      })) as EmergencyContact[];
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }
  }

  static async getPrimaryContacts(district: string, state: string): Promise<EmergencyContact[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('district', district)
        .eq('state', state)
        .eq('is_primary', true)
        .eq('is_available', true);

      if (error) throw error;

      return data.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        department: contact.department,
        designation: contact.designation,
        district: contact.district,
        state: contact.state,
        isAvailable: contact.is_available,
      })) as EmergencyContact[];
    } catch (error) {
      console.error('Error fetching primary contacts:', error);
      return [];
    }
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
