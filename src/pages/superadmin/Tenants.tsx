import { useState, useEffect } from "react";
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
import { tenantApi } from "@/lib/api";

interface Tenant {
  id: string;
  name: string;
  company: string;
  email: string;
  users: number;
  plan: string;
  status: string;
  createdAt: string;
}

const TenantsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tenantsData, pendingRequests] = await Promise.all([
          tenantApi.getTenants(),
          tenantApi.getPendingTenantRequests()
        ]);
        setTenants(tenantsData);
        setFilteredTenants(tenantsData);
        setPendingApprovals(pendingRequests.length);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast({
          title: "Error",
          description: "Failed to load tenants",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle creating a new tenant
  const handleCreateTenant = async (data: TenantFormData) => {
    try {
      const newTenant = await tenantApi.createTenant(data);
      setTenants([...tenants, newTenant]);
      setFilteredTenants([...filteredTenants, newTenant]);
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
    navigate(`/tenant-details/${tenant.id}`);
  };

  // Handle tenant deletion
  const handleDeleteTenant = async (id: string) => {
    try {
      await tenantApi.deleteTenant(id);
      setTenants(tenants.filter(t => t.id !== id));
      setFilteredTenants(filteredTenants.filter(t => t.id !== id));
      toast({
        title: "Tenant Deleted",
        description: "Tenant has been successfully deleted",
      });
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
      await tenantApi.activateTenant(id);
      setTenants(tenants.map(t => 
        t.id === id ? { ...t, status: "Active" } : t
      ));
      setFilteredTenants(filteredTenants.map(t => 
        t.id === id ? { ...t, status: "Active" } : t
      ));
      toast({
        title: "Tenant Activated",
        description: "Tenant has been successfully activated",
      });
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
      await tenantApi.suspendTenant(id);
      setTenants(tenants.map(t => 
        t.id === id ? { ...t, status: "Suspended" } : t
      ));
      setFilteredTenants(filteredTenants.map(t => 
        t.id === id ? { ...t, status: "Suspended" } : t
      ));
      toast({
        title: "Tenant Suspended",
        description: "Tenant has been suspended",
      });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Stats calculations
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === "Active").length;
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
