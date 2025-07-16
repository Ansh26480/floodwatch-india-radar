import { useState } from "react";
import { 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Camera, 
  Navigation, 
  Clock,
  Star,
  Users,
  Activity,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
  location?: string;
}

interface RiskPanelProps {
  userRole: 'citizen' | 'responder';
}

export function RiskPanel({ userRole }: RiskPanelProps) {
  const [currentLocation] = useState({
    name: "Mumbai, Maharashtra",
    riskLevel: 3,
    status: 'moderate' as 'safe' | 'moderate' | 'danger'
  });

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'River Level Rising',
      message: 'Mithi River water level increasing. Monitor closely.',
      timestamp: '2 min ago',
      location: 'Mithi River Basin'
    },
    {
      id: '2',
      type: 'danger',
      title: 'Flood Warning Active',
      message: 'Heavy rainfall expected. Evacuation recommended for low-lying areas.',
      timestamp: '15 min ago',
      location: 'Kurla, Dharavi'
    },
    {
      id: '3',
      type: 'info',
      title: 'Evacuation Complete',
      message: 'Safe evacuation of 150 families completed successfully.',
      timestamp: '1 hour ago',
      location: 'Bandra East'
    }
  ]);

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case 'safe': return 'safe';
      case 'moderate': return 'warning';
      case 'danger': return 'danger';
      default: return 'secondary';
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'default';
      default: return 'secondary';
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < count ? 'fill-warning text-warning' : 'text-muted'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Current Location Risk */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Current Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-sm">{currentLocation.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(currentLocation.riskLevel)}
              </div>
              <Badge variant={getRiskBadgeColor(currentLocation.status)} className="text-xs">
                {currentLocation.status === 'safe' && 'Safe Zone'}
                {currentLocation.status === 'moderate' && 'Moderate Risk'}
                {currentLocation.status === 'danger' && 'Critical Risk'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4" />
            Live Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={alert.id}>
              <div className="flex items-start gap-2">
                <Badge 
                  variant={getAlertVariant(alert.type)} 
                  className="text-xs mt-0.5 shrink-0"
                >
                  {alert.type.toUpperCase()}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{alert.timestamp}</span>
                    {alert.location && (
                      <>
                        <span>•</span>
                        <span>{alert.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {index < alerts.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="danger" className="w-full justify-start" size="sm">
            <Navigation className="h-4 w-4" />
            Find Evacuation Routes
          </Button>
          <Button variant="warning" className="w-full justify-start" size="sm">
            <Camera className="h-4 w-4" />
            Report Flood Incident
          </Button>
          <Button variant="default" className="w-full justify-start" size="sm">
            <Phone className="h-4 w-4" />
            Emergency Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Responder-only Analytics */}
      {userRole === 'responder' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Response Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="h-4 w-4 text-safe" />
                  <span className="text-lg font-bold text-safe">24</span>
                </div>
                <p className="text-xs text-muted-foreground">Devices Online</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold">1,247</span>
                </div>
                <p className="text-xs text-muted-foreground">People Safe</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Critical Zones</span>
                <span className="font-medium text-danger">3 Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Evacuation Status</span>
                <span className="font-medium text-safe">85% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}