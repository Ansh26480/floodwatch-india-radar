import { useState } from "react";
import { Layers, MapPin, Droplets, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  waterLevel: number;
  status: 'safe' | 'moderate' | 'danger';
  riskScore: number;
  lastUpdated: string;
  type: 'sensor' | 'zone' | 'historical';
}

interface LayerState {
  dangerZones: boolean;
  affectedAreas: boolean;
  historicalData: boolean;
  predictionZones: boolean;
}

export function MapView() {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [layers, setLayers] = useState<LayerState>({
    dangerZones: true,
    affectedAreas: true,
    historicalData: false,
    predictionZones: true
  });

  const markers: MarkerData[] = [
    {
      id: '1',
      name: 'Mithi River - Dharavi',
      lat: 19.0423,
      lng: 72.8449,
      waterLevel: 3.2,
      status: 'danger',
      riskScore: 4,
      lastUpdated: '2 min ago',
      type: 'sensor'
    },
    {
      id: '2',
      name: 'Bandra Creek',
      lat: 19.0596,
      lng: 72.8295,
      waterLevel: 1.8,
      status: 'moderate',
      riskScore: 3,
      lastUpdated: '5 min ago',
      type: 'sensor'
    },
    {
      id: '3',
      name: 'Powai Lake',
      lat: 19.1197,
      lng: 72.9073,
      waterLevel: 0.9,
      status: 'safe',
      riskScore: 1,
      lastUpdated: '1 min ago',
      type: 'sensor'
    },
    {
      id: '4',
      name: 'Kurla - Historical Zone',
      lat: 19.0728,
      lng: 72.8826,
      waterLevel: 2.1,
      status: 'moderate',
      riskScore: 2,
      lastUpdated: '10 min ago',
      type: 'historical'
    }
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-safe border-safe';
      case 'moderate': return 'bg-warning border-warning';
      case 'danger': return 'bg-danger border-danger';
      default: return 'bg-muted border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <AlertTriangle className="h-3 w-3" />;
      case 'moderate': return <Droplets className="h-3 w-3" />;
      case 'safe': return <MapPin className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xs ${
          i < count ? 'text-warning' : 'text-muted-foreground'
        }`}
      >
        *
      </span>
    ));
  };

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-water-light/20 to-primary/10 rounded-lg overflow-hidden">
      {/* Map Background - Simulated India Map */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/30">
        <div className="absolute inset-0 opacity-30">
          {/* Simulated coastlines and rivers */}
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Mumbai coastline simulation */}
            <path 
              d="M 100 200 Q 150 180 200 220 T 300 240 T 400 260 L 420 280 Q 380 300 350 320 T 280 340 T 200 360 L 180 380 Q 120 360 100 320 Z" 
              fill="hsl(var(--water-light))" 
              opacity="0.6"
            />
            {/* Rivers */}
            <path 
              d="M 150 100 Q 200 150 250 200 T 350 280 T 400 350" 
              stroke="hsl(var(--water))" 
              strokeWidth="3" 
              fill="none"
            />
            <path 
              d="M 300 80 Q 350 120 400 180 T 500 250" 
              stroke="hsl(var(--water))" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Layer Control Panel */}
      <div className="absolute top-4 left-4 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="shadow-md">
              <Layers className="h-4 w-4" />
              Layers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Map Layers</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="danger-zones" 
                    checked={layers.dangerZones}
                    onCheckedChange={() => toggleLayer('dangerZones')}
                  />
                  <label htmlFor="danger-zones" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-danger rounded-full"></div>
                    Danger Zones
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="affected-areas" 
                    checked={layers.affectedAreas}
                    onCheckedChange={() => toggleLayer('affectedAreas')}
                  />
                  <label htmlFor="affected-areas" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-affected-area rounded-full"></div>
                    Affected Areas
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="historical-data" 
                    checked={layers.historicalData}
                    onCheckedChange={() => toggleLayer('historicalData')}
                  />
                  <label htmlFor="historical-data" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-historical rounded-full"></div>
                    Historical Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="prediction-zones" 
                    checked={layers.predictionZones}
                    onCheckedChange={() => toggleLayer('predictionZones')}
                  />
                  <label htmlFor="prediction-zones" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-prediction rounded-full"></div>
                    Prediction Zones
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-md">
          <TrendingUp className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-md">
          <span className="text-lg font-bold">+</span>
        </Button>
        <Button variant="secondary" size="icon" className="h-9 w-9 shadow-md">
          <span className="text-lg font-bold">−</span>
        </Button>
      </div>

      {/* Map Markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${20 + (marker.id === '1' ? 0 : marker.id === '2' ? 15 : marker.id === '3' ? 45 : 25)}%`,
            top: `${30 + (marker.id === '1' ? 20 : marker.id === '2' ? 10 : marker.id === '3' ? -5 : 25)}%`,
          }}
          onClick={() => setSelectedMarker(marker)}
        >
          <div className={`w-6 h-6 rounded-full border-2 ${getMarkerColor(marker.status)} shadow-lg flex items-center justify-center text-white`}>
            {getStatusIcon(marker.status)}
          </div>
          {marker.status === 'danger' && (
            <div className="absolute inset-0 w-6 h-6 rounded-full bg-danger animate-ping opacity-50"></div>
          )}
        </div>
      ))}

      {/* Overlay zones based on layer settings */}
      {layers.dangerZones && (
        <div className="absolute top-[35%] left-[15%] w-24 h-16 bg-danger/20 border-2 border-danger/40 rounded-lg z-10"></div>
      )}
      {layers.affectedAreas && (
        <div className="absolute top-[45%] left-[25%] w-32 h-20 bg-affected-area/20 border border-affected-area/40 rounded-lg z-10"></div>
      )}
      {layers.historicalData && (
        <div className="absolute top-[25%] left-[35%] w-20 h-24 bg-historical/20 border border-historical/40 rounded-lg z-10"></div>
      )}

      {/* Marker Info Popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sm">{selectedMarker.name}</h3>
                    <Badge 
                      variant={
                        selectedMarker.status === 'safe' ? 'safe' :
                        selectedMarker.status === 'moderate' ? 'warning' :
                        'danger'
                      } 
                      className="text-xs"
                    >
                      {selectedMarker.status === 'safe' && 'Safe'}
                      {selectedMarker.status === 'moderate' && 'Caution'}
                      {selectedMarker.status === 'danger' && 'Danger'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Water Level</p>
                      <p className="font-medium">{selectedMarker.waterLevel}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Score</p>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedMarker.riskScore)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated {selectedMarker.lastUpdated}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedMarker(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 rounded px-2 py-1">
        FloodWatch India © 2024
      </div>
    </div>
  );
}