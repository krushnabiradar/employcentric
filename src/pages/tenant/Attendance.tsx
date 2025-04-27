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

  const handleCheckIn = async (employeeId: string) => {
    try {
      await attendanceApi.checkIn(employeeId);
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      });
      fetchTodayAttendance();
      fetchUserAttendance(employeeId);
    } catch (error) {
      console.error("Failed to check in:", error);
      toast({
        title: "Error",
        description: "Failed to record check-in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (employeeId: string) => {
    try {
      await attendanceApi.checkOut(employeeId);
      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      });
      fetchTodayAttendance();
      fetchUserAttendance(employeeId);
    } catch (error) {
      console.error("Failed to check out:", error);
      toast({
        title: "Error",
        description: "Failed to record check-out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter attendance records based on search
  const filteredRecords = attendanceRecords.filter(record => 
    record.employeeId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Manage employee attendance records
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-[200px]"
          />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Present</CardTitle>
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
  );
};

export default Attendance;
