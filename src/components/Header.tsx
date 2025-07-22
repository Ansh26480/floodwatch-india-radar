import { Search, Menu, MapPin, User, Bell, Settings, HelpCircle, Shield, Users, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  userRole: 'citizen' | 'responder';
  onRoleChange: (role: 'citizen' | 'responder') => void;
}

export function Header({ userRole, onRoleChange }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchValue);
    }
  };

  return (
    <Card className="w-full rounded-none border-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Waves className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                FloodWatch
              </h1>
              <p className="text-xs text-muted-foreground font-medium">India</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                FloodWatch
              </h1>
            </div>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search location, district, or state..."
              className="pl-9 bg-background/50 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all duration-300 hover:bg-background/80"
            />
          </form>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative hover:bg-primary/10 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Role Badge */}
          <Badge 
            variant={userRole === 'responder' ? 'default' : 'secondary'}
            className="hidden sm:flex items-center gap-1 px-3 py-1 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onRoleChange(userRole === 'citizen' ? 'responder' : 'citizen')}
          >
            {userRole === 'citizen' ? <Users className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
            {userRole === 'citizen' ? 'Citizen' : 'Responder'}
          </Badge>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 hover:bg-primary/10 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="font-semibold">Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onRoleChange('citizen')}
                className="cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Citizen View</span>
                  </div>
                  {userRole === 'citizen' && (
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  )}
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onRoleChange('responder')}
                className="cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Responder View</span>
                  </div>
                  {userRole === 'responder' && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 transition-colors">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9 hover:bg-primary/10 transition-colors"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search - Shown only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search location..."
            className="pl-9 bg-background/50 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all duration-300"
          />
        </form>
      </div>
    </Card>
  );
}