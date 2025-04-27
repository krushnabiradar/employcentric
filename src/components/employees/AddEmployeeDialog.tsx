
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { employeeApi } from "@/api/employeeApi";

const API_BASE_URL = "http://localhost:5000/api";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeDialog = ({
  open,
  onOpenChange,
  onEmployeeAdded,
}: AddEmployeeDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    role: 'employee', // Default role
  });

  // Function to generate random password
  const generateTemporaryPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      role: 'employee',
    });
  };

  const handleSubmit = async () => {
    try {
      const { firstName, lastName, role, ...rest } = formData;
      
      const fullName = `${firstName} ${lastName}`;
      const temporaryPassword = generateTemporaryPassword();
      
      // First create the user account with temporary password
      let userId;
      try {
        const userResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
          name: fullName,
          email: rest.email,
          password: temporaryPassword,
          role: role,
          company: "Your Company Name", // You could add a company field to the form
        }, { withCredentials: true });
        
        userId = userResponse.data.user.id;
        
        toast({
          title: "User Account Created",
          description: `Temporary password: ${temporaryPassword}`,
        });
      } catch (userError) {
        console.error("Error creating user account:", userError);
        toast({
          title: "User Creation Failed",
          description: "Failed to create user account. Employee creation aborted.",
          variant: "destructive",
        });
        return;
      }
      
      // Then create the employee with reference to the user
      if (userId) {
        const newEmployee = {
          name: fullName,
          ...rest,
          status: 'Active',
          joinDate: new Date().toISOString(),
          user: userId, // Add reference to the user account
        };

        await employeeApi.createEmployee(newEmployee);
        
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
        
        resetForm();
        onOpenChange(false);
        onEmployeeAdded();
      }
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to your organization. A user account will automatically be created.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Smith" 
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="john.smith@company.com" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.department}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                placeholder="Senior Developer" 
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="role">System Role</Label>
            <Select 
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              A user account will be created with a temporary password
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
