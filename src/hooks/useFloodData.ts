import { useState, useEffect } from 'react';
import { FloodSensor, FloodAlert, EmergencyContact } from '@/types';
import { 
  FloodSensorService, 
  FloodAlertService, 
  EmergencyContactService 
} from '@/integrations/supabase/services';

// Hook for real-time flood sensors
export function useFloodSensors(district?: string) {
  const [sensors, setSensors] = useState<FloodSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const data = district 
          ? await FloodSensorService.getSensorsByDistrict(district)
          : await FloodSensorService.getAllSensors();
        setSensors(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch sensor data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();

    // Subscribe to real-time updates
    const subscribeToUpdates = async () => {
      const unsubscribe = await FloodSensorService.subscribeToSensorUpdates(
        (updatedSensors) => {
          setSensors(updatedSensors);
        },
        district
      );
      return unsubscribe;
    };

    let unsubscribePromise: Promise<() => void> | null = null;
    subscribeToUpdates().then(unsub => {
      if (unsub) unsubscribePromise = Promise.resolve(unsub);
    });

    return () => {
      if (unsubscribePromise) {
        unsubscribePromise.then(unsub => unsub());
      }
    };
  }, [district]);

  return { sensors, loading, error, refetch: () => {
    const fetchSensors = async () => {
      const data = district 
        ? await FloodSensorService.getSensorsByDistrict(district)
        : await FloodSensorService.getAllSensors();
      setSensors(data);
    };
    fetchSensors();
  }};
}

// Hook for real-time flood alerts
export function useFloodAlerts(district?: string) {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await FloodAlertService.getActiveAlerts(district);
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch alerts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Subscribe to real-time updates
    const subscribeToUpdates = async () => {
      const unsubscribe = await FloodAlertService.subscribeToAlertUpdates(
        (updatedAlerts) => {
          setAlerts(updatedAlerts);
        },
        district
      );
      return unsubscribe;
    };

    let unsubscribePromise: Promise<() => void> | null = null;
    subscribeToUpdates().then(unsub => {
      if (unsub) unsubscribePromise = Promise.resolve(unsub);
    });

    return () => {
      if (unsubscribePromise) {
        unsubscribePromise.then(unsub => unsub());
      }
    };
  }, [district]);

  return { alerts, loading, error, refetch: () => {
    const fetchAlerts = async () => {
      const data = await FloodAlertService.getActiveAlerts(district);
      setAlerts(data);
    };
    fetchAlerts();
  }};
}

// Hook for emergency contacts
export function useEmergencyContacts(district: string, state: string) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await EmergencyContactService.getEmergencyContacts(district, state);
        setContacts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch emergency contacts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (district && state) {
      fetchContacts();
    }
  }, [district, state]);

  return { contacts, loading, error };
}

// Hook for user location with geolocation
export function useUserLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    district?: string;
    state?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Try to get location details from reverse geocoding
            // For now, default to Mumbai if we can't determine the exact location
            setLocation({
              latitude,
              longitude,
              district: 'Mumbai', // This should be determined from reverse geocoding
              state: 'Maharashtra'
            });
            setError(null);
          } catch (err) {
            setError('Failed to get location details');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location access denied by user');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable');
              break;
            case error.TIMEOUT:
              setError('Location request timed out');
              break;
            default:
              setError('An unknown error occurred');
              break;
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, []);

  return { location, loading, error };
}

// Hook for combined dashboard data
export function useDashboardData(userLocation?: { district: string; state: string }) {
  const { sensors, loading: sensorsLoading } = useFloodSensors(userLocation?.district);
  const { alerts, loading: alertsLoading } = useFloodAlerts(userLocation?.district);
  const { contacts, loading: contactsLoading } = useEmergencyContacts(
    userLocation?.district || '',
    userLocation?.state || ''
  );

  const loading = sensorsLoading || alertsLoading || contactsLoading;

  // Calculate statistics
  const stats = {
    totalSensors: sensors.length,
    activeSensors: sensors.filter(s => s.status === 'active').length,
    dangerZones: sensors.filter(s => s.riskLevel === 'danger').length,
    activeAlerts: alerts.filter(a => a.isActive).length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' || a.severity === 'danger').length,
    evacuationRequired: alerts.some(a => a.evacuationRequired && a.isActive)
  };

  return {
    sensors,
    alerts,
    contacts,
    stats,
    loading
  };
}
