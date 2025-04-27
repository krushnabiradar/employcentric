import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Filter, 
  Mail 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { tenantApi } from "@/lib/api";

interface TenantRequest {
  id: string;
  company: string;
  email: string;
  name: string;
  phone: string;
  plan: string;
  requestDate: string;
  status?: string;
  reason?: string;
}

const TenantApprovals = () => {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<TenantRequest[]>([]);
  const [recentApprovals, setRecentApprovals] = useState<TenantRequest[]>([]);
  const [recentRejections, setRecentRejections] = useState<TenantRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requests = await tenantApi.getPendingTenantRequests();
        setPendingRequests(requests);
        // Note: You might want to add separate API endpoints for recent approvals and rejections
        // For now, we'll filter from the pending requests
        setRecentApprovals(requests.filter(r => r.status === 'approved'));
        setRecentRejections(requests.filter(r => r.status === 'rejected'));
      } catch (error) {
        console.error('Error fetching tenant requests:', error);
        toast({
          title: "Error",
          description: "Failed to load tenant requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleApprove = async (id: string) => {
    try {
      await tenantApi.approveTenantRequest(id);
      setPendingRequests(pendingRequests.filter(request => request.id !== id));
      toast({
        title: "Tenant Approved",
        description: "The tenant registration has been approved and the account has been activated.",
      });
    } catch (error) {
      console.error('Error approving tenant:', error);
      toast({
        title: "Error",
        description: "Failed to approve tenant request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await tenantApi.rejectTenantRequest(id, reason);
      setPendingRequests(pendingRequests.filter(request => request.id !== id));
      toast({
        title: "Tenant Rejected",
        description: "The tenant registration has been rejected.",
      });
    } catch (error) {
      console.error('Error rejecting tenant:', error);
      toast({
        title: "Error",
        description: "Failed to reject tenant request",
        variant: "destructive",
      });
    }
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tenant Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve new tenant registrations
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved (Last 30 days)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              Recently approved tenants
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected (Last 30 days)</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRejections.length}</div>
            <p className="text-xs text-muted-foreground">
              Recently rejected requests
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>
                    Review and approve new tenant registrations
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingRequests.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Requested</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">
                                {request.company}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{request.name}</div>
                                <div className="text-sm text-muted-foreground">{request.email}</div>
                                <div className="text-sm text-muted-foreground">{request.phone}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  request.plan === "Enterprise" 
                                    ? "default" 
                                    : request.plan === "Professional" 
                                      ? "outline" 
                                      : "secondary"
                                }>
                                  {request.plan}
                                </Badge>
                              </TableCell>
                              <TableCell>{request.requestDate}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => window.open(`mailto:${request.email}`, '_blank')}
                                  >
                                    <Mail className="h-3 w-3" />
                                    Contact
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleReject(request.id, "Rejected by admin")}
                                  >
                                    Reject
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    Approve
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-2">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} className="border-0 shadow-none">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{request.company}</h3>
                              <p className="text-sm text-muted-foreground">{request.name}</p>
                            </div>
                            <Badge variant={
                              request.plan === "Enterprise" 
                                ? "default" 
                                : request.plan === "Professional" 
                                  ? "outline" 
                                  : "secondary"
                            }>
                              {request.plan}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="text-sm">{request.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="text-sm">{request.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Requested</p>
                              <p className="text-sm">{request.requestDate}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => window.open(`mailto:${request.email}`, '_blank')}
                            >
                              <Mail className="h-3 w-3" />
                              Contact
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(request.id, "Rejected by admin")}
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No pending tenant requests
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved</CardTitle>
              <CardDescription>
                Tenants approved in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentApprovals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Approved On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.company}</TableCell>
                        <TableCell>
                          <div>{approval.name}</div>
                          <div className="text-sm text-muted-foreground">{approval.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{approval.plan}</Badge>
                        </TableCell>
                        <TableCell>{approval.requestDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground">
                  No recent approvals
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Recently Rejected</CardTitle>
              <CardDescription>
                Requests rejected in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRejections.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Rejected On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRejections.map((rejection) => (
                      <TableRow key={rejection.id}>
                        <TableCell className="font-medium">{rejection.company}</TableCell>
                        <TableCell>
                          <div>{rejection.name}</div>
                          <div className="text-sm text-muted-foreground">{rejection.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rejection.plan}</Badge>
                        </TableCell>
                        <TableCell>{rejection.reason}</TableCell>
                        <TableCell>{rejection.requestDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground">
                  No recent rejections
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantApprovals;
