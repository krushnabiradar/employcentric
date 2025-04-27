import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Clock, 
  Calendar, 
  CreditCard, 
  UserPlus,
  BriefcaseIcon,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { employeeApi } from "@/api/employeeApi";
import { attendanceApi } from "@/api/attendanceApi";
import { leaveApi } from "@/api/leaveApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalEmployees: number;
  attendanceToday: {
    present: number;
    absent: number;
    percentage: number;
  };
  pendingLeaves: number;
  weeklyAttendance: Array<{
    name: string;
    value: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status?: string;
  }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all required data in parallel
      const [employees, attendance, leaves] = await Promise.all([
        employeeApi.getAllEmployees(),
        attendanceApi.getTodayAttendance(),
        leaveApi.getAllLeaves()
      ]);

      // Calculate attendance stats
      const presentCount = attendance.filter(a => a.status === 'present').length;
      const totalCount = employees.length;
      const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

      // Get weekly attendance data
      const weeklyAttendance = await Promise.all(
        Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return attendanceApi.getTodayAttendance();
        })
      );

      const weeklyData = weeklyAttendance.map((day, index) => {
        const present = day.filter(a => a.status === 'present').length;
        const percentage = totalCount > 0 ? Math.round((present / totalCount) * 100) : 0;
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        return {
          name: dayNames[index],
          value: percentage
        };
      }).reverse();

      // Filter pending leaves
      const pendingLeaves = leaves.filter(leave => leave.status === 'pending');

      // Combine all data into dashboard stats
      const dashboardStats: DashboardStats = {
        totalEmployees: employees.length,
        attendanceToday: {
          present: presentCount,
          absent: totalCount - presentCount,
          percentage: attendancePercentage
        },
        pendingLeaves: pendingLeaves.length,
        weeklyAttendance: weeklyData,
        recentActivities: [
          ...pendingLeaves.slice(0, 3).map(leave => ({
            id: leave._id,
            type: 'leave',
            description: `${leave.userName} requested ${leave.leaveType} leave`,
            timestamp: new Date(leave.createdAt).toLocaleString(),
            status: leave.status
          }))
        ]
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 p-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your team today.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active employees in your organization
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendanceToday.percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.attendanceToday.present || 0} checked in, {stats?.attendanceToday.absent || 0} absent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Leaves
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeaves || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requires your approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Active job postings
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Attendance chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>
                  Attendance rates for the current week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.weeklyAttendance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Important updates */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Updates</CardTitle>
                <CardDescription>
                  Recent notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'leave' ? 'bg-blue-100' :
                        activity.type === 'recruitment' ? 'bg-green-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'leave' ? (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        ) : activity.type === 'recruitment' ? (
                          <UserPlus className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                        {activity.status && (
                          <p className={`text-xs mt-1 ${
                            activity.status === 'pending' ? 'text-amber-600' :
                            activity.status === 'approved' ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
              <CardDescription>
                Detailed analytics will be shown here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics data and visualizations coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
              <CardDescription>
                Reports will be shown here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports and exports coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
