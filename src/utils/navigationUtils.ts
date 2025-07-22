// Navigation utilities for emergency evacuation routes

export interface EvacuationCenter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  facilities: string[];
  contactNumber: string;
  district: string;
  state: string;
}

export interface SafetyRoute {
  destination: EvacuationCenter;
  distance: number;
  estimatedTime: string;
  routeType: 'fastest' | 'safest' | 'alternate';
  warnings: string[];
}

// Mock evacuation centers data for Mumbai and surrounding areas
export const evacuationCenters: EvacuationCenter[] = [
  {
    id: '1',
    name: 'Shivaji Park Ground',
    latitude: 19.0282,
    longitude: 72.8422,
    capacity: 5000,
    facilities: ['Medical Aid', 'Food Distribution', 'Shelter', 'Communication'],
    contactNumber: '+91-22-24467890',
    district: 'Mumbai',
    state: 'Maharashtra'
  },
  {
    id: '2',
    name: 'NSCI Stadium',
    latitude: 19.0330,
    longitude: 72.8397,
    capacity: 8000,
    facilities: ['Large Shelter', 'Medical Centre', 'Food Services', 'Transport Hub'],
    contactNumber: '+91-22-24301011',
    district: 'Mumbai',
    state: 'Maharashtra'
  },
  {
    id: '3',
    name: 'Oval Maidan',
    latitude: 18.9220,
    longitude: 72.8332,
    capacity: 3000,
    facilities: ['Temporary Shelter', 'First Aid', 'Water Supply'],
    contactNumber: '+91-22-22074321',
    district: 'Mumbai',
    state: 'Maharashtra'
  },
  {
    id: '4',
    name: 'Cross Maidan',
    latitude: 18.9396,
    longitude: 72.8214,
    capacity: 2500,
    facilities: ['Emergency Shelter', 'Medical Support', 'Food Distribution'],
    contactNumber: '+91-22-22651234',
    district: 'Mumbai',
    state: 'Maharashtra'
  },
  {
    id: '5',
    name: 'Kamala Mills Compound Emergency Centre',
    latitude: 19.0138,
    longitude: 72.8244,
    capacity: 1500,
    facilities: ['Shelter', 'Communication Centre', 'Medical Aid'],
    contactNumber: '+91-22-24947890',
    district: 'Mumbai',
    state: 'Maharashtra'
  }
];

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const findNearestEvacuationCenters = (
  userLat: number,
  userLon: number,
  maxResults: number = 3
): SafetyRoute[] => {
  const routes = evacuationCenters
    .map(center => {
      const distance = calculateDistance(userLat, userLon, center.latitude, center.longitude);
      const estimatedTime = Math.ceil(distance * 3); // Rough estimate: 3 minutes per km
      
      return {
        destination: center,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        estimatedTime: `${estimatedTime} mins`,
        routeType: 'fastest' as const,
        warnings: distance > 5 ? ['Long distance evacuation', 'Check route conditions'] : []
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);

  return routes;
};

export const generateEvacuationInstructions = (route: SafetyRoute, userLocation: string): string => {
  return `
EMERGENCY EVACUATION INSTRUCTIONS
=================================

Current Location: ${userLocation}
Evacuation Center: ${route.destination.name}
Distance: ${route.distance} km
Estimated Time: ${route.estimatedTime}

ROUTE DETAILS:
- Head towards ${route.destination.name}
- Contact Number: ${route.destination.contactNumber}
- Capacity: ${route.destination.capacity} people
- Facilities: ${route.destination.facilities.join(', ')}

SAFETY WARNINGS:
${route.warnings.length > 0 ? route.warnings.map(w => `- ${w}`).join('\n') : '- Follow traffic rules and stay alert'}
- Carry identification documents
- Bring essential medicines if possible
- Stay calm and help others if safe to do so

EMERGENCY CONTACTS:
- Emergency Helpline: 112
- Police: 100
- Fire Brigade: 101
- Ambulance: 108

Google Maps Route:
https://maps.google.com/maps/dir/${route.destination.latitude},${route.destination.longitude}

Generated at: ${new Date().toLocaleString()}
`;
};

export const openNavigationApp = (
  userLat: number,
  userLon: number,
  destLat: number,
  destLon: number,
  destinationName: string
) => {
  try {
    // Try to open in Google Maps mobile app first, fallback to web
    const googleMapsUrl = `https://maps.google.com/maps/dir/${userLat},${userLon}/${destLat},${destLon}`;
    const googleMapsAppUrl = `comgooglemaps://?saddr=${userLat},${userLon}&daddr=${destLat},${destLon}&directionsmode=driving`;
    
    // Check if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open in app, fallback to web
      window.open(googleMapsAppUrl);
      setTimeout(() => {
        window.open(googleMapsUrl, '_blank');
      }, 1000);
    } else {
      // Open in web browser
      window.open(googleMapsUrl, '_blank');
    }
    
    return true;
  } catch (error) {
    console.error('Error opening navigation:', error);
    return false;
  }
};

export const getEmergencyRoute = async (
  userLat: number,
  userLon: number,
  currentLocation: string = 'Current Location'
): Promise<{
  nearestCenters: SafetyRoute[];
  instructions: string;
  quickNavigation: () => void;
}> => {
  try {
    const nearestCenters = findNearestEvacuationCenters(userLat, userLon, 3);
    const primaryRoute = nearestCenters[0];
    
    if (!primaryRoute) {
      throw new Error('No evacuation centers found nearby');
    }
    
    const instructions = generateEvacuationInstructions(primaryRoute, currentLocation);
    
    const quickNavigation = () => {
      openNavigationApp(
        userLat,
        userLon,
        primaryRoute.destination.latitude,
        primaryRoute.destination.longitude,
        primaryRoute.destination.name
      );
    };
    
    return {
      nearestCenters,
      instructions,
      quickNavigation
    };
  } catch (error) {
    console.error('Error getting emergency route:', error);
    throw error;
  }
};
