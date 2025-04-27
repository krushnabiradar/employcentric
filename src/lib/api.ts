import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tenant API
export const tenantApi = {
  // Get all tenants
  getTenants: async () => {
    const response = await api.get('/tenants');
    return response.data;
  },

  // Get tenant by ID
  getTenantById: async (id: string) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  // Create new tenant
  createTenant: async (data: any) => {
    const response = await api.post('/tenants', data);
    return response.data;
  },

  // Update tenant
  updateTenant: async (id: string, data: any) => {
    const response = await api.put(`/tenants/${id}`, data);
    return response.data;
  },

  // Delete tenant
  deleteTenant: async (id: string) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  },

  // Activate tenant
  activateTenant: async (id: string) => {
    const response = await api.patch(`/tenants/${id}/activate`);
    return response.data;
  },

  // Suspend tenant
  suspendTenant: async (id: string) => {
    const response = await api.patch(`/tenants/${id}/suspend`);
    return response.data;
  },

  // Get pending tenant requests
  getPendingTenantRequests: async () => {
    const response = await api.get('/tenants/pending');
    return response.data;
  },

  // Approve tenant request
  approveTenantRequest: async (id: string) => {
    const response = await api.post('/tenants/approve', { id });
    return response.data;
  },

  // Reject tenant request
  rejectTenantRequest: async (id: string, reason: string) => {
    const response = await api.post('/tenants/reject', { id, reason });
    return response.data;
  },

  // Get tenant users
  getTenantUsers: async (id: string) => {
    const response = await api.get(`/tenants/${id}/users`);
    return response.data;
  },

  // Add tenant user
  addTenantUser: async (id: string, userData: any) => {
    const response = await api.post(`/tenants/${id}/users`, userData);
    return response.data;
  },
};

// System API
export const systemApi = {
  // Get system stats
  getSystemStats: async () => {
    const response = await api.get('/system/stats');
    return response.data;
  },

  // Get system alerts
  getSystemAlerts: async () => {
    const response = await api.get('/system/alerts');
    return response.data;
  },

  // Get tenant growth data
  getTenantGrowth: async () => {
    const response = await api.get('/system/tenant-growth');
    return response.data;
  },

  // Get system usage data
  getSystemUsage: async () => {
    const response = await api.get('/system/usage');
    return response.data;
  },
};

// Employee API
export const employeeApi = {
  // Get all employees
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (data: any) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, data: any) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get employee stats
  getEmployeeStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },
};

// Attendance API
export const attendanceApi = {
  // Get attendance records
  getAttendance: async (params: any) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  // Mark attendance
  markAttendance: async (data: any) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (id: string, data: any) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  // Get attendance stats
  getAttendanceStats: async () => {
    const response = await api.get('/attendance/stats');
    return response.data;
  },
};

// Leave Management API
export const leaveApi = {
  // Get leave requests
  getLeaveRequests: async () => {
    const response = await api.get('/leave/requests');
    return response.data;
  },

  // Create leave request
  createLeaveRequest: async (data: any) => {
    const response = await api.post('/leave/requests', data);
    return response.data;
  },

  // Approve leave request
  approveLeaveRequest: async (id: string) => {
    const response = await api.patch(`/leave/requests/${id}/approve`);
    return response.data;
  },

  // Reject leave request
  rejectLeaveRequest: async (id: string, reason: string) => {
    const response = await api.patch(`/leave/requests/${id}/reject`, { reason });
    return response.data;
  },

  // Get leave balance
  getLeaveBalance: async () => {
    const response = await api.get('/leave/balance');
    return response.data;
  },
};

// Payroll API
export const payrollApi = {
  // Get payroll records
  getPayrollRecords: async () => {
    const response = await api.get('/payroll/records');
    return response.data;
  },

  // Generate payroll
  generatePayroll: async (data: any) => {
    const response = await api.post('/payroll/generate', data);
    return response.data;
  },

  // Get payroll summary
  getPayrollSummary: async () => {
    const response = await api.get('/payroll/summary');
    return response.data;
  },

  // Get tax calculations
  getTaxCalculations: async () => {
    const response = await api.get('/payroll/tax-calculations');
    return response.data;
  },
};

// Recruitment API
export const recruitmentApi = {
  // Get job postings
  getJobPostings: async () => {
    const response = await api.get('/recruitment/jobs');
    return response.data;
  },

  // Create job posting
  createJobPosting: async (data: any) => {
    const response = await api.post('/recruitment/jobs', data);
    return response.data;
  },

  // Get applications
  getApplications: async () => {
    const response = await api.get('/recruitment/applications');
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (id: string, status: string) => {
    const response = await api.patch(`/recruitment/applications/${id}/status`, { status });
    return response.data;
  },

  // Get recruitment stats
  getRecruitmentStats: async () => {
    const response = await api.get('/recruitment/stats');
    return response.data;
  },
};

export default api; 