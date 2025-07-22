import { useState, useEffect } from "react";
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
  Shield,
  RefreshCw,
  Download,
  Share,
  Bell,
  MessageSquare,
  ExternalLink,
  Home,
  Building,
  Zap,
  Loader2,
  MapIcon,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData, useEmergencyContacts, useUserLocation, useDashboardStats } from "@/hooks/useFloodData";

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
  const { toast } = useToast();
  const { location: userLocation, loading: locationLoading, error: locationError } = useUserLocation();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { contacts: emergencyContacts, loading: contactsLoading } = useEmergencyContacts(
    userLocation?.district,
    userLocation?.state
  );

  // Determine current location info
  const currentLocation = userLocation ? {
    name: `${userLocation.district}, ${userLocation.state}`,
    riskLevel: 3, // This would be calculated based on sensor data
    status: 'moderate' as 'safe' | 'moderate' | 'danger',
    district: userLocation.district,
    state: userLocation.state
  } : {
    name: "Locating...",
    riskLevel: 0,
    status: 'safe' as 'safe' | 'moderate' | 'danger',
    district: "",
    state: ""
  };

  const [mockAlerts] = useState<Alert[]>([
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

  // Button Action Handlers
  const handleEmergencyCall = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
      toast({
        title: "Emergency Call",
        description: `Calling ${phone}...`,
        variant: "default",
      });
    }
  };

  const handleReportIncident = () => {
    toast({
      title: "Report Incident",
      description: "Opening incident reporting form...",
      variant: "default",
    });
    // Here you would open a modal or navigate to incident reporting page
  };

  const handleNavigateToSafety = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/safety+shelter+near+me`;
        window.open(mapsUrl, '_blank');
        toast({
          title: "Navigation Started",
          description: "Opening route to nearest safety shelter...",
          variant: "default",
        });
      });
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation && navigator.share) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await navigator.share({
            title: 'My Location - Emergency',
            text: `I need help! My location: ${latitude}, ${longitude}`,
            url: `https://maps.google.com/?q=${latitude},${longitude}`
          });
          toast({
            title: "Location Shared",
            description: "Your location has been shared successfully.",
            variant: "default",
          });
        } catch (error) {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(`Emergency Location: ${latitude}, ${longitude}`);
          toast({
            title: "Location Copied",
            description: "Location copied to clipboard.",
            variant: "default",
          });
        }
      });
    }
  };

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Updating flood monitoring data...",
      variant: "default",
    });
    // Trigger data refresh
    window.location.reload();
  };

  const handleDownloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      location: currentLocation.name,
      riskLevel: currentLocation.riskLevel,
      sensors: stats.totalSensors,
      alerts: stats.activeAlerts,
      dangerZones: stats.dangerZones
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flood-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Report Downloaded",
      description: "Flood monitoring report saved to your device.",
      variant: "default",
    });
  };

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You'll receive flood alerts on this device.",
            variant: "default",
          });
        }
      });
    }
  };

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
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              Current Location
            </div>
            {locationLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="h-6 w-6 p-0"
              >
                <Target className="h-3 w-3" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {locationLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Getting your location...</span>
              </div>
            </div>
          ) : locationError ? (
            <div className="text-center py-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                {locationError}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="text-xs"
              >
                <Target className="h-3 w-3 mr-1" />
                Retry Location
              </Button>
            </div>
          ) : (
            <div>
              <p className="font-medium text-sm flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-primary" />
                {currentLocation.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {renderStars(currentLocation.riskLevel)}
                </div>
                <Badge 
                  variant={getRiskBadgeColor(currentLocation.status)} 
                  className="text-xs font-medium px-2 py-1"
                >
                  {currentLocation.status === 'safe' && '✓ Safe Zone'}
                  {currentLocation.status === 'moderate' && '⚠ Moderate Risk'}
                  {currentLocation.status === 'danger' && '🚨 Critical Risk'}
                </Badge>
              </div>
              
              {userLocation && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </div>
              )}
            </div>
          )}
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
          <Button 
            variant="destructive" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => handleEmergencyCall('112')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Emergency Call (112)
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={handleNavigateToSafety}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Find Evacuation Routes
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={handleReportIncident}
          >
            <Camera className="h-4 w-4 mr-2" />
            Report Flood Incident
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={handleShareLocation}
          >
            <Share className="h-4 w-4 mr-2" />
            Share Location
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {contactsLoading ? (
            <div className="text-sm text-muted-foreground">Loading contacts...</div>
          ) : emergencyContacts?.length > 0 ? (
            emergencyContacts.slice(0, 6).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.department}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall(contact.phone)}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            // Fallback emergency contacts
            <>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">Emergency Helpline</div>
                  <div className="text-xs text-muted-foreground">National Emergency</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('112')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">Police</div>
                  <div className="text-xs text-muted-foreground">Emergency Services</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('100')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">Fire Brigade</div>
                  <div className="text-xs text-muted-foreground">Fire & Rescue</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('101')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">Ambulance</div>
                  <div className="text-xs text-muted-foreground">Medical Emergency</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('108')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">NDMA</div>
                  <div className="text-xs text-muted-foreground">Disaster Management</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('+91-11-26701700')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <div className="text-sm font-medium">Women Helpline</div>
                  <div className="text-xs text-muted-foreground">Women Safety</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall('1091')}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Responder-only Analytics */}
      {userRole === 'responder' && (
        <>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Shield className="h-4 w-4 text-blue-500" />
                Response Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">{stats?.activeSensors || 24}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Devices Online</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{stats?.peopleAffected || 1247}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">People Safe</p>
                </div>
              </div>
              <Separator className="bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800" />
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-white/40 dark:bg-gray-800/40">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Critical Zones
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">{stats?.dangerZones || 3} Active</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-white/40 dark:bg-gray-800/40">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Evacuation Status
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">85% Complete</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-white/40 dark:bg-gray-800/40">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Response Teams
                  </span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats?.responseTeams || 12} Deployed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                <Users className="h-4 w-4 text-emerald-500" />
                Responder Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://ndma.gov.in', '_blank')}
                className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-blue-200 dark:border-blue-800"
              >
                <Building className="h-3 w-3 mr-2 text-blue-600" />
                NDMA Portal
                <ExternalLink className="h-3 w-3 ml-auto text-blue-500" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://cwc.gov.in', '_blank')}
                className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-green-200 dark:border-green-800"
              >
                <Activity className="h-3 w-3 mr-2 text-green-600" />
                CWC Dashboard
                <ExternalLink className="h-3 w-3 ml-auto text-green-500" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://imd.gov.in', '_blank')}
                className="w-full justify-start hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-yellow-200 dark:border-yellow-800"
              >
                <Zap className="h-3 w-3 mr-2 text-yellow-600" />
                IMD Weather
                <ExternalLink className="h-3 w-3 ml-auto text-yellow-500" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadReport}
                className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-purple-200 dark:border-purple-800"
              >
                <Download className="h-3 w-3 mr-2 text-purple-600" />
                Download Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                className="w-full justify-start hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-cyan-200 dark:border-cyan-800"
              >
                <RefreshCw className="h-3 w-3 mr-2 text-cyan-600" />
                Refresh Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEnableNotifications}
                className="w-full justify-start hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 hover:scale-105 hover:shadow-md border-rose-200 dark:border-rose-800"
              >
                <Bell className="h-3 w-3 mr-2 text-rose-600" />
                Enable Alerts
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}