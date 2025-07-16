import { Search, Menu, MapPin, User } from "lucide-react";
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

interface HeaderProps {
  userRole: 'citizen' | 'responder';
  onRoleChange: (role: 'citizen' | 'responder') => void;
}

export function Header({ userRole, onRoleChange }: HeaderProps) {
  return (
    <Card className="w-full rounded-none border-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-water flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FloodWatch</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">India</p>
            </div>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search location, district, or state..."
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* User Menu and Role Toggle */}
        <div className="flex items-center gap-2">
          {/* Role Badge */}
          <Badge 
            variant={userRole === 'responder' ? 'default' : 'secondary'}
            className="hidden sm:flex"
          >
            {userRole === 'citizen' ? 'Citizen' : 'Emergency Responder'}
          </Badge>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onRoleChange('citizen')}>
                <div className="flex items-center justify-between w-full">
                  <span>Citizen View</span>
                  {userRole === 'citizen' && <Badge variant="secondary" className="text-xs">Active</Badge>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRoleChange('responder')}>
                <div className="flex items-center justify-between w-full">
                  <span>Responder View</span>
                  {userRole === 'responder' && <Badge variant="default" className="text-xs">Active</Badge>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search - Shown only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            className="pl-9 bg-background"
          />
        </div>
      </div>
    </Card>
  );
}