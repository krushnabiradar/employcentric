import { useState } from "react";
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

// Sample tenant registration requests
const pendingRequests = [
  { id: 1, company: "TechNova Solutions", email: "admin@technova.com", name: "Alex Chen", phone: "+1 (555) 111-2233", plan: "Professional", requestDate: "2023-04-01" },
  { id: 2, company: "Green Horizons Inc", email: "contact@greenhorizons.com", name: "Morgan Smith", phone: "+1 (555) 444-5566", plan: "Basic", requestDate: "2023-04-02" },
  { id: 3, company: "Nexus Dynamics", email: "admin@nexusdynamics.com", name: "Jordan Lee", phone: "+1 (555) 777-8899", plan: "Enterprise", requestDate: "2023-04-03" },
];

const recentApprovals = [
  { id: 4, company: "Quantum Innovations", email: "admin@quantum.com", name: "Taylor Jones", status: "approved", date: "2023-03-30" },
  { id: 5, company: "Alpine Software", email: "contact@alpine.com", name: "Casey Williams", status: "approved", date: "2023-03-29" },
];

const recentRejections = [
  { id: 6, company: "Fake Company LLC", email: "suspicious@example.com", name: "Unknown Person", status: "rejected", reason: "Suspicious information", date: "2023-03-31" },
  { id: 7, company: "Test Organization", email: "test@test.com", name: "Test User", status: "rejected", reason: "Test submission", date: "2023-03-28" },
];

const TenantApprovals = () => {
  const { toast } = useToast();
  const [activeRequests, setActiveRequests] = useState(pendingRequests);
  
  const handleApprove = (id: number) => {
    toast({
      title: "Tenant Approved",
      description: "The tenant registration has been approved and the account has been activated.",
    });
    setActiveRequests(activeRequests.filter(request => request.id !== id));
  };
  
  const handleReject = (id: number) => {
    toast({
      title: "Tenant Rejected",
      description: "The tenant registration has been rejected.",
    });
    setActiveRequests(activeRequests.filter(request => request.id !== id));
  };
  
  return (
  
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve new tenant registrations
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRequests.length}</div>
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
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <CardContent>
                {activeRequests.length > 0 ? (
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
                      {activeRequests.map((request) => (
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
                                onClick={() => handleReject(request.id)}
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      There are no pending tenant approval requests at this time.
                    </p>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">
                          {approval.company}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{approval.name}</div>
                          <div className="text-sm text-muted-foreground">{approval.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell>{approval.date}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Recently Rejected</CardTitle>
                <CardDescription>
                  Tenant requests rejected in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRejections.map((rejection) => (
                      <TableRow key={rejection.id}>
                        <TableCell className="font-medium">
                          {rejection.company}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{rejection.name}</div>
                          <div className="text-sm text-muted-foreground">{rejection.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            Rejected
                          </Badge>
                        </TableCell>
                        <TableCell>{rejection.reason}</TableCell>
                        <TableCell>{rejection.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default TenantApprovals;
