import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboardLayout from "@/components/layouts/superadmin/SuperAdminDashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database as DatabaseIcon, 
  Shield, 
  Server, 
  Mail,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SystemSettings = () => {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure global system settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Manage database settings and connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Database Type</Label>
                  <Select defaultValue="postgresql">
                    <SelectTrigger>
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Connection String</Label>
                  <Input placeholder="postgresql://user:password@localhost:5432/db" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="backup" />
                <Label htmlFor="backup">Enable Automatic Backups</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="replication" />
                <Label htmlFor="replication">Enable Database Replication</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ characters, mixed case)</SelectItem>
                      <SelectItem value="high">High (12+ characters, special chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Require Two-Factor Authentication</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="ip-restriction" />
                <Label htmlFor="ip-restriction">Enable IP Restriction</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Set up email server and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input type="number" placeholder="587" />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP Username</Label>
                  <Input placeholder="user@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="tls" />
                <Label htmlFor="tls">Enable TLS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
              <CardDescription>
                Configure system maintenance and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Maintenance Window</Label>
                  <Select defaultValue="sunday">
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintenance window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday 2:00 AM</SelectItem>
                      <SelectItem value="monday">Monday 2:00 AM</SelectItem>
                      <SelectItem value="tuesday">Tuesday 2:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Update Channel</Label>
                  <Select defaultValue="stable">
                    <SelectTrigger>
                      <SelectValue placeholder="Select update channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="alpha">Alpha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-updates" />
                <Label htmlFor="auto-updates">Enable Automatic Updates</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="backup-before-update" />
                <Label htmlFor="backup-before-update">Backup Before Updates</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
