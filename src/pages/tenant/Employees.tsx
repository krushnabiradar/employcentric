
import { useState, useEffect } from "react";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { employeeApi, Employee } from "@/api/employeeApi";

// Refactored components
import EmployeeTable from "@/components/employees/EmployeeTable";
import AddEmployeeDialog from "@/components/employees/AddEmployeeDialog";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeActions from "@/components/employees/EmployeeActions";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeApi.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(e => e.department)));

  return (
<>
      <div className="space-y-6 p-6">
        <EmployeeActions onAddEmployee={() => setShowAddDialog(true)} />

        <EmployeeFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          departments={departments}
        />

        <Card>
          <CardContent className="p-0">
            <EmployeeTable
              employees={employees}
              isLoading={isLoading}
              searchQuery={searchQuery}
              selectedDepartment={selectedDepartment}
            />
          </CardContent>
        </Card>
      </div>
      
      <AddEmployeeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onEmployeeAdded={fetchEmployees}
      />
</>
  );
};

export default Employees;
