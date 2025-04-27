
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Power, PowerOff, UserPlus, Settings } from "lucide-react";
import { Tenant } from "@/api/tenantApi";

interface TenantActionMenuProps {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
  onSuspend: (id: string) => Promise<void>;
  onManageUsers: (id: string) => void;
  onManageSettings: (id: string) => void;
}

export function TenantActionMenu({
  tenant,
  onEdit,
  onDelete,
  onActivate,
  onSuspend,
  onManageUsers,
  onManageSettings,
}: TenantActionMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"activate" | "suspend">("activate");

  const handleStatusChange = async () => {
    try {
      if (statusAction === "activate") {
        await onActivate(tenant.id);
      } else {
        await onSuspend(tenant.id);
      }
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Error changing tenant status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(tenant.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Tenant Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onEdit(tenant)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Tenant
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onManageUsers(tenant.id)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Manage Users
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onManageSettings(tenant.id)}>
            <Settings className="mr-2 h-4 w-4" />
            Tenant Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {tenant.status === "Suspended" ? (
            <DropdownMenuItem 
              onClick={() => {
                setStatusAction("activate");
                setIsStatusDialogOpen(true);
              }}
            >
              <Power className="mr-2 h-4 w-4 text-green-500" />
              Activate Tenant
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => {
                setStatusAction("suspend");
                setIsStatusDialogOpen(true);
              }}
            >
              <PowerOff className="mr-2 h-4 w-4 text-yellow-500" />
              Suspend Tenant
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Tenant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tenant 
              <span className="font-semibold"> {tenant.name} </span> 
              and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusAction === "activate" ? "Activate Tenant" : "Suspend Tenant"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusAction === "activate" 
                ? `This will re-enable access for "${tenant.name}" and all their users.`
                : `This will disable access for "${tenant.name}" and all their users.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {statusAction === "activate" ? "Activate" : "Suspend"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
