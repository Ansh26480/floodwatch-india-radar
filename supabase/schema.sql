-- FloodWatch India Radar Database Schema
-- This file contains the database schema for Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'responder', 'admin')),
    district TEXT,
    state TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'bn', 'ta', 'te')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Flood sensors table
CREATE TABLE public.flood_sensors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    sensor_type TEXT DEFAULT 'water_level' CHECK (sensor_type IN ('water_level', 'rainfall', 'weather', 'combined')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
    battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
    installation_date DATE DEFAULT CURRENT_DATE,
    last_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Sensor readings table
CREATE TABLE public.sensor_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sensor_id UUID REFERENCES public.flood_sensors(id) ON DELETE CASCADE,
    water_level DECIMAL(5, 2),
    rainfall DECIMAL(5, 2),
    temperature DECIMAL(4, 2),
    humidity DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    pressure DECIMAL(7, 2),
    risk_level TEXT CHECK (risk_level IN ('safe', 'moderate', 'danger', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Flood alerts table
CREATE TABLE public.flood_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
    location_name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    affected_areas TEXT[], -- Array of area names
    evacuation_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    issued_by UUID REFERENCES public.profiles(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Emergency contacts table
CREATE TABLE public.emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Evacuation routes table
CREATE TABLE public.evacuation_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    start_name TEXT NOT NULL,
    end_latitude DECIMAL(10, 8) NOT NULL,
    end_longitude DECIMAL(11, 8) NOT NULL,
    end_name TEXT NOT NULL,
    waypoints JSONB, -- Array of {lat, lng, name} objects
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'blocked', 'congested', 'maintenance')),
    capacity INTEGER DEFAULT 0,
    current_occupancy INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Historical flood data table
CREATE TABLE public.historical_floods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flood_date DATE NOT NULL,
    location_name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    max_water_level DECIMAL(5, 2),
    duration_hours INTEGER,
    affected_population INTEGER DEFAULT 0,
    economic_loss DECIMAL(15, 2) DEFAULT 0, -- in INR
    casualties INTEGER DEFAULT 0,
    evacuated INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Incident reports table (user-generated reports)
CREATE TABLE public.incident_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reported_by UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_name TEXT,
    district TEXT,
    state TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'false_alarm')),
    images TEXT[], -- Array of image URLs
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notification logs table
CREATE TABLE public.notification_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    alert_id UUID REFERENCES public.flood_alerts(id),
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
    message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_sensor_readings_sensor_id_timestamp ON public.sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp DESC);
CREATE INDEX idx_flood_alerts_active ON public.flood_alerts(is_active, created_at DESC);
CREATE INDEX idx_flood_alerts_location ON public.flood_alerts(district, state);
CREATE INDEX idx_incident_reports_status ON public.incident_reports(status, created_at DESC);
CREATE INDEX idx_incident_reports_location ON public.incident_reports(district, state);

-- Create spatial indexes for location-based queries
CREATE INDEX idx_flood_sensors_location ON public.flood_sensors USING GIST (ST_Point(longitude, latitude));
CREATE INDEX idx_flood_alerts_location ON public.flood_alerts USING GIST (ST_Point(longitude, latitude));

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flood_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flood_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evacuation_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_floods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Sensors and readings policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view sensors" ON public.flood_sensors FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view sensor readings" ON public.sensor_readings FOR SELECT USING (TRUE);

-- Alerts policies
CREATE POLICY "Anyone can view active alerts" ON public.flood_alerts FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Responders can manage alerts" ON public.flood_alerts FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('responder', 'admin')
    )
);

-- Emergency contacts policies
CREATE POLICY "Anyone can view emergency contacts" ON public.emergency_contacts FOR SELECT USING (TRUE);

-- Evacuation routes policies
CREATE POLICY "Anyone can view evacuation routes" ON public.evacuation_routes FOR SELECT USING (TRUE);

-- Historical data policies
CREATE POLICY "Anyone can view historical floods" ON public.historical_floods FOR SELECT USING (TRUE);

-- Incident reports policies
CREATE POLICY "Users can view all incident reports" ON public.incident_reports FOR SELECT USING (TRUE);
CREATE POLICY "Users can create incident reports" ON public.incident_reports FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own reports" ON public.incident_reports FOR UPDATE USING (auth.uid() = reported_by);

-- Notification logs policies
CREATE POLICY "Users can view own notifications" ON public.notification_logs FOR SELECT USING (auth.uid() = user_id);

-- Functions and triggers

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flood_sensors_updated_at BEFORE UPDATE ON public.flood_sensors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flood_alerts_updated_at BEFORE UPDATE ON public.flood_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evacuation_routes_updated_at BEFORE UPDATE ON public.evacuation_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate risk level based on water level
CREATE OR REPLACE FUNCTION calculate_risk_level(water_level DECIMAL)
RETURNS TEXT AS $$
BEGIN
    IF water_level < 1 THEN
        RETURN 'safe';
    ELSIF water_level < 2 THEN
        RETURN 'moderate';
    ELSIF water_level < 3 THEN
        RETURN 'danger';
    ELSE
        RETURN 'critical';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for testing
INSERT INTO public.flood_sensors (name, latitude, longitude, district, state) VALUES
('Mithi River - Dharavi', 19.0423, 72.8449, 'Mumbai', 'Maharashtra'),
('Bandra Creek', 19.0596, 72.8295, 'Mumbai', 'Maharashtra'),
('Powai Lake', 19.1197, 72.9073, 'Mumbai', 'Maharashtra'),
('Versova Creek', 19.1317, 72.8049, 'Mumbai', 'Maharashtra'),
('Thane Creek', 19.2183, 72.9781, 'Thane', 'Maharashtra');

INSERT INTO public.emergency_contacts (name, phone, department, designation, district, state, is_primary) VALUES
('Mumbai Fire Brigade', '101', 'Fire Department', 'Emergency Response', 'Mumbai', 'Maharashtra', TRUE),
('Mumbai Police Control Room', '100', 'Police', 'Emergency Response', 'Mumbai', 'Maharashtra', TRUE),
('Municipal Emergency Control', '1916', 'BMC', 'Disaster Management', 'Mumbai', 'Maharashtra', TRUE),
('Coast Guard Mumbai', '1554', 'Coast Guard', 'Marine Emergency', 'Mumbai', 'Maharashtra', FALSE),
('State Disaster Control Room', '1077', 'NDMA', 'State Coordination', 'Mumbai', 'Maharashtra', FALSE);
