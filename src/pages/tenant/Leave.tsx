
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import axios from "axios";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:5000/api";

interface LeaveRequest {
  _id: string;
  userId: string;
  userName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

const LeaveManagement = () => {
  const { user, socket } = useAuth();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New leave request form state
  const [leaveType, setLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Rejection dialog state
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  // Check if user has admin or HR permissions
  const hasManagementPermissions = user?.role === 'admin' || user?.role === 'hr';

  // Fetch leave requests
  useEffect(() => {
    fetchLeaveRequests();
    
    // Setup real-time updates
    if (socket) {
      socket.on('new-leave-request', () => {
        fetchLeaveRequests();
      });
      
      socket.on('leave-status-update', () => {
        fetchLeaveRequests();
      });
      
      return () => {
        socket.off('new-leave-request');
        socket.off('leave-status-update');
      };
    }
  }, [socket]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/leaves`, {
        withCredentials: true
      });
      
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leaveType || !startDate || !endDate || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/leaves`, 
        {
          leaveType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reason,
        },
        { withCredentials: true }
      );
      
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      // Clear form and close dialog
      setLeaveType("");
      setStartDate(undefined);
      setEndDate(undefined);
      setReason("");
      setOpenDialog(false);
      
      // Update leave requests list
      fetchLeaveRequests();
    } catch (error) {
      let errorMessage = "Failed to submit leave request";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (leaveId: string) => {
    try {
      console.log("Approving leave", leaveId);
      await axios.put(
        `${API_BASE_URL}/leaves/${leaveId}/approve`, 
        {},
        { withCredentials: true }
      );
      
      toast({
        title: "Success",
        description: "Leave request approved",
      });
      
      // Update the leave requests list
      fetchLeaveRequests();
    } catch (error) {
      let errorMessage = "Failed to approve leave request";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
        console.error("Approval error:", error.response.data);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openRejectDialogForLeave = (leaveId: string) => {
    setRejectingLeaveId(leaveId);
    setRejectionReason("");
    setOpenRejectDialog(true);
  };

  const handleReject = async () => {
    if (!rejectingLeaveId) return;
    
    try {
      console.log("Rejecting leave", rejectingLeaveId);
      await axios.put(
        `${API_BASE_URL}/leaves/${rejectingLeaveId}/reject`,
        { reason: rejectionReason },
        { withCredentials: true }
      );
      
      toast({
        title: "Success",
        description: "Leave request rejected",
      });
      
      // Update the leave requests list
      fetchLeaveRequests();
      
      // Close dialog and reset state
      setOpenRejectDialog(false);
      setRejectingLeaveId(null);
      setRejectionReason("");
    } catch (error) {
      let errorMessage = "Failed to reject leave request";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
        console.error("Rejection error:", error.response.data);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const days = differenceInDays(new Date(end), new Date(start)) + 1;
    return days === 1 ? "1 day" : `${days} days`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">
              Request and manage leave applications
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
                <DialogDescription>
                  Submit your leave request for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="leave-type">Leave Type</Label>
                    <Select
                      value={leaveType}
                      onValueChange={setLeaveType}
                      required
                    >
                      <SelectTrigger id="leave-type">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                        <SelectItem value="vacation">Vacation Leave</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain the reason for your leave request"
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : leaveRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No leave requests found</h3>
              <p className="text-muted-foreground">
                You haven't created any leave requests yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    {hasManagementPermissions && (
                      <TableHead>Employee</TableHead>
                    )}
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell className="font-medium capitalize">
                        {leave.leaveType} Leave
                      </TableCell>
                      <TableCell>
                        {calculateDuration(leave.startDate, leave.endDate)}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(leave.startDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(leave.endDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      {hasManagementPermissions && (
                        <TableCell>{leave.userName}</TableCell>
                      )}
                      <TableCell>
                        {format(new Date(leave.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell className="text-right">
                        {hasManagementPermissions &&
                          leave.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleApprove(leave._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => openRejectDialogForLeave(leave._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Reject Confirmation Dialog */}
        <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this leave request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="rejection-reason">Reason for rejection</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this leave request cannot be approved"
                  rows={3}
                  className="resize-none"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default LeaveManagement;
