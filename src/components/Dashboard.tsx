import { useState } from "react";
import { Header } from "./Header";
import { RiskPanel } from "./RiskPanel";
import { FloodMapView } from "./FloodMapView";

export function Dashboard() {
  const [userRole, setUserRole] = useState<'citizen' | 'responder'>('citizen');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <Header userRole={userRole} onRoleChange={setUserRole} />
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Map Section - Left side */}
        <div className="flex-1 p-4">
          <div className="h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
            <FloodMapView />
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