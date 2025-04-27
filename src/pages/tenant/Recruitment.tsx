
import { useState } from "react";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, PlusCircle, Building, MapPin, Clock, Briefcase, Search, 
  Filter, Download, MoreHorizontal, Calendar, Users, CheckCircle2, XCircle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for job listings
const jobListings = [
  {
    id: "JOB-2023-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    postedDate: "2023-04-01",
    status: "Open",
    applicants: 18,
  },
  {
    id: "JOB-2023-002",
    title: "HR Manager",
    department: "Human Resources",
    location: "Remote",
    type: "Full-time",
    postedDate: "2023-04-05",
    status: "Open",
    applicants: 12,
  },
  {
    id: "JOB-2023-003",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Contract",
    postedDate: "2023-03-25",
    status: "Closed",
    applicants: 24,
  },
  {
    id: "JOB-2023-004",
    title: "Data Analyst",
    department: "Data Science",
    location: "Remote",
    type: "Part-time",
    postedDate: "2023-04-10",
    status: "Open",
    applicants: 8,
  },
  {
    id: "JOB-2023-005",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    postedDate: "2023-03-15",
    status: "Interviewing",
    applicants: 32,
  },
];

// Mock data for applicants
const applicants = [
  {
    id: "APP-2023-001",
    name: "John Smith",
    jobId: "JOB-2023-001",
    jobTitle: "Senior Frontend Developer",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    appliedDate: "2023-04-05",
    status: "Screening",
    resume: "resume-john-smith.pdf",
    avatar: "",
  },
  {
    id: "APP-2023-002",
    name: "Sarah Johnson",
    jobId: "JOB-2023-001",
    jobTitle: "Senior Frontend Developer",
    email: "sarah.johnson@example.com",
    phone: "555-987-6543",
    appliedDate: "2023-04-07",
    status: "Interview",
    resume: "resume-sarah-johnson.pdf",
    avatar: "",
  },
  {
    id: "APP-2023-003",
    name: "Michael Brown",
    jobId: "JOB-2023-002",
    jobTitle: "HR Manager",
    email: "michael.brown@example.com",
    phone: "555-456-7890",
    appliedDate: "2023-04-08",
    status: "Rejected",
    resume: "resume-michael-brown.pdf",
    avatar: "",
  },
  {
    id: "APP-2023-004",
    name: "Emily Davis",
    jobId: "JOB-2023-002",
    jobTitle: "HR Manager",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    appliedDate: "2023-04-06",
    status: "Offer",
    resume: "resume-emily-davis.pdf",
    avatar: "",
  },
  {
    id: "APP-2023-005",
    name: "David Wilson",
    jobId: "JOB-2023-004",
    jobTitle: "Data Analyst",
    email: "david.wilson@example.com",
    phone: "555-321-6547",
    appliedDate: "2023-04-11",
    status: "New",
    resume: "resume-david-wilson.pdf",
    avatar: "",
  },
];

const Recruitment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [applicantSearchQuery, setApplicantSearchQuery] = useState("");
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("all");
  
  // Filter jobs based on search and status
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      job.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter applicants based on search and status
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(applicantSearchQuery.toLowerCase());
    
    const matchesStatus = 
      applicantStatusFilter === "all" || 
      applicant.status.toLowerCase() === applicantStatusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Open</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      case 'interviewing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Interviewing</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getApplicantStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case 'screening':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Screening</Badge>;
      case 'interview':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Interview</Badge>;
      case 'offer':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Offer</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
            <p className="text-muted-foreground">
              Manage job postings and candidate applications
            </p>
          </div>
          <Button onClick={() => setShowNewJobDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobListings.filter(job => job.status === "Open").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(jobListings.map(job => job.department)).size} departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applicants.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {applicants.filter(app => app.status === "New").length} new this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applicants.filter(app => app.status === "Interview").length}
              </div>
              <p className="text-xs text-muted-foreground">
                For this week
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-[400px]">
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
          </TabsList>
          
          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.id}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {job.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {job.type}
                          </div>
                        </TableCell>
                        <TableCell>{job.postedDate}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>{job.applicants}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Applicants
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Duplicate Job
                              </DropdownMenuItem>
                              {job.status === "Open" ? (
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Close Position
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Reopen Position
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Applicants Tab */}
          <TabsContent value="applicants" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    className="pl-8"
                    value={applicantSearchQuery}
                    onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={applicantStatusFilter}
                  onValueChange={setApplicantStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={applicant.avatar} />
                              <AvatarFallback>
                                {applicant.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{applicant.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {applicant.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{applicant.jobTitle}</div>
                            <div className="text-xs text-muted-foreground">
                              {applicant.jobId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{applicant.appliedDate}</TableCell>
                        <TableCell>{getApplicantStatusBadge(applicant.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Applicant Details</DialogTitle>
                                <DialogDescription>
                                  Review applicant information and manage their candidacy
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left column - Personal Info */}
                                <div className="space-y-6">
                                  <div className="flex flex-col items-center space-y-3">
                                    <Avatar className="h-20 w-20">
                                      <AvatarImage src={applicant.avatar} />
                                      <AvatarFallback className="text-lg">
                                        {applicant.name.split(" ").map((n) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                      <h3 className="font-semibold text-lg">{applicant.name}</h3>
                                      <p className="text-sm text-muted-foreground">{applicant.email}</p>
                                      <p className="text-sm text-muted-foreground">{applicant.phone}</p>
                                    </div>
                                    <div className="w-full">
                                      {getApplicantStatusBadge(applicant.status)}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Personal Information</h4>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Location</p>
                                      <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Applied On</p>
                                      <p className="text-sm text-muted-foreground">{applicant.appliedDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Resume</p>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Resume
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Center column - Application Details */}
                                <div className="space-y-6 md:col-span-2">
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Application Details</h4>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Job Position</p>
                                      <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <p className="text-sm">{applicant.jobTitle}</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground">ID: {applicant.jobId}</p>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Cover Letter</p>
                                      <div className="p-3 border rounded-md text-sm">
                                        <p>Dear Hiring Manager,</p>
                                        <br />
                                        <p>
                                          I am writing to express my interest in the {applicant.jobTitle} position. 
                                          With my background in software development and experience working with 
                                          React and TypeScript, I believe I would be a valuable addition to your team.
                                        </p>
                                        <br />
                                        <p>
                                          In my previous role at XYZ Company, I successfully led the development of 
                                          several key features that improved user engagement by 35%. I am excited 
                                          about the opportunity to bring my skills and enthusiasm to your organization.
                                        </p>
                                        <br />
                                        <p>Thank you for considering my application.</p>
                                        <br />
                                        <p>Sincerely,</p>
                                        <p>{applicant.name}</p>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-3">
                                      <p className="text-sm font-medium">Interview Notes</p>
                                      <Textarea 
                                        placeholder="Add interview notes here..." 
                                        className="h-24 resize-none"
                                      />
                                    </div>
                                    
                                    <div className="pt-4">
                                      <p className="text-sm font-medium mb-2">Update Status</p>
                                      <Select defaultValue={applicant.status.toLowerCase()}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="screening">Screening</SelectItem>
                                          <SelectItem value="interview">Interview</SelectItem>
                                          <SelectItem value="offer">Offer</SelectItem>
                                          <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter className="flex justify-between items-center gap-2">
                                <Button variant="outline" className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Candidate
                                </Button>
                                <div className="flex gap-2">
                                  <Button variant="outline">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Interview
                                  </Button>
                                  <Button>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* New Job Dialog */}
        <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
              <DialogDescription>
                Create a new job posting for your organization
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" placeholder="e.g. Senior Frontend Developer" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job-type">Job Type</Label>
                  <Select>
                    <SelectTrigger id="job-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. San Francisco, CA or Remote" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary-range">Salary Range</Label>
                  <Input id="salary-range" placeholder="e.g. $100,000 - $130,000" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Enter detailed job description..." 
                  className="h-32 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="List job requirements and qualifications..." 
                  className="h-24 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea 
                  id="benefits" 
                  placeholder="Describe benefits and perks..." 
                  className="h-24 resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewJobDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewJobDialog(false)}>
                Post Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Recruitment;
