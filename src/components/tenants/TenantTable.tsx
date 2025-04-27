
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
    <Card>
      <CardHeader>
        <CardTitle>All Tenants</CardTitle>
        <CardDescription>Organizations registered on your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow 
                key={tenant.id} 
                className="cursor-pointer" 
                onClick={() => navigate(`/tenant-details/${tenant.id}`)}
              >
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.users}</TableCell>
                <TableCell>
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
                <TableCell>
                  <Badge className={`${
                    tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.createdAt}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-6 py-4">
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
