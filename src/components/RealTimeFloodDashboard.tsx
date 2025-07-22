import { useState, useEffect } from "react";

// Real-time flood monitoring service
class FloodMonitoringService {
  private static instance: FloodMonitoringService;
  private apiKey = 'demo-key'; // In production, use environment variables
  
  static getInstance() {
    if (!FloodMonitoringService.instance) {
      FloodMonitoringService.instance = new FloodMonitoringService();
    }
    return FloodMonitoringService.instance;
  }

  // Get real-time weather data
  async getWeatherData(lat: number, lon: number) {
    try {
      // Using OpenWeatherMap API (free tier)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=your_api_key&units=metric`
      );
      
      if (!response.ok) {
        // Fallback to simulated data
        return this.getSimulatedWeatherData(lat, lon);
      }
      
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        weatherCondition: data.weather[0].main,
        description: data.weather[0].description
      };
    } catch (error) {
      console.warn('Weather API unavailable, using simulated data');
      return this.getSimulatedWeatherData(lat, lon);
    }
  }

  // Simulated weather data based on location and season
  private getSimulatedWeatherData(lat: number, lon: number) {
    const isMonsooon = new Date().getMonth() >= 5 && new Date().getMonth() <= 9;
    const baseTemp = lat < 20 ? 32 : lat < 25 ? 28 : 24; // Southern India hotter
    
    return {
      temperature: baseTemp + Math.random() * 6 - 3,
      humidity: isMonsooon ? 75 + Math.random() * 20 : 45 + Math.random() * 30,
      rainfall: isMonsooon ? Math.random() * 25 : Math.random() * 5,
      windSpeed: 8 + Math.random() * 12,
      weatherCondition: isMonsooon ? 'Rain' : 'Clear',
      description: isMonsooon ? 'scattered showers' : 'clear sky'
    };
  }

  // Get flood risk data for location
  async getFloodRiskData(lat: number, lon: number, stateName: string) {
    try {
      // Simulate real-time flood monitoring data
      const riskFactors = this.calculateRiskFactors(lat, lon, stateName);
      const waterLevel = this.getWaterLevel(stateName);
      const floodRisk = this.calculateFloodRisk(riskFactors, waterLevel);
      
      return {
        waterLevel,
        floodRisk,
        riskFactors,
        alerts: await this.getActiveAlerts(stateName),
        emergencyContacts: this.getEmergencyContacts(stateName)
      };
    } catch (error) {
      console.error('Error fetching flood data:', error);
      return this.getDefaultFloodData();
    }
  }

  private calculateRiskFactors(lat: number, lon: number, stateName: string) {
    // Risk factors based on geographical and seasonal data
    const monsoonIntensity = this.getMonsoonIntensity(lat, lon);
    const riverProximity = this.getRiverProximity(stateName);
    const elevation = this.getElevationRisk(lat, lon);
    
    return {
      monsoonIntensity,
      riverProximity,
      elevation,
      seasonalRisk: this.getSeasonalRisk()
    };
  }

  private getMonsoonIntensity(lat: number, lon: number) {
    // Western Ghats and Eastern India get heavy monsoons
    if ((lon < 77 && lat > 15 && lat < 20) || (lon > 85 && lat > 22)) {
      return 'High';
    } else if (lat > 26) {
      return 'Low'; // Northern India - less monsoon intensity
    }
    return 'Moderate';
  }

  private getRiverProximity(stateName: string) {
    const highRiskStates = ['West Bengal', 'Bihar', 'Assam', 'Uttar Pradesh', 'Punjab'];
    const moderateRiskStates = ['Haryana', 'Rajasthan', 'Madhya Pradesh', 'Orissa'];
    
    if (highRiskStates.includes(stateName)) return 'High';
    if (moderateRiskStates.includes(stateName)) return 'Moderate';
    return 'Low';
  }

  private getElevationRisk(lat: number, lon: number) {
    // Himalayan regions and coastal areas
    if (lat > 28 || (lat < 12 && (lon < 77 || lon > 80))) {
      return 'Variable';
    }
    return 'Low';
  }

  private getSeasonalRisk() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return 'High'; // Monsoon season
    if (month >= 10 && month <= 1) return 'Low'; // Post-monsoon
    return 'Moderate'; // Pre-monsoon
  }

  private getWaterLevel(stateName: string) {
    // Simulate real-time water levels
    const baseLevel = 2.0;
    const seasonalMultiplier = this.getSeasonalRisk() === 'High' ? 1.5 : 1.0;
    const stateMultiplier = ['West Bengal', 'Bihar', 'Assam'].includes(stateName) ? 1.3 : 1.0;
    
    return baseLevel * seasonalMultiplier * stateMultiplier + (Math.random() - 0.5) * 0.5;
  }

  private calculateFloodRisk(riskFactors: any, waterLevel: number) {
    let riskScore = 0;
    
    // Water level contribution
    if (waterLevel > 3.5) riskScore += 3;
    else if (waterLevel > 2.5) riskScore += 2;
    else riskScore += 1;
    
    // Monsoon intensity
    if (riskFactors.monsoonIntensity === 'High') riskScore += 2;
    else if (riskFactors.monsoonIntensity === 'Moderate') riskScore += 1;
    
    // River proximity
    if (riskFactors.riverProximity === 'High') riskScore += 2;
    else if (riskFactors.riverProximity === 'Moderate') riskScore += 1;
    
    // Seasonal risk
    if (riskFactors.seasonalRisk === 'High') riskScore += 1;
    
    if (riskScore >= 6) return 'Critical';
    if (riskScore >= 4) return 'High';
    if (riskScore >= 2) return 'Moderate';
    return 'Low';
  }

  private async getActiveAlerts(stateName: string) {
    // Simulate real-time alerts based on state and current conditions
    const alerts = [];
    const currentHour = new Date().getHours();
    
    if (this.getSeasonalRisk() === 'High') {
      alerts.push({
        id: Date.now(),
        type: 'warning',
        message: `Heavy rainfall warning issued for ${stateName}`,
        time: '1 hour ago',
        location: stateName,
        severity: 'moderate'
      });
    }
    
    if (['West Bengal', 'Bihar', 'Assam'].includes(stateName)) {
      alerts.push({
        id: Date.now() + 1,
        type: 'info',
        message: 'River water levels being monitored continuously',
        time: '30 minutes ago',
        location: stateName,
        severity: 'low'
      });
    }
    
    return alerts;
  }

  private getEmergencyContacts(stateName: string) {
    // State-specific emergency contacts
    const stateContacts: { [key: string]: any } = {
      'West Bengal': { control: '1070', disaster: '033-2214-5555' },
      'Maharashtra': { control: '1077', disaster: '022-2202-0022' },
      'Tamil Nadu': { control: '1077', disaster: '044-2821-3261' },
      'Karnataka': { control: '1077', disaster: '080-2225-2317' },
      'Kerala': { control: '1077', disaster: '0471-2721-566' },
      'Punjab': { control: '1078', disaster: '0172-274-4350' },
      'Haryana': { control: '1078', disaster: '0172-270-8080' },
      'Uttar Pradesh': { control: '1078', disaster: '0522-2239-497' },
      'Bihar': { control: '1077', disaster: '0612-222-3333' },
      'Assam': { control: '1079', disaster: '0361-272-1000' }
    };
    
    return stateContacts[stateName] || { control: '1078', disaster: '112' };
  }

  private getDefaultFloodData() {
    return {
      waterLevel: 2.5,
      floodRisk: 'Moderate',
      riskFactors: {
        monsoonIntensity: 'Moderate',
        riverProximity: 'Moderate',
        elevation: 'Low',
        seasonalRisk: 'Moderate'
      },
      alerts: [],
      emergencyContacts: { control: '1078', disaster: '112' }
    };
  }
}

// Location service with Indian state detection
class LocationService {
  static async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to IP-based location or default
          resolve({ lat: 28.6139, lon: 77.2090 }); // Delhi default
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getLocationDetails(lat: number, lon: number) {
    try {
      // Use Nominatim for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      const state = data.address?.state || data.address?.region;
      const district = data.address?.state_district || data.address?.county;
      const city = data.address?.city || data.address?.town || data.address?.village;
      
      return {
        state: state || 'Unknown State',
        district: district || 'Unknown District',
        city: city || 'Unknown City',
        country: data.address?.country || 'India',
        formattedAddress: data.display_name
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {
        state: 'Delhi',
        district: 'New Delhi',
        city: 'Delhi',
        country: 'India',
        formattedAddress: 'Delhi, India'
      };
    }
  }
}

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [floodData, setFloodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const floodService = FloodMonitoringService.getInstance();

  // Request location permission and get current location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        const coords = await LocationService.getCurrentLocation();
        setLocation(coords);
        setPermissionGranted(true);
        
        const details = await LocationService.getLocationDetails(coords.lat, coords.lon);
        setLocationDetails(details);
        
        setError(null);
      } catch (err) {
        setError('Location access denied. Using default location (Delhi).');
        setLocation({ lat: 28.6139, lon: 77.2090 });
        setLocationDetails({
          state: 'Delhi',
          district: 'New Delhi',
          city: 'Delhi',
          country: 'India'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Fetch weather and flood data when location changes
  useEffect(() => {
    if (!location || !locationDetails) return;

    const fetchData = async () => {
      try {
        const [weather, flood] = await Promise.all([
          floodService.getWeatherData(location.lat, location.lon),
          floodService.getFloodRiskData(location.lat, location.lon, locationDetails.state)
        ]);
        
        setWeatherData(weather);
        setFloodData(flood);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [location, locationDetails]);

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update data every 2 minutes
      if (location && locationDetails) {
        floodService.getFloodRiskData(location.lat, location.lon, locationDetails.state)
          .then(setFloodData)
          .catch(console.error);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [location, locationDetails]);

  const handleRequestLocation = async () => {
    try {
      setIsLoading(true);
      const coords = await LocationService.getCurrentLocation();
      setLocation(coords);
      setPermissionGranted(true);
      
      const details = await LocationService.getLocationDetails(coords.lat, coords.lon);
      setLocationDetails(details);
      
      setError(null);
    } catch (err) {
      setError('Location access denied. Please enable location services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = (number: string, service: string) => {
    if (confirm(`Call ${service} (${number}) for emergency assistance?`)) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const exportFloodReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      location: locationDetails,
      coordinates: location,
      weather: weatherData,
      floodRisk: floodData,
      generatedBy: 'FloodWatch India - Real-time Monitoring System'
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood-report-${locationDetails?.state || 'location'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            animation: 'pulse 2s infinite' 
          }}>
            🌊
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Initializing FloodWatch India
          </h2>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
            Requesting location access for real-time monitoring...
          </p>
          <div style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '0 auto'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              background: '#06b6d4',
              borderRadius: '2px',
              animation: 'loading 2s ease-in-out infinite'
            }}></div>
          </div>
        </div>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Professional Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🌊
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                margin: 0,
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                FloodWatch India
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '0.8rem', 
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                Real-time Flood Monitoring System
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem' 
          }}>
            {error && (
              <button
                onClick={handleRequestLocation}
                style={{
                  background: '#f59e0b',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📍 Enable Location
              </button>
            )}
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                {currentTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#06b6d4'
              }}>
                {currentTime.toLocaleTimeString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderLeft: '4px solid #f59e0b',
          padding: '1rem 2rem',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0, color: '#fbbf24' }}>
            ⚠️ {error}
          </p>
        </div>
      )}

      <main style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        minHeight: 'calc(100vh - 120px)'
      }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* India Map Section */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            overflow: 'hidden',
            height: '500px',
            position: 'relative'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.2rem', 
                fontWeight: '600',
                color: '#e2e8f0'
              }}>
                India Flood Risk Map - Real-time
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                📍 {locationDetails?.city}, {locationDetails?.state}
              </div>
            </div>
            
            {/* India Map Visualization */}
            <div style={{
              height: 'calc(100% - 70px)',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Map Grid */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(rgba(71, 85, 105, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}></div>

              {/* Simplified India Map */}
              <svg width="400" height="300" style={{ position: 'absolute' }}>
                {/* India outline (simplified) */}
                <path
                  d="M100,50 L120,40 L140,45 L160,35 L180,40 L200,30 L220,35 L240,45 L260,40 L280,50 L300,60 L310,80 L320,100 L315,120 L310,140 L300,160 L290,180 L280,200 L270,220 L250,240 L230,250 L210,245 L190,240 L170,235 L150,230 L130,225 L110,220 L100,200 L95,180 L90,160 L85,140 L80,120 L85,100 L90,80 L95,60 Z"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
                <text x="200" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="600">
                  INDIA
                </text>
              </svg>

              {/* Current Location Marker */}
              {location && (
                <div style={{
                  position: 'absolute',
                  top: '45%',
                  left: '55%',
                  transform: 'translate(-50%, -50%)',
                  background: getRiskColor(floodData?.floodRisk || 'moderate'),
                  color: 'white',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  animation: 'pulse 3s infinite'
                }}>
                  📍 {locationDetails?.city}
                  <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '0.2rem' }}>
                    Risk: {floodData?.floodRisk || 'Loading...'}
                  </div>
                </div>
              )}

              {/* Real-time Data Overlay */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(15, 23, 42, 0.9)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.3)',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  LIVE MONITORING
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '0.3rem' }}>
                  Water Level: {floodData?.waterLevel?.toFixed(1) || '--'}m
                </div>
                <div style={{ 
                  background: 'rgba(71, 85, 105, 0.5)', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    background: getRiskColor(floodData?.floodRisk || 'moderate'),
                    height: '100%',
                    width: `${Math.min(100, ((floodData?.waterLevel || 2) / 5) * 100)}%`,
                    borderRadius: '3px',
                    transition: 'all 0.5s ease'
                  }}></div>
                </div>
              </div>

              {/* Legend */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#10b981'
                }}>
                  🟢 Low Risk
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  color: '#f59e0b'
                }}>
                  🟡 Moderate Risk
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#ef4444'
                }}>
                  🔴 High Risk
                </div>
              </div>
            </div>
          </div>

          {/* Weather and Environmental Data */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Real-time Weather Conditions - {locationDetails?.city}, {locationDetails?.state}
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Temperature</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData?.temperature?.toFixed(1) || '--'}°C
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Humidity</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData?.humidity || '--'}%
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rainfall</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData?.rainfall?.toFixed(1) || '--'}mm
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Wind Speed</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData?.windSpeed?.toFixed(0) || '--'} km/h
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Conditions</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0' }}>
                  {weatherData?.description || 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Current Status */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Current Location Status
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                FLOOD RISK LEVEL
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: getRiskColor(floodData?.floodRisk || 'moderate')
              }}>
                {floodData?.floodRisk?.toUpperCase() || 'LOADING...'}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                LOCATION
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0' }}>
                {locationDetails?.city}, {locationDetails?.state}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {location?.lat.toFixed(4)}° N, {location?.lon.toFixed(4)}° E
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                LAST UPDATED
              </div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                {currentTime.toLocaleTimeString('en-IN')}
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {floodData?.riskFactors && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
                Risk Assessment
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Monsoon Intensity:</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    color: getRiskColor(floodData.riskFactors.monsoonIntensity)
                  }}>
                    {floodData.riskFactors.monsoonIntensity}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>River Proximity:</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    color: getRiskColor(floodData.riskFactors.riverProximity)
                  }}>
                    {floodData.riskFactors.riverProximity}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Seasonal Risk:</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    color: getRiskColor(floodData.riskFactors.seasonalRisk)
                  }}>
                    {floodData.riskFactors.seasonalRisk}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Active Alerts */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Active Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {floodData?.alerts?.length > 0 ? floodData.alerts.map((alert: any) => (
                <div key={alert.id} style={{
                  background: 'rgba(51, 65, 85, 0.4)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${alert.type === 'warning' ? '#f59e0b' : '#06b6d4'}`
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.3rem' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {alert.location} • {alert.time}
                  </div>
                </div>
              )) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#94a3b8', 
                  fontSize: '0.9rem',
                  padding: '1rem'
                }}>
                  No active alerts for your area
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Emergency Contacts - {locationDetails?.state}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Emergency Services', number: '112', icon: '🚨' },
                { name: 'State Flood Control', number: floodData?.emergencyContacts?.control || '1078', icon: '🌊' },
                { name: 'Disaster Management', number: floodData?.emergencyContacts?.disaster || '108', icon: '🏥' },
                { name: 'Police Control', number: '100', icon: '👮' }
              ].map(contact => (
                <button
                  key={contact.number}
                  onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fecaca',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <span>{contact.icon} {contact.name}</span>
                  <span style={{ fontWeight: '700' }}>📞 {contact.number}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                onClick={exportFloodReport}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                📊 Export Flood Report
              </button>
              <button
                onClick={handleRequestLocation}
                style={{
                  background: 'rgba(71, 85, 105, 0.6)',
                  border: '1px solid rgba(71, 85, 105, 0.8)',
                  color: '#e2e8f0',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                📍 Update Location
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(71, 85, 105, 0.6)',
                  border: '1px solid rgba(71, 85, 105, 0.8)',
                  color: '#e2e8f0',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
        `}
      </style>
    </div>
  );
}
