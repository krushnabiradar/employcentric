
import api from './api';

export interface PayrollRecord {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    avatar?: string;
  };
  payPeriod: string;
  payDate: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'paid' | 'processing' | 'pending';
  details: {
    basicSalary: number;
    overtime: number;
    bonus: number;
    incomeTax: number;
    socialSecurity: number;
    healthInsurance: number;
    workingDays: number;
    overtimeHours: number;
  };
  bankAccount: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollStats {
  totalPayroll: number;
  percentChange: number;
  averageSalary: number;
  employeeCount: number;
  nextPayrollDate: string;
}

export const payrollApi = {
  // Get all payrolls
  getAllPayrolls: async (): Promise<PayrollRecord[]> => {
    const response = await api.get('/payroll');
    return response.data.data;
  },

  // Get payrolls by period
  getPayrollsByPeriod: async (period: string): Promise<PayrollRecord[]> => {
    const response = await api.get(`/payroll/period/${period}`);
    return response.data.data;
  },

  // Get a single payroll
  getPayroll: async (id: string): Promise<PayrollRecord> => {
    const response = await api.get(`/payroll/${id}`);
    return response.data.data;
  },

  // Create a new payroll
  createPayroll: async (payrollData: Partial<PayrollRecord>): Promise<PayrollRecord> => {
    const response = await api.post('/payroll', payrollData);
    return response.data.data;
  },

  // Update a payroll
  updatePayroll: async (id: string, payrollData: Partial<PayrollRecord>): Promise<PayrollRecord> => {
    const response = await api.put(`/payroll/${id}`, payrollData);
    return response.data.data;
  },

  // Get payroll summary statistics
  getPayrollStats: async (): Promise<PayrollStats> => {
    const response = await api.get('/payroll/stats');
    return response.data.data;
  }
};
