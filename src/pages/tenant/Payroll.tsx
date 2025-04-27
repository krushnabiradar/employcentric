
import { useState, useEffect } from "react";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  Filter,
  Mail,
  FileText,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payrollApi, PayrollRecord, PayrollStats } from "@/api/payrollApi";

const Payroll = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [payrollStats, setPayrollStats] = useState<PayrollStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchPayrollData();
    fetchPayrollStats();
  }, []);

  const fetchPayrollData = async () => {
    try {
      setIsLoading(true);
      let data;
      
      if (selectedPeriod !== "all") {
        data = await payrollApi.getPayrollsByPeriod(selectedPeriod);
      } else {
        data = await payrollApi.getAllPayrolls();
      }
      
      setPayrollRecords(data);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
      toast({
        title: "Error",
        description: "Failed to load payroll data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayrollStats = async () => {
    try {
      const data = await payrollApi.getPayrollStats();
      setPayrollStats(data);
    } catch (error) {
      console.error("Failed to fetch payroll stats:", error);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [selectedPeriod]);
  
  // Filter payroll data based on search
  const filteredPayroll = payrollRecords.filter((item) => {
    return item.employeeId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item._id.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get unique pay periods for filter
  const payPeriods = Array.from(new Set(payrollRecords.map(item => item.payPeriod)));
  
  // Handler for payslip generation
  const handleGeneratePayslips = () => {
    toast({
      title: "Generating Payslips",
      description: "Payslips are being generated for all employees.",
    });
  };
  
  // Handler for sending payslips
  const handleSendPayslips = () => {
    toast({
      title: "Sending Payslips",
      description: "Payslips are being sent to employees via email.",
    });
  };
  
  // Handler for downloading a payslip
  const handleDownloadPayslip = (id: string) => {
    toast({
      title: "Downloading Payslip",
      description: `Payslip ${id} is being downloaded.`,
    });
  };

  return (
 
      <div className="space-y-6 p-6 ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
            <p className="text-muted-foreground">
              Manage employee compensation and payslips
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGeneratePayslips}>
              Generate Payslips
            </Button>
            <Button onClick={handleSendPayslips}>
              <Mail className="mr-2 h-4 w-4" />
              Send Payslips
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payroll (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payrollStats?.totalPayroll.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {payrollStats && payrollStats.percentChange > 0 ? '+' : ''}
                {payrollStats?.percentChange.toFixed(1) || '0.0'}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payrollStats?.averageSalary.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {payrollStats?.employeeCount || 0} employees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Next Payroll Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payrollStats?.nextPayrollDate 
                  ? format(new Date(payrollStats.nextPayrollDate), "MMMM d, yyyy")
                  : "Not scheduled"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {payrollStats?.nextPayrollDate 
                  ? `${Math.ceil((new Date(payrollStats.nextPayrollDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} working days remaining`
                  : "No payroll scheduled"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-end w-full">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payroll..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-full sm:w-[180px] flex gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Pay Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {payPeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="payrolls" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-[400px]">
            <TabsTrigger value="payrolls">Payroll History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payrolls" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="h-8 w-8 border-2 border-current border-r-transparent animate-spin rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Pay Period</TableHead>
                        <TableHead>Pay Date</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayroll.length > 0 ? (
                        filteredPayroll.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium">{item._id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.employeeId.avatar} />
                                  <AvatarFallback>
                                    {item.employeeId.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div>{item.employeeId.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.employeeId.position}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.payPeriod}</TableCell>
                            <TableCell>{format(new Date(item.payDate), "PP")}</TableCell>
                            <TableCell>${item.grossPay.toFixed(2)}</TableCell>
                            <TableCell>${item.netPay.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${item.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : ""}
                                  ${item.status === "processing" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                                  ${item.status === "pending" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
                                `}
                              >
                                {item.status === "paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                {item.status === "processing" && <Clock className="mr-1 h-3 w-3" />}
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Payslip
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                      <DialogHeader>
                                        <DialogTitle>Payslip Details</DialogTitle>
                                        <DialogDescription>
                                          Payslip for {item.employeeId.name} - {item.payPeriod}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-6 py-4">
                                        {/* Employee info */}
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                              <AvatarImage src={item.employeeId.avatar} />
                                              <AvatarFallback>
                                                {item.employeeId.name.split(" ").map((n) => n[0]).join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="font-medium">{item.employeeId.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {item.employeeId.position} - {item.employeeId.department}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <Badge
                                              variant="outline"
                                              className={`
                                                ${item.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : ""}
                                                ${item.status === "processing" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                                                ${item.status === "pending" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
                                              `}
                                            >
                                              {item.status === "paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                              {item.status === "processing" && <Clock className="mr-1 h-3 w-3" />}
                                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Badge>
                                            <div className="text-sm mt-1 text-muted-foreground">ID: {item._id}</div>
                                          </div>
                                        </div>
                                        
                                        {/* Payslip header */}
                                        <div className="grid grid-cols-2 gap-4 py-4 border-y">
                                          <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="text-sm text-muted-foreground">Pay Period</div>
                                              <div className="font-medium">{item.payPeriod}</div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="text-sm text-muted-foreground">Pay Date</div>
                                              <div className="font-medium">{format(new Date(item.payDate), "PP")}</div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="text-sm text-muted-foreground">Bank Account</div>
                                              <div className="font-medium">{item.bankAccount}</div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="text-sm text-muted-foreground">Working Days</div>
                                              <div className="font-medium">{item.details.workingDays} days ({item.details.overtimeHours} hrs overtime)</div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Payslip details */}
                                        <div className="grid grid-cols-2 gap-6">
                                          {/* Earnings */}
                                          <div>
                                            <h4 className="font-medium mb-3">Earnings</h4>
                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <span className="text-sm">Basic Salary</span>
                                                <span className="text-sm font-medium">${item.details.basicSalary.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-sm">Overtime</span>
                                                <span className="text-sm font-medium">${item.details.overtime.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-sm">Bonus</span>
                                                <span className="text-sm font-medium">${item.details.bonus.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between pt-2 border-t">
                                                <span className="font-medium">Gross Pay</span>
                                                <span className="font-medium">${item.grossPay.toFixed(2)}</span>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* Deductions */}
                                          <div>
                                            <h4 className="font-medium mb-3">Deductions</h4>
                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <span className="text-sm">Income Tax</span>
                                                <span className="text-sm font-medium">${item.details.incomeTax.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-sm">Social Security</span>
                                                <span className="text-sm font-medium">${item.details.socialSecurity.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-sm">Health Insurance</span>
                                                <span className="text-sm font-medium">${item.details.healthInsurance.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between pt-2 border-t">
                                                <span className="font-medium">Total Deductions</span>
                                                <span className="font-medium">${item.deductions.toFixed(2)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Net pay */}
                                        <div className="bg-muted p-4 rounded-lg">
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">Net Pay</span>
                                            <span className="text-xl font-bold">${item.netPay.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter className="gap-2">
                                        <Button variant="outline">Send via Email</Button>
                                        <Button onClick={() => handleDownloadPayslip(item._id)}>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download PDF
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <DropdownMenuItem onClick={() => handleDownloadPayslip(item._id)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No payroll records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Settings</CardTitle>
                <CardDescription>
                  Configure your payroll processing settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger id="paymentFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDay">Default Payment Day</Label>
                      <Select defaultValue="28">
                        <SelectTrigger id="paymentDay">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15th</SelectItem>
                          <SelectItem value="28">28th</SelectItem>
                          <SelectItem value="lastDay">Last day of month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxYear">Tax Year</Label>
                      <Select defaultValue="2023">
                        <SelectTrigger id="taxYear">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">GBP - British Pound</SelectItem>
                          <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Tax Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxCalculation">Tax Calculation Method</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="taxCalculation">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="progressive">Progressive</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxFilingStatus">Default Filing Status</Label>
                      <Select defaultValue="single">
                        <SelectTrigger id="taxFilingStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Deductions & Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="healthInsurance">Health Insurance</Label>
                      <Input id="healthInsurance" type="number" defaultValue="180" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retirement">Retirement Plan</Label>
                      <Input id="retirement" type="number" defaultValue="250" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
 
  );
};

export default Payroll;
