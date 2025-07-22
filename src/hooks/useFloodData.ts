import { useState, useEffect } from 'react';
import { FloodSensor, FloodAlert, EmergencyContact } from '@/types';
import { 
  FloodSensorService, 
  FloodAlertService, 
  EmergencyContactService,
  StatisticsService,
  NotificationService,
  LocationService
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
            
            // Try to get location details from reverse geocoding API
            const locationDetails = await LocationService.getLocationFromCoordinates(latitude, longitude);
            
            setLocation({
              latitude,
              longitude,
              district: locationDetails.district,
              state: locationDetails.state
            });
            setError(null);
          } catch (err) {
            // Fallback: Set coordinates without district/state info
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              district: 'Unknown District',
              state: 'Unknown State'
            });
            setError('Could not determine exact location details');
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

// Hook for emergency contacts with enhanced functionality
export function useEmergencyContacts(district?: string, state?: string) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        let data: EmergencyContact[] = [];

        if (state) {
          // Get state-specific contacts
          data = await EmergencyContactService.getContactsByState(state);
        } else {
          // Get all contacts
          data = await EmergencyContactService.getAllContacts();
        }

        // Always include national emergency contacts at the top
        const nationalContacts = await EmergencyContactService.getNationalEmergencyContacts();
        
        // Combine and deduplicate
        const allContacts = [...nationalContacts, ...data];
        const uniqueContacts = allContacts.filter((contact, index, self) => 
          index === self.findIndex(c => c.phone === contact.phone)
        );

        setContacts(uniqueContacts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch emergency contacts');
        console.error(err);
        
        // Fallback to hardcoded emergency contacts
        setContacts([
          {
            id: '1',
            name: 'Emergency Helpline',
            phone: '112',
            department: 'National Emergency',
            level: 'national',
            state: 'All India',
            priority: 1,
            is_active: true
          },
          {
            id: '2',
            name: 'Police',
            phone: '100',
            department: 'Police',
            level: 'national',
            state: 'All India',
            priority: 2,
            is_active: true
          },
          {
            id: '3',
            name: 'Fire Brigade',
            phone: '101',
            department: 'Fire Services',
            level: 'national',
            state: 'All India',
            priority: 3,
            is_active: true
          },
          {
            id: '4',
            name: 'Ambulance',
            phone: '108',
            department: 'Medical Emergency',
            level: 'national',
            state: 'All India',
            priority: 4,
            is_active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [district, state]);

  return { contacts, loading, error };
}

// Hook for dashboard statistics
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalSensors: 0,
    activeSensors: 0,
    dangerZones: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await StatisticsService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch statistics');
        console.error(err);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
}
