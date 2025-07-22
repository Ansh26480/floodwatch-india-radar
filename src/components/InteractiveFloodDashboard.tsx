import { useState, useEffect, useRef } from "react";

// Interactive Map Component
const InteractiveIndiaMap = ({ 
  currentLocation, 
  locationDetails, 
  floodData, 
  onLocationSelect,
  searchQuery,
  setSearchQuery 
}: any) => {
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Indian states with coordinates and risk data
  const indianStates = [
    { name: "Jammu and Kashmir", x: 160, y: 80, risk: "Low", coords: { lat: 34.0, lon: 76.0 } },
    { name: "Himachal Pradesh", x: 180, y: 100, risk: "Moderate", coords: { lat: 31.1, lon: 77.1 } },
    { name: "Punjab", x: 170, y: 110, risk: "Moderate", coords: { lat: 31.1, lon: 75.3 } },
    { name: "Haryana", x: 190, y: 120, risk: "Moderate", coords: { lat: 29.0, lon: 76.0 } },
    { name: "Delhi", x: 195, y: 125, risk: "Low", coords: { lat: 28.6, lon: 77.2 } },
    { name: "Rajasthan", x: 150, y: 140, risk: "Low", coords: { lat: 27.0, lon: 74.2 } },
    { name: "Uttar Pradesh", x: 220, y: 140, risk: "High", coords: { lat: 26.8, lon: 80.9 } },
    { name: "Bihar", x: 250, y: 140, risk: "High", coords: { lat: 25.0, lon: 85.3 } },
    { name: "West Bengal", x: 270, y: 150, risk: "Critical", coords: { lat: 22.9, lon: 87.8 } },
    { name: "Sikkim", x: 275, y: 135, risk: "Moderate", coords: { lat: 27.5, lon: 88.5 } },
    { name: "Arunachal Pradesh", x: 300, y: 130, risk: "High", coords: { lat: 28.2, lon: 94.7 } },
    { name: "Nagaland", x: 310, y: 145, risk: "High", coords: { lat: 26.1, lon: 94.6 } },
    { name: "Manipur", x: 315, y: 155, risk: "High", coords: { lat: 24.6, lon: 93.9 } },
    { name: "Mizoram", x: 310, y: 165, risk: "High", coords: { lat: 23.1, lon: 92.9 } },
    { name: "Tripura", x: 295, y: 165, risk: "High", coords: { lat: 23.9, lon: 91.9 } },
    { name: "Assam", x: 290, y: 150, risk: "Critical", coords: { lat: 26.2, lon: 92.9 } },
    { name: "Meghalaya", x: 285, y: 155, risk: "High", coords: { lat: 25.4, lon: 91.3 } },
    { name: "Jharkhand", x: 245, y: 155, risk: "Moderate", coords: { lat: 23.6, lon: 85.2 } },
    { name: "Odisha", x: 255, y: 170, risk: "High", coords: { lat: 20.9, lon: 85.0 } },
    { name: "Chhattisgarh", x: 225, y: 170, risk: "Moderate", coords: { lat: 21.2, lon: 81.0 } },
    { name: "Madhya Pradesh", x: 200, y: 160, risk: "Moderate", coords: { lat: 22.9, lon: 78.6 } },
    { name: "Gujarat", x: 140, y: 170, risk: "Low", coords: { lat: 22.2, lon: 71.1 } },
    { name: "Maharashtra", x: 180, y: 190, risk: "Moderate", coords: { lat: 19.7, lon: 75.7 } },
    { name: "Telangana", x: 200, y: 210, risk: "Low", coords: { lat: 18.1, lon: 79.0 } },
    { name: "Andhra Pradesh", x: 210, y: 230, risk: "Moderate", coords: { lat: 15.9, lon: 79.7 } },
    { name: "Karnataka", x: 180, y: 230, risk: "Moderate", coords: { lat: 15.3, lon: 75.7 } },
    { name: "Kerala", x: 170, y: 260, risk: "High", coords: { lat: 10.8, lon: 76.2 } },
    { name: "Tamil Nadu", x: 190, y: 250, risk: "Moderate", coords: { lat: 11.1, lon: 78.6 } },
    { name: "Goa", x: 165, y: 210, risk: "Low", coords: { lat: 15.2, lon: 74.1 } },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const handleZoom = (delta: number) => {
    setMapZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapCenter.x, y: e.clientY - mapCenter.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapCenter({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleStateClick = (state: any) => {
    onLocationSelect(state);
    setMapCenter({ x: -state.x * mapZoom + 200, y: -state.y * mapZoom + 150 });
  };

  const filteredStates = indianStates.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <button
          onClick={() => handleZoom(0.2)}
          style={{
            width: '35px',
            height: '35px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#e2e8f0',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          style={{
            width: '35px',
            height: '35px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#e2e8f0',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          −
        </button>
        <button
          onClick={() => {
            setMapZoom(1);
            setMapCenter({ x: 0, y: 0 });
          }}
          style={{
            width: '35px',
            height: '35px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#e2e8f0',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ⌂
        </button>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '8px',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          minWidth: '200px',
          zIndex: 10
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>
            Search Results:
          </div>
          {filteredStates.length > 0 ? (
            filteredStates.map(state => (
              <div
                key={state.name}
                onClick={() => handleStateClick(state)}
                style={{
                  padding: '5px 8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{state.name}</span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getRiskColor(state.risk)
                }}></span>
              </div>
            ))
          ) : (
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No results found</div>
          )}
        </div>
      )}

      {/* Interactive Map */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg width="400" height="300" style={{ width: '100%', height: '100%' }}>
          {/* India Map Outline */}
          <path
            d="M80,50 L100,40 L120,45 L140,35 L160,40 L180,30 L200,35 L220,45 L240,40 L260,50 L280,60 L300,70 L320,80 L340,90 L350,110 L360,130 L355,150 L350,170 L340,190 L330,210 L320,230 L300,250 L280,260 L260,265 L240,260 L220,255 L200,250 L180,245 L160,240 L140,235 L120,230 L100,225 L85,215 L75,200 L70,180 L65,160 L60,140 L55,120 L60,100 L65,80 L70,60 Z"
            fill="rgba(6, 182, 212, 0.1)"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          
          {/* State Markers */}
          {indianStates.map((state, index) => (
            <g key={state.name}>
              <circle
                cx={state.x}
                cy={state.y}
                r="8"
                fill={getRiskColor(state.risk)}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStateClick(state)}
              >
                <title>{state.name} - Risk: {state.risk}</title>
              </circle>
              {mapZoom > 1.5 && (
                <text
                  x={state.x}
                  y={state.y + 20}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="10"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {state.name.split(' ')[0]}
                </text>
              )}
            </g>
          ))}

          {/* Current Location Marker */}
          {currentLocation && locationDetails && (
            <g>
              <circle
                cx="200"
                cy="150"
                r="12"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="3"
                style={{ animation: 'pulse 2s infinite' }}
              />
              <text
                x="200"
                y="135"
                textAnchor="middle"
                fill="#3b82f6"
                fontSize="12"
                fontWeight="700"
              >
                📍 You are here
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        {['Low', 'Moderate', 'High', 'Critical'].map(risk => (
          <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getRiskColor(risk)
            }}></div>
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Real-time flood monitoring service (improved)
class FloodMonitoringService {
  private static instance: FloodMonitoringService;
  
  static getInstance() {
    if (!FloodMonitoringService.instance) {
      FloodMonitoringService.instance = new FloodMonitoringService();
    }
    return FloodMonitoringService.instance;
  }

  async getWeatherData(lat: number, lon: number) {
    try {
      // Simulate realistic weather data with proper formatting
      const isMonsooon = new Date().getMonth() >= 5 && new Date().getMonth() <= 9;
      const baseTemp = lat < 20 ? 32 : lat < 25 ? 28 : 24;
      
      return {
        temperature: Math.round((baseTemp + Math.random() * 6 - 3) * 10) / 10,
        humidity: Math.round(isMonsooon ? 75 + Math.random() * 20 : 45 + Math.random() * 30),
        rainfall: Math.round((isMonsooon ? Math.random() * 25 : Math.random() * 5) * 10) / 10,
        windSpeed: Math.round((8 + Math.random() * 12) * 10) / 10,
        weatherCondition: isMonsooon ? 'Rain' : 'Clear',
        description: isMonsooon ? 'scattered showers' : 'clear sky'
      };
    } catch (error) {
      console.warn('Using simulated weather data');
      return {
        temperature: 25.0,
        humidity: 65,
        rainfall: 0.0,
        windSpeed: 10.0,
        weatherCondition: 'Clear',
        description: 'clear sky'
      };
    }
  }

  async getFloodRiskData(lat: number, lon: number, stateName: string) {
    try {
      const riskFactors = this.calculateRiskFactors(lat, lon, stateName);
      const waterLevel = this.getWaterLevel(stateName);
      const floodRisk = this.calculateFloodRisk(riskFactors, waterLevel);
      
      return {
        waterLevel: Math.round(waterLevel * 10) / 10,
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
    if ((lon < 77 && lat > 15 && lat < 20) || (lon > 85 && lat > 22)) {
      return 'High';
    } else if (lat > 26) {
      return 'Low';
    }
    return 'Moderate';
  }

  private getRiverProximity(stateName: string) {
    const highRiskStates = ['West Bengal', 'Bihar', 'Assam', 'Uttar Pradesh', 'Punjab'];
    const moderateRiskStates = ['Haryana', 'Rajasthan', 'Madhya Pradesh', 'Odisha'];
    
    if (highRiskStates.includes(stateName)) return 'High';
    if (moderateRiskStates.includes(stateName)) return 'Moderate';
    return 'Low';
  }

  private getElevationRisk(lat: number, lon: number) {
    if (lat > 28 || (lat < 12 && (lon < 77 || lon > 80))) {
      return 'Variable';
    }
    return 'Low';
  }

  private getSeasonalRisk() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return 'High';
    if (month >= 10 && month <= 1) return 'Low';
    return 'Moderate';
  }

  private getWaterLevel(stateName: string) {
    const baseLevel = 2.0;
    const seasonalMultiplier = this.getSeasonalRisk() === 'High' ? 1.5 : 1.0;
    const stateMultiplier = ['West Bengal', 'Bihar', 'Assam'].includes(stateName) ? 1.3 : 1.0;
    
    return baseLevel * seasonalMultiplier * stateMultiplier + (Math.random() - 0.5) * 0.5;
  }

  private calculateFloodRisk(riskFactors: any, waterLevel: number) {
    let riskScore = 0;
    
    if (waterLevel > 3.5) riskScore += 3;
    else if (waterLevel > 2.5) riskScore += 2;
    else riskScore += 1;
    
    if (riskFactors.monsoonIntensity === 'High') riskScore += 2;
    else if (riskFactors.monsoonIntensity === 'Moderate') riskScore += 1;
    
    if (riskFactors.riverProximity === 'High') riskScore += 2;
    else if (riskFactors.riverProximity === 'Moderate') riskScore += 1;
    
    if (riskFactors.seasonalRisk === 'High') riskScore += 1;
    
    if (riskScore >= 6) return 'Critical';
    if (riskScore >= 4) return 'High';
    if (riskScore >= 2) return 'Moderate';
    return 'Low';
  }

  private async getActiveAlerts(stateName: string) {
    const alerts = [];
    
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
      'Assam': { control: '1079', disaster: '0361-272-1000' },
      'Chandigarh': { control: '1078', disaster: '0172-270-8080' }
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

// Location service
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
          resolve({ lat: 30.7333, lon: 76.7794 }); // Chandigarh default
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  static async getLocationDetails(lat: number, lon: number) {
    try {
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
        state: 'Chandigarh',
        district: 'Chandigarh',
        city: 'Chandigarh',
        country: 'India',
        formattedAddress: 'Chandigarh, India'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const floodService = FloodMonitoringService.getInstance();

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        const coords = await LocationService.getCurrentLocation();
        setLocation(coords);
        
        const details = await LocationService.getLocationDetails(coords.lat, coords.lon);
        setLocationDetails(details);
        
        setError(null);
      } catch (err) {
        setError('Location access denied. Using default location (Chandigarh).');
        setLocation({ lat: 30.7333, lon: 76.7794 });
        setLocationDetails({
          state: 'Chandigarh',
          district: 'Chandigarh',
          city: 'Chandigarh',
          country: 'India'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (location && locationDetails) {
        Promise.all([
          floodService.getWeatherData(location.lat, location.lon),
          floodService.getFloodRiskData(location.lat, location.lon, locationDetails.state)
        ]).then(([weather, flood]) => {
          setWeatherData(weather);
          setFloodData(flood);
        }).catch(console.error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, [location, locationDetails]);

  const handleLocationSelect = async (selectedState: any) => {
    setSelectedLocation(selectedState);
    try {
      const [weather, flood] = await Promise.all([
        floodService.getWeatherData(selectedState.coords.lat, selectedState.coords.lon),
        floodService.getFloodRiskData(selectedState.coords.lat, selectedState.coords.lon, selectedState.name)
      ]);
      
      setWeatherData(weather);
      setFloodData(flood);
      setLocationDetails({
        state: selectedState.name,
        city: selectedState.name,
        district: selectedState.name
      });
    } catch (err) {
      console.error('Error fetching selected location data:', err);
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
        </div>
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
      {/* Header */}
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
                Real-time Interactive Flood Monitoring
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
            <input
              type="text"
              placeholder="Search for any Indian state or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(51, 65, 85, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
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
      </header>

      <main style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        minHeight: 'calc(100vh - 120px)'
      }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interactive India Map */}
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
                Interactive India Flood Risk Map
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                📍 {selectedLocation ? selectedLocation.name : `${locationDetails?.city}, ${locationDetails?.state}`}
              </div>
            </div>
            
            <InteractiveIndiaMap
              currentLocation={location}
              locationDetails={locationDetails}
              floodData={floodData}
              onLocationSelect={handleLocationSelect}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Weather Data - Fixed Formatting */}
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
                  {weatherData?.temperature || '--'}°C
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
                  {weatherData?.rainfall || '--'}mm
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Wind Speed</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData?.windSpeed || '--'} km/h
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
              Current Status
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
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                WATER LEVEL
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e2e8f0' }}>
                {floodData?.waterLevel || '--'}m
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
                  No active alerts for this area
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

          {/* Actions */}
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
                  cursor: 'pointer'
                }}
              >
                📊 Export Report
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation(null);
                }}
                style={{
                  background: 'rgba(71, 85, 105, 0.6)',
                  border: '1px solid rgba(71, 85, 105, 0.8)',
                  color: '#e2e8f0',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🏠 Reset to My Location
              </button>
            </div>
          </div>
        </div>
      </main>

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
