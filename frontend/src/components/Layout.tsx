import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Satellite, Waves, Ship, Thermometer, Network, AlertTriangle, Home, MapPin } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: '/', label: 'Command Center', icon: Home },
    { path: '/satellite', label: 'Satellite', icon: Satellite },
    { path: '/coral', label: 'Coral', icon: Waves },
    { path: '/ais', label: 'AIS', icon: Ship },
    { path: '/iot', label: 'IoT', icon: Thermometer },
    { path: '/live-ocean-map', label: 'Live Ocean Map', icon: MapPin },
    { path: '/fusion', label: 'Fusion', icon: Network },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/assets/logopranav.png" 
              alt="OceanMind AI Logo" 
              className="h-9 w-auto object-contain flex-shrink-0"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent leading-tight">
              OceanMind AI
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Marine Intelligence Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground mb-3 px-2">
            {identity?.getPrincipal().toString().slice(0, 8)}...
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full" size="sm">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
