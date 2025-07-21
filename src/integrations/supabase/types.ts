export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flood_sensors: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          district: string
          state: string
          sensor_type: 'water_level' | 'rainfall' | 'weather' | 'combined'
          status: 'active' | 'inactive' | 'maintenance' | 'error'
          battery_level: number
          installation_date: string
          last_maintenance: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          latitude: number
          longitude: number
          district: string
          state: string
          sensor_type?: 'water_level' | 'rainfall' | 'weather' | 'combined'
          status?: 'active' | 'inactive' | 'maintenance' | 'error'
          battery_level?: number
          installation_date?: string
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          district?: string
          state?: string
          sensor_type?: 'water_level' | 'rainfall' | 'weather' | 'combined'
          status?: 'active' | 'inactive' | 'maintenance' | 'error'
          battery_level?: number
          installation_date?: string
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sensor_readings: {
        Row: {
          id: string
          sensor_id: string
          water_level: number | null
          rainfall: number | null
          temperature: number | null
          humidity: number | null
          wind_speed: number | null
          pressure: number | null
          risk_level: 'safe' | 'moderate' | 'danger' | 'critical' | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          sensor_id: string
          water_level?: number | null
          rainfall?: number | null
          temperature?: number | null
          humidity?: number | null
          wind_speed?: number | null
          pressure?: number | null
          risk_level?: 'safe' | 'moderate' | 'danger' | 'critical' | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          sensor_id?: string
          water_level?: number | null
          rainfall?: number | null
          temperature?: number | null
          humidity?: number | null
          wind_speed?: number | null
          pressure?: number | null
          risk_level?: 'safe' | 'moderate' | 'danger' | 'critical' | null
          timestamp?: string
          created_at?: string
        }
      }
      flood_alerts: {
        Row: {
          id: string
          title: string
          message: string
          severity: 'info' | 'warning' | 'danger' | 'critical'
          location_name: string
          latitude: number
          longitude: number
          district: string
          state: string
          affected_areas: string[]
          evacuation_required: boolean
          is_active: boolean
          issued_by: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          severity: 'info' | 'warning' | 'danger' | 'critical'
          location_name: string
          latitude: number
          longitude: number
          district: string
          state: string
          affected_areas?: string[]
          evacuation_required?: boolean
          is_active?: boolean
          issued_by?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          severity?: 'info' | 'warning' | 'danger' | 'critical'
          location_name?: string
          latitude?: number
          longitude?: number
          district?: string
          state?: string
          affected_areas?: string[]
          evacuation_required?: boolean
          is_active?: boolean
          issued_by?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'citizen' | 'responder' | 'admin'
          district: string | null
          state: string | null
          latitude: number | null
          longitude: number | null
          is_verified: boolean
          notifications_enabled: boolean
          preferred_language: 'en' | 'hi' | 'bn' | 'ta' | 'te'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          role?: 'citizen' | 'responder' | 'admin'
          district?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          is_verified?: boolean
          notifications_enabled?: boolean
          preferred_language?: 'en' | 'hi' | 'bn' | 'ta' | 'te'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'citizen' | 'responder' | 'admin'
          district?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          is_verified?: boolean
          notifications_enabled?: boolean
          preferred_language?: 'en' | 'hi' | 'bn' | 'ta' | 'te'
          created_at?: string
          updated_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          department: string
          designation: string
          district: string
          state: string
          is_available: boolean
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          department: string
          designation: string
          district: string
          state: string
          is_available?: boolean
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          department?: string
          designation?: string
          district?: string
          state?: string
          is_available?: boolean
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      evacuation_routes: {
        Row: {
          id: string
          name: string
          start_latitude: number
          start_longitude: number
          start_name: string
          end_latitude: number
          end_longitude: number
          end_name: string
          waypoints: Json | null
          district: string
          state: string
          status: 'open' | 'blocked' | 'congested' | 'maintenance'
          capacity: number
          current_occupancy: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          start_latitude: number
          start_longitude: number
          start_name: string
          end_latitude: number
          end_longitude: number
          end_name: string
          waypoints?: Json | null
          district: string
          state: string
          status?: 'open' | 'blocked' | 'congested' | 'maintenance'
          capacity?: number
          current_occupancy?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_latitude?: number
          start_longitude?: number
          start_name?: string
          end_latitude?: number
          end_longitude?: number
          end_name?: string
          waypoints?: Json | null
          district?: string
          state?: string
          status?: 'open' | 'blocked' | 'congested' | 'maintenance'
          capacity?: number
          current_occupancy?: number
          created_at?: string
          updated_at?: string
        }
      }
      historical_floods: {
        Row: {
          id: string
          flood_date: string
          location_name: string
          latitude: number
          longitude: number
          district: string
          state: string
          max_water_level: number | null
          duration_hours: number | null
          affected_population: number
          economic_loss: number
          casualties: number
          evacuated: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          flood_date: string
          location_name: string
          latitude: number
          longitude: number
          district: string
          state: string
          max_water_level?: number | null
          duration_hours?: number | null
          affected_population?: number
          economic_loss?: number
          casualties?: number
          evacuated?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          flood_date?: string
          location_name?: string
          latitude?: number
          longitude?: number
          district?: string
          state?: string
          max_water_level?: number | null
          duration_hours?: number | null
          affected_population?: number
          economic_loss?: number
          casualties?: number
          evacuated?: number
          description?: string | null
          created_at?: string
        }
      }
      incident_reports: {
        Row: {
          id: string
          reported_by: string | null
          title: string
          description: string | null
          latitude: number
          longitude: number
          location_name: string | null
          district: string | null
          state: string | null
          severity: 'low' | 'medium' | 'high' | 'critical' | null
          status: 'pending' | 'verified' | 'resolved' | 'false_alarm'
          images: string[]
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reported_by?: string | null
          title: string
          description?: string | null
          latitude: number
          longitude: number
          location_name?: string | null
          district?: string | null
          state?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical' | null
          status?: 'pending' | 'verified' | 'resolved' | 'false_alarm'
          images?: string[]
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reported_by?: string | null
          title?: string
          description?: string | null
          latitude?: number
          longitude?: number
          location_name?: string | null
          district?: string | null
          state?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical' | null
          status?: 'pending' | 'verified' | 'resolved' | 'false_alarm'
          images?: string[]
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_risk_level: {
        Args: {
          water_level: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
