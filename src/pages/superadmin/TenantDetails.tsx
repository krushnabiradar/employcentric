import { useState } from "react";
import SuperAdminDashboardLayout from "@/components/layouts/superadmin/SuperAdminDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  Edit, 
  BarChart3, 
  FileSpreadsheet, 
  UserCog, 
  Settings,
  PieChart,
  User
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data for the tenant
const tenantData = {
  id: "t-123456",
  name: "Acme Corporation",
  email: "contact@acme.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY 10001",
  website: "https://acme.com",
  plan: "Enterprise",
  status: "Active",
  createdAt: "2023-01-15",
  industry: "Technology",
  totalUsers: 125,
  activeUsers: 98,
  lastBillingDate: "2023-04-01",
  nextBillingDate: "2023-05-01",
  paymentStatus: "Paid",
};

// Sample data for charts
const userActivityData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 95 },
  { name: 'Apr', value: 105 },
  { name: 'May', value: 115 },
  { name: 'Jun', value: 125 },
];

const moduleUsageData = [
  { name: 'Mon', attendance: 45, leave: 28, payroll: 15, recruitment: 12 },
  { name: 'Tue', attendance: 50, leave: 32, payroll: 18, recruitment: 14 },
  { name: 'Wed', attendance: 47, leave: 30, payroll: 12, recruitment: 10 },
  { name: 'Thu', attendance: 52, leave: 35, payroll: 20, recruitment: 15 },
  { name: 'Fri', attendance: 48, leave: 25, payroll: 14, recruitment: 11 },
];

const userRolesData = [
  { name: 'Admin', value: 5 },
  { name: 'HR', value: 15 },
  { name: 'Manager', value: 25 },
  { name: 'Employee', value: 80 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Sample data for recent activities
const recentActivities = [
  { id: 1, user: "John Doe", action: "Added new employee", date: "2023-04-03 14:35" },
  { id: 2, user: "Jane Smith", action: "Generated payroll report", date: "2023-04-03 10:22" },
  { id: 3, user: "Alex Johnson", action: "Approved leave request", date: "2023-04-02 16:45" },
  { id: 4, user: "Sarah Williams", action: "Updated company policy", date: "2023-04-02 11:30" },
  { id: 5, user: "Michael Brown", action: "Logged attendance", date: "2023-04-01 09:15" },
];

const TenantDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  
  return (

      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/tenants')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{tenantData.name}</h1>
            <p className="text-muted-foreground">
              Tenant ID: {tenantId || tenantData.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/tenant-settings/${tenantId}`)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate(`/tenant-user-management/${tenantId}`)}
            >
              <UserCog className="h-4 w-4" />
              Manage Users
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {tenantData.activeUsers} active users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantData.plan}</div>
              <p className="text-xs text-muted-foreground">
                Next billing: {tenantData.nextBillingDate}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{tenantData.status}</div>
                <Badge className={
                  tenantData.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }>
                  {tenantData.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Since {tenantData.createdAt}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantData.paymentStatus}</div>
              <p className="text-xs text-muted-foreground">
                Last payment: {tenantData.lastBillingDate}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Tenant Information</CardTitle>
              <CardDescription>
                Contact and company details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{tenantData.email}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{tenantData.phone}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">{tenantData.address}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Website</div>
                  <div className="text-sm text-muted-foreground">
                    <a 
                      href={tenantData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {tenantData.website}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Information
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Monthly active users over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userActivityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0088FE" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Usage</CardTitle>
              <CardDescription>
                Weekly module activity breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#0088FE" />
                    <Bar dataKey="leave" fill="#00C49F" />
                    <Bar dataKey="payroll" fill="#FFBB28" />
                    <Bar dataKey="recruitment" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Roles Distribution</CardTitle>
              <CardDescription>
                Breakdown of users by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={userRolesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest actions performed by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-sm text-muted-foreground">{activity.action}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activities
            </Button>
          </CardFooter>
        </Card>
      </div>

  );
};

export default TenantDetails; 
