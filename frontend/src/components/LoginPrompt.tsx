import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Waves } from 'lucide-react';

export default function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
              <Waves className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            OceanMind AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Marine Intelligence & Climate Risk Monitoring Platform
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <p className="text-sm text-muted-foreground">
            Login to access real-time ocean monitoring, satellite intelligence, and fusion analytics
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90"
          >
            {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
          </Button>
        </div>

        <div className="pt-8 text-xs text-muted-foreground">
          <img src="/assets/generated/command-center-hero.dim_1200x600.jpg" alt="Command Center" className="rounded-lg mb-4 opacity-60" />
          © 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">caffeine.ai</a>
        </div>
      </div>
    </div>
  );
}
