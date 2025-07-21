import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polygon, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Layers, MapPin, Droplets, AlertTriangle, Clock, TrendingUp, Navigation, Zap, Shield } from "lucide-react";
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

// Custom icons for different risk levels
const createCustomIcon = (riskLevel: string) => {
  const color = riskLevel === 'danger' ? '#ef4444' : 
               riskLevel === 'moderate' ? '#f59e0b' : '#10b981';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5S25 23.4 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="7"/>
        <text x="12.5" y="17" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">
          ${riskLevel === 'danger' ? '!' : riskLevel === 'moderate' ? '!' : 'OK'}
        </text>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface LayerState {
  dangerZones: boolean;
  affectedAreas: boolean;
  historicalData: boolean;
  predictionZones: boolean;
  evacuationRoutes: boolean;
  floodDepth: boolean;
}

// Flood-affected regions data
const floodAffectedRegions = [
  {
    id: 'mumbai-central',
    name: 'Mumbai Central District',
    coordinates: [
      [19.0330, 72.8258] as LatLngExpression,
      [19.0450, 72.8258] as LatLngExpression,
      [19.0450, 72.8400] as LatLngExpression,
      [19.0330, 72.8400] as LatLngExpression,
    ],
    severity: 'high',
    depth: '2.5m',
    affectedPopulation: '150,000'
  },
  {
    id: 'dharavi',
    name: 'Dharavi Slums',
    coordinates: [
      [19.0400, 72.8500] as LatLngExpression,
      [19.0500, 72.8500] as LatLngExpression,
      [19.0500, 72.8600] as LatLngExpression,
      [19.0400, 72.8600] as LatLngExpression,
    ],
    severity: 'critical',
    depth: '3.8m',
    affectedPopulation: '85,000'
  },
  {
    id: 'bandra-east',
    name: 'Bandra East',
    coordinates: [
      [19.0550, 72.8300] as LatLngExpression,
      [19.0650, 72.8300] as LatLngExpression,
      [19.0650, 72.8450] as LatLngExpression,
      [19.0550, 72.8450] as LatLngExpression,
    ],
    severity: 'moderate',
    depth: '1.2m',
    affectedPopulation: '75,000'
  }
];

// Evacuation routes
const evacuationRoutes = [
  {
    id: 'route-1',
    name: 'Emergency Route 1 - Dharavi to Higher Ground',
    coordinates: [
      [19.0423, 72.8449] as LatLngExpression,
      [19.0500, 72.8500] as LatLngExpression,
      [19.0600, 72.8600] as LatLngExpression,
      [19.0700, 72.8700] as LatLngExpression,
    ],
    status: 'active'
  },
  {
    id: 'route-2', 
    name: 'Emergency Route 2 - Central Mumbai Bypass',
    coordinates: [
      [19.0330, 72.8258] as LatLngExpression,
      [19.0400, 72.8200] as LatLngExpression,
      [19.0500, 72.8150] as LatLngExpression,
      [19.0600, 72.8100] as LatLngExpression,
    ],
    status: 'congested'
  }
];

export function FloodMapView() {
  const [selectedSensor, setSelectedSensor] = useState<FloodSensor | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [layers, setLayers] = useState<LayerState>({
    dangerZones: true,
    affectedAreas: true,
    historicalData: false,
    predictionZones: true,
    evacuationRoutes: false,
    floodDepth: true
  });

  // Enhanced flood sensor data with real coordinates
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
    },
    {
      id: '4',
      name: 'Mahim Creek',
      latitude: 19.0470,
      longitude: 72.8420,
      waterLevel: 2.7,
      batteryLevel: 67,
      status: 'active',
      riskLevel: 'danger',
      lastUpdated: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      district: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: '5',
      name: 'Versova Creek',
      latitude: 19.1350,
      longitude: 72.8100,
      waterLevel: 1.5,
      batteryLevel: 89,
      status: 'active',
      riskLevel: 'moderate',
      lastUpdated: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
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

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getRegionColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // Red
      case 'high': return '#ea580c';     // Orange-red
      case 'moderate': return '#d97706'; // Orange
      case 'low': return '#059669';      // Green
      default: return '#6b7280';         // Gray
    }
  };

  const getRegionOpacity = (severity: string) => {
    switch (severity) {
      case 'critical': return 0.7;
      case 'high': return 0.5;
      case 'moderate': return 0.4;
      case 'low': return 0.3;
      default: return 0.2;
    }
  };

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading flood map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Layer Control Panel */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="shadow-lg">
              <Layers className="h-4 w-4 mr-2" />
              Map Layers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Flood Information Layers</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="affected-areas" 
                    checked={layers.affectedAreas}
                    onCheckedChange={() => toggleLayer('affectedAreas')}
                  />
                  <label htmlFor="affected-areas" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded opacity-50"></div>
                    Flood-Affected Areas
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flood-depth" 
                    checked={layers.floodDepth}
                    onCheckedChange={() => toggleLayer('floodDepth')}
                  />
                  <label htmlFor="flood-depth" className="text-sm flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    Water Depth Indicators
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="evacuation-routes" 
                    checked={layers.evacuationRoutes}
                    onCheckedChange={() => toggleLayer('evacuationRoutes')}
                  />
                  <label htmlFor="evacuation-routes" className="text-sm flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-green-500" />
                    Evacuation Routes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="danger-zones" 
                    checked={layers.dangerZones}
                    onCheckedChange={() => toggleLayer('dangerZones')}
                  />
                  <label htmlFor="danger-zones" className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    High-Risk Zones
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="prediction-zones" 
                    checked={layers.predictionZones}
                    onCheckedChange={() => toggleLayer('predictionZones')}
                  />
                  <label htmlFor="prediction-zones" className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-yellow-500" />
                    Flood Predictions
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg">
          <Shield className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <MapContainer
        center={userLocation}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Base Map Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Flood-affected regions */}
        {layers.affectedAreas && floodAffectedRegions.map((region) => (
          <Polygon
            key={region.id}
            positions={region.coordinates}
            pathOptions={{
              color: getRegionColor(region.severity),
              fillColor: getRegionColor(region.severity),
              fillOpacity: getRegionOpacity(region.severity),
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-2">{region.name}</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Severity:</span>
                    <Badge variant={
                      region.severity === 'critical' ? 'destructive' :
                      region.severity === 'high' ? 'destructive' :
                      region.severity === 'moderate' ? 'default' : 'secondary'
                    }>
                      {region.severity}
                    </Badge>
                  </div>
                  {layers.floodDepth && (
                    <div className="flex justify-between">
                      <span>Water Depth:</span>
                      <span className="font-medium text-blue-600">{region.depth}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Affected Population:</span>
                    <span className="font-medium">{region.affectedPopulation}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Evacuation routes */}
        {layers.evacuationRoutes && evacuationRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            pathOptions={{
              color: route.status === 'active' ? '#10b981' : '#f59e0b',
              weight: 4,
              opacity: 0.8,
              dashArray: route.status === 'congested' ? '10, 5' : undefined,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-2">{route.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Status:</span>
                  <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                    {route.status}
                  </Badge>
                </div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Flood sensors */}
        {floodSensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={[sensor.latitude, sensor.longitude]}
            icon={createCustomIcon(sensor.riskLevel)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{sensor.name}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Risk Level:</span>
                    <Badge variant={
                      sensor.riskLevel === 'danger' ? 'destructive' :
                      sensor.riskLevel === 'moderate' ? 'default' : 'secondary'
                    }>
                      {sensor.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Level:</span>
                    <span className="font-medium text-blue-600">{sensor.waterLevel}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {sensor.batteryLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{sensor.district}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground border-t pt-2 mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Updated {new Date(sensor.lastUpdated).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.8,
              weight: 3,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">Your Location</h3>
                <p className="text-xs text-muted-foreground">Current position</p>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-medium text-sm mb-2">Flood Severity Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded opacity-70"></div>
            <span>Critical (&gt;3m depth)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded opacity-50"></div>
            <span>High (2-3m depth)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded opacity-40"></div>
            <span>Moderate (1-2m depth)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded opacity-30"></div>
            <span>Low (&lt;1m depth)</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 z-[1000] text-xs text-muted-foreground bg-background/80 rounded px-2 py-1">
        FloodWatch India © 2024 | OpenStreetMap
      </div>
    </div>
  );
}
