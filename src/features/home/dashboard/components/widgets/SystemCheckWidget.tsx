import { Activity, Cpu, Database, Globe, HardDrive, MemoryStick, Server, Wifi } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Progress } from '@/components/shadcn/progress';
import { Separator } from '@/components/shadcn/separator';

const SystemCheckWidget = () => {
  // Mock Data
  const systemStatus = {
    cpu: { usage: 45, temp: 52 },
    memory: { used: 6.2, total: 16 },
    disk: { used: 120, total: 512 },
    network: { up: 1.2, down: 4.5 },
    services: [
      { name: 'Database', status: 'online', icon: Database },
      { name: 'API Gateway', status: 'online', icon: Globe },
      { name: 'Auth Service', status: 'online', icon: Server },
      { name: 'Storage', status: 'maintenance', icon: HardDrive },
    ]
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">System Status</h2>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            All Systems Operational
          </Badge>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* CPU */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.cpu.usage}%</div>
              <Progress value={systemStatus.cpu.usage} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Temperature: {systemStatus.cpu.temp}°C
              </p>
            </CardContent>
          </Card>

          {/* Memory */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((systemStatus.memory.used / systemStatus.memory.total) * 100)}%
              </div>
              <Progress 
                value={(systemStatus.memory.used / systemStatus.memory.total) * 100} 
                className="mt-2 h-2" 
              />
              <p className="text-xs text-muted-foreground mt-2">
                {systemStatus.memory.used}GB / {systemStatus.memory.total}GB
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disk & Network Row */}
        <div className="grid gap-4 md:grid-cols-2">
           {/* Disk */}
           <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                Disk Usage
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round((systemStatus.disk.used / systemStatus.disk.total) * 100)}%
              </span>
            </div>
            <Progress 
              value={(systemStatus.disk.used / systemStatus.disk.total) * 100} 
              className="h-2" 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{systemStatus.disk.used}GB Used</span>
              <span>{systemStatus.disk.total}GB Total</span>
            </div>
          </div>

          {/* Network */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-4">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              Network Activity
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Upload</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {systemStatus.network.up} <span className="text-xs font-normal text-muted-foreground">MB/s</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Download</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {systemStatus.network.down} <span className="text-xs font-normal text-muted-foreground">MB/s</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Services Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Service Status</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {systemStatus.services.map((service) => (
              <div 
                key={service.name} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    service.status === 'online' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    <service.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-xs text-muted-foreground capitalize">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCheckWidget;
