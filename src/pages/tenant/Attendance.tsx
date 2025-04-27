import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { attendanceApi, AttendanceRecord, AttendanceStats } from "@/api/attendanceApi";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [userAttendance, setUserAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [hasStatAccess, setHasStatAccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping data fetch");
      setIsLoading(false);
      return;
    }
    
    console.log("User found:", user);
    fetchTodayAttendance();
    
    if (user?.id && user?.tenantId) {
      fetchUserAttendance(user.id);
      fetchUserTodayAttendance();
      
      // Check if user has stats access
      const adminRoles = ['admin', 'hr', 'manager'];
      if (user.role && adminRoles.includes(user.role)) {
        setHasStatAccess(true);
        fetchAttendanceStats();
      }
    }
  }, [user]);
  
  // Format time for display in the clock section
  const formatTimeForDisplay = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "hh:mm:ss a");
  };

  // Calculate worked hours
  const calculateWorkedHours = () => {
    if (!clockInTime || !clockOutTime) return "--:--";
    
    const checkIn = new Date(clockInTime);
    const checkOut = new Date(clockOutTime);
    
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  const fetchTodayAttendance = async () => {
    try {
      if (!user?.tenantId) {
        console.error("No tenant ID found");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Fetching today's attendance...");
      const records = await attendanceApi.getTodayAttendance(user.tenantId);
      console.log("Today's attendance records:", records);
      setAttendanceRecords(records);
    } catch (error: any) {
      console.error("Failed to fetch attendance records:", error);
      setError("Failed to load today's attendance data");
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAttendance = async (userId: string) => {
    try {
      if (!user?.tenantId) {
        console.error("No tenant ID found");
        return;
      }
      
      console.log(`Fetching attendance for user ${userId}...`);
      const records = await attendanceApi.getMonthlyAttendance(userId, user.tenantId);
      console.log("User attendance records:", records);
      setUserAttendance(records);
    } catch (error: any) {
      console.error("Failed to fetch user attendance:", error);
      toast({
        title: "Error",
        description: "Failed to load your attendance history",
        variant: "destructive",
      });
    }
  };

  const fetchAttendanceStats = async () => {
    if (!hasStatAccess || !user?.tenantId) return;
    
    try {
      console.log("Fetching attendance stats...");
      const data = await attendanceApi.getAttendanceStats(user.tenantId);
      console.log("Attendance stats:", data);
      setStats(data);
    } catch (error: any) {
      console.error("Failed to fetch attendance stats:", error);
      if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view attendance statistics",
          variant: "destructive",
        });
      }
    }
  };

  const handleCheckIn = async (employeeId: string) => {
    try {
      if (!user?.tenantId) {
        console.error("No tenant ID found");
        return;
      }
      
      console.log(`Checking in employee ${employeeId}...`);
      await attendanceApi.checkIn(employeeId, user.tenantId);
      
      toast({
        title: "Success",
        description: "Employee checked in successfully",
      });
      
      // Refresh attendance records
      fetchTodayAttendance();
    } catch (error: any) {
      console.error("Failed to check in employee:", error);
      toast({
        title: "Error",
        description: "Failed to check in employee",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (employeeId: string) => {
    try {
      if (!user?.tenantId) {
        console.error("No tenant ID found");
        return;
      }
      
      console.log(`Checking out employee ${employeeId}...`);
      await attendanceApi.checkOut(employeeId, user.tenantId);
      
      toast({
        title: "Success",
        description: "Employee checked out successfully",
      });
      
      // Refresh attendance records
      fetchTodayAttendance();
    } catch (error: any) {
      console.error("Failed to check out employee:", error);
      toast({
        title: "Error",
        description: "Failed to check out employee",
        variant: "destructive",
      });
    }
  };
  
  // Fetch today's attendance for the current user
  const fetchUserTodayAttendance = async () => {
    try {
      if (!user?.id || !user?.tenantId) {
        console.error("Missing user ID or tenant ID");
        return;
      }

      // Get today's attendance for the current user
      const records = await attendanceApi.getMonthlyAttendance(user.id, user.tenantId);
      
      // Find today's record
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = records.find(record => 
        new Date(record.date).toISOString().split('T')[0] === today
      );

      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setClockInTime(todayRecord.checkIn);
        setClockOutTime(todayRecord.checkOut);
      }
    } catch (error) {
      console.error("Failed to fetch today's attendance:", error);
      toast({
        title: "Error",
        description: "Failed to load your attendance data",
        variant: "destructive",
      });
    }
  };

  // Handle personal clock in
  const handlePersonalClockIn = async () => {
    if (!user?.id || !user?.tenantId) {
      toast({
        title: "Error",
        description: "Missing user or tenant information. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await attendanceApi.checkIn(user.id, user.tenantId);
      setTodayAttendance(response);
      setClockInTime(response.checkIn);
      
      toast({
        title: "Success",
        description: "Clock-in recorded successfully",
      });
      
      // Refresh the attendance records
      fetchTodayAttendance();
    } catch (error) {
      console.error("Failed to clock in:", error);
      toast({
        title: "Error",
        description: "Failed to record clock-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle personal clock out
  const handlePersonalClockOut = async () => {
    if (!user?.id || !user?.tenantId) {
      toast({
        title: "Error",
        description: "Missing user or tenant information. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await attendanceApi.checkOut(user.id, user.tenantId);
      setTodayAttendance(response);
      setClockOutTime(response.checkOut);
      
      toast({
        title: "Success",
        description: "Clock-out recorded successfully",
      });
      
      // Refresh the attendance records
      fetchTodayAttendance();
    } catch (error) {
      console.error("Failed to clock out:", error);
      toast({
        title: "Error",
        description: "Failed to record clock-out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter records based on search query
  const filteredRecords = attendanceRecords.filter(record => {
    const searchLower = searchQuery.toLowerCase();
    if (!record.employeeId) return false;
    return (
      (record.employeeId.name && record.employeeId.name.toLowerCase().includes(searchLower)) ||
      (record.employeeId.email && record.employeeId.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
      
      {/* Clock In/Out Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">My Attendance</h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">
                  {format(currentTime, "hh:mm:ss a")}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(currentTime, "EEEE, MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clock In Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTimeForDisplay(clockInTime)}
              </div>
              {clockInTime && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(clockInTime), "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clock Out Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTimeForDisplay(clockOutTime)}
              </div>
              {clockOutTime && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(clockOutTime), "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </CardContent>
          </Card>

          {clockInTime && clockOutTime ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hours Worked Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateWorkedHours()}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 flex items-center justify-center h-full">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={handlePersonalClockIn}
                    disabled={isLoading || !!clockInTime}
                  >
                    Clock In
                  </Button>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={handlePersonalClockOut}
                    disabled={isLoading || !clockInTime || !!clockOutTime}
                  >
                    Clock Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Attendance Stats Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Attendance Overview</h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceRecords.filter(r => r.status === 'present').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceRecords.filter(r => r.status === 'absent').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceRecords.filter(r => r.status === 'leave').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Attendance Records Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Attendance Records</h3>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          
          <Card className="w-full sm:w-auto">
            <CardContent className="flex items-center p-2">
              <div className="text-sm font-medium mr-2">Date:</div>
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border-0 p-0 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={record.employeeId.avatar} />
                            <AvatarFallback>
                              {record.employeeId.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{record.employeeId.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "--:--"}
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "--:--"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {!record.checkIn && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCheckIn(record.employeeId._id)}
                          >
                            Check In
                          </Button>
                        )}
                        {record.checkIn && !record.checkOut && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCheckOut(record.employeeId._id)}
                          >
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
