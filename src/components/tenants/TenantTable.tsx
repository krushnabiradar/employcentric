import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TenantActionMenu } from "@/components/tenants/TenantActionMenu";
import { Tenant } from "@/api/tenantApi";
import { cn } from "@/lib/utils";

interface TenantTableProps {
  tenants: Tenant[];
  filteredTenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
  onSuspend: (id: string) => Promise<void>;
  onManageUsers: (id: string) => void;
  onManageSettings: (id: string) => void;
}

export const TenantTable = ({
  tenants,
  filteredTenants,
  onEdit,
  onDelete,
  onActivate,
  onSuspend,
  onManageUsers,
  onManageSettings
}: TenantTableProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>All Tenants</CardTitle>
        <CardDescription>Organizations registered on your platform</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Name</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[80px]">Users</TableHead>
                  <TableHead className="w-[100px]">Plan</TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="w-[100px]">Created</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow 
                    key={tenant.id} 
                    className="cursor-pointer" 
                    onClick={() => navigate(`/tenant-details/${tenant.id}`)}
                  >
                    <TableCell className="font-medium truncate max-w-[180px]">{tenant.name}</TableCell>
                    <TableCell className="truncate max-w-[180px]">{tenant.email}</TableCell>
                    <TableCell className="text-center">{tenant.users}</TableCell>
                    <TableCell className="max-w-[100px]">
                      <Badge variant={
                        tenant.plan === "Enterprise" 
                          ? "default" 
                          : tenant.plan === "Professional" 
                            ? "outline" 
                            : "secondary"
                      }>
                        {tenant.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[90px]">
                      <Badge className={`${
                        tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="truncate max-w-[100px]">{tenant.createdAt}</TableCell>
                    <TableCell className="text-right max-w-[80px]" onClick={(e) => e.stopPropagation()}>
                      <TenantActionMenu 
                        tenant={tenant}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onActivate={onActivate}
                        onSuspend={onSuspend}
                        onManageUsers={onManageUsers}
                        onManageSettings={onManageSettings}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-2">
          {filteredTenants.map((tenant) => (
            <Card 
              key={tenant.id}
              className="cursor-pointer border-0 shadow-none"
              onClick={() => navigate(`/tenant-details/${tenant.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-medium truncate">{tenant.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{tenant.email}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge className={`${
                      tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tenant.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="font-medium">{tenant.users}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge variant={
                      tenant.plan === "Enterprise" 
                        ? "default" 
                        : tenant.plan === "Professional" 
                          ? "outline" 
                          : "secondary"
                    }>
                      {tenant.plan}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm truncate">{tenant.createdAt}</p>
                </div>
                <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <TenantActionMenu 
                    tenant={tenant}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onActivate={onActivate}
                    onSuspend={onSuspend}
                    onManageUsers={onManageUsers}
                    onManageSettings={onManageSettings}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t px-4 sm:px-6 py-4 gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredTenants.length}</strong> of <strong>{tenants.length}</strong> tenants
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
