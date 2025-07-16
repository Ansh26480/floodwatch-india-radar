import { useState } from "react";
import { Header } from "./Header";
import { MapView } from "./MapView";
import { RiskPanel } from "./RiskPanel";

export function Dashboard() {
  const [userRole, setUserRole] = useState<'citizen' | 'responder'>('citizen');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header userRole={userRole} onRoleChange={setUserRole} />
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Map Section - Left side */}
        <div className="flex-1 p-4">
          <div className="h-full rounded-lg overflow-hidden shadow-lg border">
            <MapView />
          </div>
        </div>
        
        {/* Risk Panel - Right side */}
        <div className="w-80 lg:w-96 p-4 pl-0">
          <div className="h-full">
            <RiskPanel userRole={userRole} />
          </div>
        </div>
      </div>
    </div>
  );
}