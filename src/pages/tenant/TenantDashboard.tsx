import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  DollarSign,
  Briefcase,
  LineChart,
  AlertTriangle,
  Activity,
  Globe,
  ServerIcon
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { 
  employeeApi, 
  attendanceApi, 
  leaveApi, 
  payrollApi, 
  recruitmentApi 
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  totalPayroll: number;
  openPositions: number;
}

interface EmployeeGrowthData {
  name: string;
  value: number;
}

interface AttendanceData {
  name: string;
  present: number;
  absent: number;
}

const TenantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employeeGrowth, setEmployeeGrowth] = useState<EmployeeGrowthData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          employeeStats,
          growthData,
          attendanceStats,
          leaveStats,
          payrollStats,
          recruitmentStats
        ] = await Promise.all([
          employeeApi.getEmployeeStats(),
          employeeApi.getEmployees(),
          attendanceApi.getAttendanceStats(),
          leaveApi.getLeaveRequests(),
          payrollApi.getPayrollSummary(),
          recruitmentApi.getRecruitmentStats()
        ]);

        // Calculate dashboard stats
        const dashboardStats: DashboardStats = {
          totalEmployees: employeeStats.total,
          activeEmployees: employeeStats.active,
          pendingLeaveRequests: leaveStats.filter((l: any) => l.status === 'pending').length,
          totalPayroll: payrollStats.total,
          openPositions: recruitmentStats.openPositions
        };

        // Process employee growth data
        const processedGrowthData = processGrowthData(growthData);
        
        // Process attendance data
        const processedAttendanceData = processAttendanceData(attendanceStats);

        setStats(dashboardStats);
        setEmployeeGrowth(processedGrowthData);
        setAttendanceData(processedAttendanceData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const processGrowthData = (data: any[]): EmployeeGrowthData[] => {
    // Process raw employee data into growth chart format
    // This is a placeholder - adjust based on your actual data structure
    return data.map((employee, index) => ({
      name: `Month ${index + 1}`,
      value: index + 1
    }));
  };

  const processAttendanceData = (data: any): AttendanceData[] => {
    // Process raw attendance data into chart format
    // This is a placeholder - adjust based on your actual data structure
    return [
      { name: 'Present', present: data.present, absent: 0 },
      { name: 'Absent', present: 0, absent: data.absent }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tenant Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your organization's overview.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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
              {stats?.activeEmployees || 0} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Leave Requests
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeaveRequests || 0}</div>
            <p className="text-xs text-muted-foreground">
              Needs approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payroll
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalPayroll?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.openPositions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active job postings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData.length > 0 
                ? Math.round((attendanceData[0].present / (attendanceData[0].present + attendanceData[1].absent)) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
            {/* Employee growth chart */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
                <CardDescription>
                  New hires over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={employeeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Attendance chart */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Present vs Absent employees
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                In-depth analysis of your organization's data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard; 