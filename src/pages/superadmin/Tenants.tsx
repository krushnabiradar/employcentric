import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboardLayout from "@/components/layouts/superadmin/SuperAdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CheckCircle } from "lucide-react";
import { TenantForm } from "@/components/tenants/TenantForm";
import { TenantFilters } from "@/components/tenants/TenantFilters";
import { TenantStats } from "@/components/tenants/TenantStats";
import { TenantTable } from "@/components/tenants/TenantTable";
import { TenantFormData, Tenant } from "@/api/tenantApi";
import { useToast } from "@/components/ui/use-toast";

// Sample tenant data
const tenants = [
  { id: "t-1", name: "Acme Corporation", company: "Acme Inc.", email: "contact@acme.com", users: 125, plan: "Enterprise", status: "Active", createdAt: "2023-01-15" },
  { id: "t-2", name: "Globex Industries", company: "Globex Corp", email: "info@globex.com", users: 78, plan: "Professional", status: "Active", createdAt: "2023-02-20" },
  { id: "t-3", name: "Wayne Enterprises", company: "Wayne Corp", email: "contact@wayne.com", users: 203, plan: "Enterprise", status: "Active", createdAt: "2023-03-05" },
  { id: "t-4", name: "Stark Industries", company: "Stark Corp", email: "info@stark.com", users: 92, plan: "Professional", status: "Suspended", createdAt: "2023-03-18" },
  { id: "t-5", name: "Umbrella Corp", company: "Umbrella Inc", email: "contact@umbrella.com", users: 45, plan: "Basic", status: "Active", createdAt: "2023-04-02" },
];

const TenantsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filteredTenants, setFilteredTenants] = useState(tenants);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Handle creating a new tenant
  const handleCreateTenant = async (data: TenantFormData) => {
    try {
      console.log("Creating tenant with data:", data);
      // Here you would call the API to create the tenant
      // For now, we'll just simulate success
      toast({
        title: "Tenant Created",
        description: `Successfully created ${data.name}`,
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    }
  };
  
  // Handle tenant editing
  const handleEditTenant = (tenant: Tenant) => {
    console.log("Edit tenant:", tenant);
    navigate(`/tenant-details/${tenant.id}`);
  };
  
  // Handle tenant deletion
  const handleDeleteTenant = async (id: string) => {
    try {
      console.log("Deleting tenant:", id);
      // Here you would call the API to delete the tenant
      // For now, we'll just simulate success
      toast({
        title: "Tenant Deleted",
        description: "Tenant has been successfully deleted",
      });
      setFilteredTenants(filteredTenants.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    }
  };
  
  // Handle tenant activation
  const handleActivateTenant = async (id: string) => {
    try {
      console.log("Activating tenant:", id);
      // Here you would call the API to activate the tenant
      // For now, we'll just simulate success
      toast({
        title: "Tenant Activated",
        description: "Tenant has been successfully activated",
      });
      setFilteredTenants(filteredTenants.map(t => 
        t.id === id ? { ...t, status: "Active" } : t
      ));
    } catch (error) {
      console.error("Error activating tenant:", error);
      toast({
        title: "Error",
        description: "Failed to activate tenant",
        variant: "destructive",
      });
    }
  };
  
  // Handle tenant suspension
  const handleSuspendTenant = async (id: string) => {
    try {
      console.log("Suspending tenant:", id);
      // Here you would call the API to suspend the tenant
      // For now, we'll just simulate success
      toast({
        title: "Tenant Suspended",
        description: "Tenant has been suspended",
      });
      setFilteredTenants(filteredTenants.map(t => 
        t.id === id ? { ...t, status: "Suspended" } : t
      ));
    } catch (error) {
      console.error("Error suspending tenant:", error);
      toast({
        title: "Error",
        description: "Failed to suspend tenant",
        variant: "destructive",
      });
    }
  };
  
  // Handle tenant user management
  const handleManageUsers = (id: string) => {
    navigate(`/tenant-user-management/${id}`);
  };
  
  // Handle tenant settings
  const handleManageSettings = (id: string) => {
    navigate(`/tenant-settings/${id}`);
  };
  
  // Handle search and filters
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTenants(tenants);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter(tenant => 
      tenant.name.toLowerCase().includes(lowerQuery) ||
      tenant.company.toLowerCase().includes(lowerQuery) ||
      tenant.email.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredTenants(filtered);
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    if (value === "all") {
      setFilteredTenants(tenants);
      return;
    }
    
    let filtered;
    if (filter === "plan") {
      filtered = tenants.filter(tenant => 
        tenant.plan.toLowerCase() === value.toLowerCase()
      );
    } else if (filter === "status") {
      filtered = tenants.filter(tenant => 
        tenant.status.toLowerCase() === value.toLowerCase()
      );
    } else {
      filtered = tenants;
    }
    
    setFilteredTenants(filtered);
  };
  
  // Stats calculations
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === "Active").length;
  const pendingApprovals = 8; // Sample data
  const totalUsers = tenants.reduce((sum, tenant) => sum + tenant.users, 0);
  
  return (
    <div className="w-full max-w-full overflow-hidden space-y-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage all organizations using your HRMS platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => navigate('/tenant-approvals')}
          >
            <CheckCircle className="h-4 w-4" />
            Pending Approvals
            {pendingApprovals > 0 && (
              <Badge className="ml-1">{pendingApprovals}</Badge>
            )}
          </Button>
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Tenant
          </Button>
        </div>
      </div>

      <TenantFilters 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
      />

      <TenantStats 
        totalTenants={totalTenants}
        activeTenants={activeTenants}
        pendingApprovals={pendingApprovals}
        totalUsers={totalUsers}
      />
      
      <TenantTable 
        tenants={tenants}
        filteredTenants={filteredTenants}
        onEdit={handleEditTenant}
        onDelete={handleDeleteTenant}
        onActivate={handleActivateTenant}
        onSuspend={handleSuspendTenant}
        onManageUsers={handleManageUsers}
        onManageSettings={handleManageSettings}
      />
      
      {/* Tenant Creation Form */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTenant}
      />
    </div>
  );
};

export default TenantsPage;
