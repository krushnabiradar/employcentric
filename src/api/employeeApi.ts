
import api from './api';
import { User } from '@/contexts/AuthContext';

export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
  company?: string;
  phone?: string;
  avatar?: string;
  user?: {
    _id: string;
    email: string;
    role: string;
    isApproved: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const employeeApi = {
  // Get all employees
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data.data;
  },

  // Get a single employee
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  // Create a new employee
  createEmployee: async (employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.post('/employees', employeeData);
    return response.data.data;
  },

  // Update an employee
  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data.data;
  },

  // Delete an employee
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  }
};
