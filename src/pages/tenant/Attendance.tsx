
import { useState, useEffect } from "react";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
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
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CircleCheck, CircleX, Calendar as CalendarIcon, Clock, ArrowUpDown, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { attendanceApi, AttendanceRecord, AttendanceStats } from "@/api/attendanceApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [userAttendance, setUserAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [hasStatAccess, setHasStatAccess] = useState(false);
  
  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping data fetch");
      setIsLoading(false);
      return;
    }
    
    console.log("User found:", user);
    fetchTodayAttendance();
    
    if (user?.id) {
      fetchUserAttendance(user.id);
      
      // Check if user has stats access
      const adminRoles = ['admin', 'hr', 'manager'];
      if (user.role && adminRoles.includes(user.role)) {
        setHasStatAccess(true);
        fetchAttendanceStats();
      }
    }
  }, [user]);

  const fetchTodayAttendance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching today's attendance...");
      const records = await attendanceApi.getTodayAttendance();
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
      console.log(`Fetching attendance for user ${userId}...`);
      const records = await attendanceApi.getMonthlyAttendance(userId);
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
    if (!hasStatAccess) return;
    
    try {
      console.log("Fetching attendance stats...");
      const data = await attendanceApi.getAttendanceStats();
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

  const handleCheckIn = async () => {
    if (!user?.id) return;
    
    setIsCheckingIn(true);
    try {
      await attendanceApi.checkIn(user.id);
      fetchTodayAttendance();
      fetchUserAttendance(user.id);
      
      toast({
        title: "Check-in successful",
        description: `You've checked in at ${format(new Date(), "hh:mm a")}`,
      });
    } catch (error: any) {
      toast({
        title: "Check-in failed",
        description: error.response?.data?.error || "An error occurred during check-in",
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };
  
  const handleCheckOut = async () => {
    if (!user?.id) return;
    
    setIsCheckingIn(true);
    try {
      await attendanceApi.checkOut(user.id);
      fetchTodayAttendance();
      fetchUserAttendance(user.id);
      
      toast({
        title: "Check-out successful",
        description: `You've checked out at ${format(new Date(), "hh:mm a")}`,
      });
    } catch (error: any) {
      toast({
        title: "Check-out failed",
        description: error.response?.data?.error || "An error occurred during check-out",
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };
  
  const userRecord = attendanceRecords.find(
    record => record?.employeeId?._id === user?.id
  );
  const hasCheckedIn = !!userRecord?.checkIn;
  const hasCheckedOut = !!userRecord?.checkOut;

  return (

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            View and manage attendance records
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Time</p>
                  <p className="text-2xl font-semibold">
                    {format(new Date(), "hh:mm a")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), "EEEE, MMMM do, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isCheckingIn || hasCheckedIn || hasCheckedOut}
                  className="w-32"
                >
                  {isCheckingIn ? (
                    <div className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2" />
                  ) : (
                    <CircleCheck className="h-4 w-4 mr-2" />
                  )}
                  Check In
                </Button>
                <Button 
                  onClick={handleCheckOut} 
                  disabled={isCheckingIn || !hasCheckedIn || hasCheckedOut}
                  variant="outline"
                  className="w-32"
                >
                  {isCheckingIn ? (
                    <div className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2" />
                  ) : (
                    <CircleX className="h-4 w-4 mr-2" />
                  )}
                  Check Out
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex flex-col-reverse md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">Team Attendance Today</h3>
                  <div className="rounded-md border">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="h-8 w-8 border-2 border-current border-r-transparent animate-spin rounded-full"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceRecords && attendanceRecords.length > 0 ? (
                            attendanceRecords.map((record) => (
                              <TableRow key={record._id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={record.employeeId?.avatar} />
                                      <AvatarFallback>
                                        {record.employeeId?.name ? record.employeeId.name.split(" ").map((n) => n[0]).join("") : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{record.employeeId?.name || "Unknown"}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {record.checkIn
                                    ? format(new Date(record.checkIn), "hh:mm a")
                                    : "--:--"}
                                </TableCell>
                                <TableCell>
                                  {record.checkOut
                                    ? format(new Date(record.checkOut), "hh:mm a")
                                    : "--:--"}
                                </TableCell>
                                <TableCell>
                                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    record.status === "present"
                                      ? "bg-green-100 text-green-800"
                                      : record.status === "leave"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {record.status === "present" ? "Present" : record.status === "leave" ? "On Leave" : "Absent"}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center">
                                {isLoading ? "Loading..." : "No attendance records for today"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
                
                <div className="md:w-80">
                  <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
                  <div className="border rounded-md p-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal mb-4"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMMM yyyy") : "Select month"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {stats && hasStatAccess ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Present:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm">
                              {stats.monthlyStats.present} days
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Absent:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm">
                              {stats.monthlyStats.absent} days
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Leave:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm">
                              {stats.monthlyStats.leave} days
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        {hasStatAccess ? "Loading stats..." : "Statistics not available"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Attendance History</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAttendance && userAttendance.length > 0 ? (
                  userAttendance.map((record) => {
                    const checkInTime = record.checkIn ? new Date(record.checkIn) : null;
                    const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;
                    const workingHours = checkInTime && checkOutTime 
                      ? ((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)).toFixed(2)
                      : "--";
                    
                    return (
                      <TableRow key={record._id}>
                        <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          {record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "--:--"}
                        </TableCell>
                        <TableCell>
                          {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "--:--"}
                        </TableCell>
                        <TableCell>
                          {workingHours} {workingHours !== "--" ? "hrs" : ""}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {record.status === "present"
                              ? "Present"
                              : record.status === "absent"
                              ? "Absent"
                              : "On Leave"}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {isLoading ? "Loading..." : "No attendance records found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default Attendance;
