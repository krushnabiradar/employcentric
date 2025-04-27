
import { useState } from "react";
import { Employee } from "@/api/employeeApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  searchQuery: string;
  selectedDepartment: string;
}

const EmployeeTable = ({
  employees,
  isLoading,
  searchQuery,
  selectedDepartment,
}: EmployeeTableProps) => {
  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || 
                             employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              <div className="flex justify-center items-center">
                <div className="h-8 w-8 border-2 border-current border-r-transparent animate-spin rounded-full"></div>
              </div>
            </TableCell>
          </TableRow>
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>
                      {employee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{employee.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {employee.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : employee.status === "On Leave"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {employee.status}
                </div>
              </TableCell>
              <TableCell>
                {new Date(employee.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Change Department</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Deactivate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No employees found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
