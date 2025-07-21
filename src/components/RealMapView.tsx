import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Layers, MapPin, Droplets, AlertTriangle, Clock, TrendingUp, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FloodSensor, MapLayer } from "@/types";
import { LocationService, WeatherService } from "@/services/api";
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LayerState {
  dangerZones: boolean;
  affectedAreas: boolean;
  historicalData: boolean;
  predictionZones: boolean;
  evacuationRoutes: boolean;
}

export function RealMapView() {
  const [selectedSensor, setSelectedSensor] = useState<FloodSensor | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [layers, setLayers] = useState<LayerState>({
    dangerZones: true,
    affectedAreas: true,
    historicalData: false,
    predictionZones: true,
    evacuationRoutes: false
  });

  // Sample flood sensor data - Replace with real API data
  const [floodSensors] = useState<FloodSensor[]>([
    {
      id: '1',
      name: 'Mithi River - Dharavi',
      latitude: 19.0423,
      longitude: 72.8449,
      waterLevel: 3.2,
      batteryLevel: 85,
      status: 'active',
      riskLevel: 'danger',
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      district: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: '2',
      name: 'Bandra Creek',
      latitude: 19.0596,
      longitude: 72.8295,
      waterLevel: 1.8,
      batteryLevel: 92,
      status: 'active',
      riskLevel: 'moderate',
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      district: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: '3',
      name: 'Powai Lake',
      latitude: 19.1197,
      longitude: 72.9073,
      waterLevel: 0.9,
      batteryLevel: 78,
      status: 'active',
      riskLevel: 'safe',
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      district: 'Mumbai',
      state: 'Maharashtra'
    }
  ]);

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setUserLocation([location.lat, location.lon]);
      } else {
        // Default to Mumbai if location access denied
        setUserLocation([19.0760, 72.8777]);
      }
    };

    getCurrentLocation();
  }, []);

  const toggleLayer = (layerName: keyof LayerState) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (riskLevel: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${getMarkerColor(riskLevel)}" stroke="white" stroke-width="2"/>
          <path d="M12 8v4l3 3" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    return date.toLocaleTimeString();
  };

  const renderStars = (level: number) => {
    const maxLevel = 5;
    const normalizedLevel = Math.min(Math.max(level, 0), maxLevel);
    
    return Array.from({ length: maxLevel }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < normalizedLevel ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Default center (Mumbai) if user location not available
  const center: [number, number] = userLocation || [19.0760, 72.8777];

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={11}
        className="h-full w-full rounded-lg"
        zoomControl={false}
      >
        {/* Base Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Flood Sensors */}
        {floodSensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={[sensor.latitude, sensor.longitude]}
            icon={createCustomIcon(sensor.riskLevel)}
            eventHandlers={{
              click: () => setSelectedSensor(sensor)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{sensor.name}</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Water Level:</span>
                    <span className="font-medium">{sensor.waterLevel}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className="font-medium">{sensor.batteryLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge 
                      variant={sensor.riskLevel === 'safe' ? 'safe' : 
                              sensor.riskLevel === 'moderate' ? 'warning' : 'danger'}
                      className="text-xs"
                    >
                      {sensor.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatLastUpdated(sensor.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location */}
        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={8}
            fillColor="#3b82f6"
            color="white"
            weight={2}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1" />
                <p className="text-sm font-medium">Your Location</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Danger Zones */}
        {layers.dangerZones && (
          <CircleMarker
            center={[19.0423, 72.8449]}
            radius={100}
            fillColor="#ef4444"
            color="#dc2626"
            weight={2}
            fillOpacity={0.2}
          >
            <Popup>Flood Danger Zone - Mithi River Basin</Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Layer Control Panel */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="shadow-lg bg-white">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Map Layers</h4>
              <div className="space-y-3">
                {Object.entries(layers).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={key}
                      checked={value}
                      onCheckedChange={() => toggleLayer(key as keyof LayerState)}
                    />
                    <label htmlFor={key} className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg bg-white">
          <TrendingUp className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg bg-white">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Sensor Info Panel */}
      {selectedSensor && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <Card className="shadow-lg bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sm">{selectedSensor.name}</h3>
                    <Badge 
                      variant={
                        selectedSensor.riskLevel === 'safe' ? 'safe' :
                        selectedSensor.riskLevel === 'moderate' ? 'warning' :
                        'danger'
                      } 
                      className="text-xs"
                    >
                      {selectedSensor.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Water Level</p>
                      <p className="font-medium">{selectedSensor.waterLevel}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Battery</p>
                      <p className="font-medium">{selectedSensor.batteryLevel}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatLastUpdated(selectedSensor.lastUpdated)}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedSensor(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
