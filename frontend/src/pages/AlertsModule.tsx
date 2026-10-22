import { useGetAllAlerts, useAddAlert } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Filter, Activity, TrendingUp, Network } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Alert } from '../backend';

export default function AlertsModule() {
  const { data: alerts = [], isLoading, isFetching } = useGetAllAlerts();
  const addAlert = useAddAlert();

  const [alertType, setAlertType] = useState('Illegal Fishing');
  const [severity, setSeverity] = useState('2');
  const [source, setSource] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `alert-${Date.now()}`;

    try {
      await addAlert.mutateAsync({
        id,
        type: alertType,
        severity: BigInt(parseInt(severity)),
        source: source.trim() || null,
      });
      toast.success('Alert created successfully');
      setSource('');
    } catch (error) {
      toast.error('Failed to create alert');
      console.error('Alert creation error:', error);
    }
  };

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Apply severity filter
    if (filterSeverity !== 'all') {
      const severityNum = parseInt(filterSeverity);
      filtered = filtered.filter((alert) => Number(alert.severity) === severityNum);
    }

    // Apply type filter (including Fusion alerts)
    if (filterType !== 'all') {
      if (filterType === 'fusion') {
        filtered = filtered.filter((alert) => alert.type === 'Fusion');
      } else {
        filtered = filtered.filter((alert) => alert.type !== 'Fusion');
      }
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    return filtered;
  }, [alerts, filterSeverity, filterType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const critical = alerts.filter((a) => Number(a.severity) === 4).length;
    const high = alerts.filter((a) => Number(a.severity) === 3).length;
    const medium = alerts.filter((a) => Number(a.severity) === 2).length;
    const low = alerts.filter((a) => Number(a.severity) === 1).length;
    const fusionAlerts = alerts.filter((a) => a.type === 'Fusion').length;

    return { critical, high, medium, low, total: alerts.length, fusion: fusionAlerts };
  }, [alerts]);

  const getSeverityLabel = (sev: bigint): string => {
    const num = Number(sev);
    if (num === 4) return 'Critical';
    if (num === 3) return 'High';
    if (num === 2) return 'Medium';
    return 'Low';
  };

  const getSeverityColor = (sev: bigint): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const num = Number(sev);
    if (num === 4) return 'destructive';
    if (num === 3) return 'default';
    if (num === 2) return 'secondary';
    return 'outline';
  };

  const getSeverityBgColor = (sev: bigint): string => {
    const num = Number(sev);
    if (num === 4) return 'bg-destructive/10 border-destructive/30';
    if (num === 3) return 'bg-orange-500/10 border-orange-500/30';
    if (num === 2) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-green-500/10 border-green-500/30';
  };

  const getSeverityIconColor = (sev: bigint): string => {
    const num = Number(sev);
    if (num === 4) return 'text-destructive';
    if (num === 3) return 'text-orange-500';
    if (num === 2) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-destructive to-chart-1 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Central Alerts & Incident Management</h1>
              <p className="text-muted-foreground">Real-time alert tracking and incident response with Fusion Engine integration</p>
            </div>
          </div>
          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Live updates active</span>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <Card>
          <CardContent className="p-0">
            <img
              src="/assets/generated/marine-alerts-dashboard.dim_800x600.jpg"
              alt="Marine Alerts Dashboard"
              className="w-full h-64 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground mt-1">Severity Level 4</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.high}</div>
              <p className="text-xs text-muted-foreground mt-1">Severity Level 3</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Medium Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
              <p className="text-xs text-muted-foreground mt-1">Severity Level 2</p>
            </CardContent>
          </Card>

          <Card className="border-chart-1/50 bg-chart-1/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Network className="w-4 h-4" />
                Fusion Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{stats.fusion}</div>
              <p className="text-xs text-muted-foreground mt-1">Multi-source correlation</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All severity levels</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Alert Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Alert</CardTitle>
              <CardDescription>Manually trigger a new alert</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAlert} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alertType">Alert Type</Label>
                  <Select value={alertType} onValueChange={setAlertType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Illegal Fishing">Illegal Fishing</SelectItem>
                      <SelectItem value="Reef Emergency">Reef Emergency</SelectItem>
                      <SelectItem value="Pollution Event">Pollution Event</SelectItem>
                      <SelectItem value="MPA Violation">MPA Violation</SelectItem>
                      <SelectItem value="Heat Stress">Heat Stress</SelectItem>
                      <SelectItem value="Hypoxia">Hypoxia</SelectItem>
                      <SelectItem value="Vessel Clustering">Vessel Clustering</SelectItem>
                      <SelectItem value="Climate Stress">Climate Stress</SelectItem>
                      <SelectItem value="Fusion">Fusion (Multi-source)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low (1)</SelectItem>
                      <SelectItem value="2">Medium (2)</SelectItem>
                      <SelectItem value="3">High (3)</SelectItem>
                      <SelectItem value="4">Critical (4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source Module (optional)</Label>
                  <Input
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g., Satellite, AIS, IoT, Coral, Fusion Engine"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={addAlert.isPending}>
                  {addAlert.isPending ? 'Creating...' : 'Create Alert'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alert Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Alert Timeline
                  </CardTitle>
                  <CardDescription>Chronological incident history with live updates every 8 seconds</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fusion">Fusion Only</SelectItem>
                      <SelectItem value="other">Non-Fusion</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="4">Critical (4)</SelectItem>
                      <SelectItem value="3">High (3)</SelectItem>
                      <SelectItem value="2">Medium (2)</SelectItem>
                      <SelectItem value="1">Low (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading alerts...</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {filterSeverity !== 'all' || filterType !== 'all'
                      ? 'No alerts match the selected filters'
                      : 'No alerts yet. System monitoring is active.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${getSeverityBgColor(
                        alert.severity
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {alert.type === 'Fusion' ? (
                            <Network className="w-5 h-5 mt-0.5 text-chart-1" />
                          ) : (
                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityIconColor(alert.severity)}`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">{alert.type}</span>
                              {alert.type === 'Fusion' && (
                                <Badge variant="outline" className="text-xs bg-chart-1/10 border-chart-1">
                                  Fusion Engine
                                </Badge>
                              )}
                            </div>
                            {alert.source && (
                              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="font-medium">Source:</span>
                                <span>{alert.source}</span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(Number(alert.timestamp) / 1000000).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant={getSeverityColor(alert.severity)} className="shrink-0">
                          {getSeverityLabel(alert.severity)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
