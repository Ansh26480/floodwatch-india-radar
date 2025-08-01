// Utility functions for downloading reports and data

export interface ReportData {
  timestamp: string;
  location: string;
  riskLevel: string;
  sensors: any[];
  alerts: any[];
  emergencyContacts: any[];
  incidentReports: any[];
}

export const downloadFloodReport = (data: ReportData) => {
  try {
    const report = {
      title: "FloodWatch India - Situation Report",
      generatedAt: new Date().toISOString(),
      location: data.location,
      currentRiskLevel: data.riskLevel,
      summary: {
        totalSensors: data.sensors.length,
        activeSensors: data.sensors.filter(s => s.status === 'active').length,
        activeAlerts: data.alerts.filter(a => a.isActive).length,
        criticalAlerts: data.alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length,
        incidentReports: data.incidentReports.length
      },
      sensorData: data.sensors,
      activeAlerts: data.alerts.filter(a => a.isActive),
      emergencyContacts: data.emergencyContacts,
      recentIncidents: data.incidentReports.slice(0, 10)
    };

    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `floodwatch-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading report:', error);
    return false;
  }
};

export const downloadCSVReport = (data: any[], filename: string) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Convert data to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special characters and commas in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return false;
  }
};

export const shareLocationData = async (latitude: number, longitude: number, message?: string) => {
  try {
    const locationData = {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      message: message || 'Emergency location sharing',
      googleMapsUrl: `https://maps.google.com/?q=${latitude},${longitude}`
    };

    if (navigator.share) {
      await navigator.share({
        title: 'Emergency Location',
        text: `${locationData.message}\nCoordinates: ${latitude}, ${longitude}`,
        url: locationData.googleMapsUrl
      });
      return true;
    } else {
      // Fallback: copy to clipboard
      const shareText = `${locationData.message}\nCoordinates: ${latitude}, ${longitude}\nGoogle Maps: ${locationData.googleMapsUrl}`;
      await navigator.clipboard.writeText(shareText);
      return true;
    }
  } catch (error) {
    console.error('Error sharing location:', error);
    return false;
  }
};

export const generateIncidentReport = (incident: {
  type: string;
  description: string;
  location: string;
  severity: string;
  timestamp: string;
}) => {
  const report = `
FLOOD INCIDENT REPORT
=====================

Incident Type: ${incident.type}
Severity: ${incident.severity}
Location: ${incident.location}
Timestamp: ${incident.timestamp}

Description:
${incident.description}

Reporter Information:
Generated by FloodWatch India Radar
Report ID: ${Date.now()}

---
This is an automated incident report.
For emergencies, please call 112 immediately.
`;

  return report;
};
