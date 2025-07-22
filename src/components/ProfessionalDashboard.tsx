import { useState, useEffect } from "react";

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [floodRisk, setFloodRisk] = useState('Moderate');
  const [waterLevel, setWaterLevel] = useState(2.8);
  const [selectedDistrict, setSelectedDistrict] = useState('Ludhiana');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Rising water levels detected in Sutlej River', time: '2 hours ago', location: 'Ludhiana' },
    { id: 2, type: 'info', message: 'Weather forecast: Heavy rainfall expected', time: '4 hours ago', location: 'Amritsar' }
  ]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 72,
    rainfall: 15.5,
    windSpeed: 12
  });

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time water level changes
      setWaterLevel(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(1.0, Math.min(5.0, prev + change));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Update flood risk based on water level
  useEffect(() => {
    if (waterLevel < 2.0) setFloodRisk('Low');
    else if (waterLevel < 3.5) setFloodRisk('Moderate');
    else setFloodRisk('High');
  }, [waterLevel]);

  const handleEmergencyCall = (number: string) => {
    if (confirm(`Call ${number} for emergency assistance?`)) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      alert('Flood monitoring system activated');
    } else {
      alert('Flood monitoring system paused');
    }
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      location: `${selectedDistrict}, Punjab, India`,
      waterLevel: waterLevel.toFixed(2),
      floodRisk,
      weather: weatherData,
      alerts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const punjabDistricts = [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 
    'Mohali', 'Ferozepur', 'Hoshiarpur', 'Gurdaspur', 'Kapurthala'
  ];

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
            
            <button
              onClick={toggleMonitoring}
              style={{
                background: isMonitoring ? '#10b981' : '#6b7280',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isMonitoring ? '● MONITORING' : '○ PAUSED'}
            </button>
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
        minHeight: 'calc(100vh - 100px)'
      }}>
        {/* Main Map and Data Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interactive Map */}
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
                Punjab Flood Risk Map
              </h2>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                style={{
                  background: 'rgba(51, 65, 85, 0.8)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                {punjabDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            {/* Map Visualization */}
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
                backgroundSize: '40px 40px'
              }}></div>

              {/* Punjab State Outline (Simplified) */}
              <svg width="300" height="200" style={{ position: 'absolute' }}>
                <path
                  d="M50,80 L80,60 L120,70 L160,50 L200,65 L230,80 L250,100 L240,130 L200,150 L160,140 L120,135 L80,120 Z"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
                <text x="150" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">
                  PUNJAB
                </text>
              </svg>

              {/* District Markers */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                background: getRiskColor(floodRisk),
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}>
                📍 {selectedDistrict}
              </div>

              {/* Water Level Indicator */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(15, 23, 42, 0.9)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.3)',
                minWidth: '180px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  WATER LEVEL
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e2e8f0' }}>
                  {waterLevel.toFixed(1)}m
                </div>
                <div style={{ 
                  background: 'rgba(71, 85, 105, 0.5)', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    background: getRiskColor(floodRisk),
                    height: '100%',
                    width: `${Math.min(100, (waterLevel / 5) * 100)}%`,
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
                  🟢 Safe
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  color: '#f59e0b'
                }}>
                  🟡 Monitor
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#ef4444'
                }}>
                  🔴 Alert
                </div>
              </div>
            </div>
          </div>

          {/* Weather Data */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>
              Weather Conditions - {selectedDistrict}
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1rem' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Temperature</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData.temperature}°C
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Humidity</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData.humidity}%
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rainfall</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData.rainfall}mm
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Wind Speed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4' }}>
                  {weatherData.windSpeed} km/h
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
                fontSize: '1.3rem', 
                fontWeight: '700',
                color: getRiskColor(floodRisk)
              }}>
                {floodRisk.toUpperCase()}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                LOCATION
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0' }}>
                {selectedDistrict}, Punjab
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                30.7333° N, 76.7794° E
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
              {alerts.map(alert => (
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
              ))}
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
              Emergency Contacts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Emergency Services', number: '112' },
                { name: 'Flood Control Room', number: '1078' },
                { name: 'Police Control', number: '100' },
                { name: 'Fire Department', number: '101' }
              ].map(contact => (
                <button
                  key={contact.number}
                  onClick={() => handleEmergencyCall(contact.number)}
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
                  <span>{contact.name}</span>
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
                onClick={exportData}
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
                📊 Export Report
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
    </div>
  );
}
