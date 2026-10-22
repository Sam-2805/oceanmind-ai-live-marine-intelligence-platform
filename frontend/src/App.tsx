import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import CommandCenter from './pages/CommandCenter';
import SatelliteModule from './pages/SatelliteModule';
import CoralModule from './pages/CoralModule';
import AISModule from './pages/AISModule';
import IoTModule from './pages/IoTModule';
import FusionModule from './pages/FusionModule';
import AlertsModule from './pages/AlertsModule';
import LiveOceanMapModule from './pages/LiveOceanMapModule';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import LoginPrompt from './components/LoginPrompt';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CommandCenter,
});

const satelliteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/satellite',
  component: SatelliteModule,
});

const coralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coral',
  component: CoralModule,
});

const aisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ais',
  component: AISModule,
});

const iotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/iot',
  component: IoTModule,
});

const liveOceanMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live-ocean-map',
  component: LiveOceanMapModule,
});

const fusionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fusion',
  component: FusionModule,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: AlertsModule,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  satelliteRoute,
  coralRoute,
  aisRoute,
  iotRoute,
  liveOceanMapRoute,
  fusionRoute,
  alertsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
