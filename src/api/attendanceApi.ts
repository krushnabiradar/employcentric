
import api from './api';

export interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'leave';
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  todayPresent: number;
  todayAbsent: number;
  monthlyStats: {
    present: number;
    absent: number;
    leave: number;
  };
}

export const attendanceApi = {
  // Get today's attendance
  getTodayAttendance: async (tenantId: string): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get(`/attendance/today?tenantId=${tenantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
      throw error;
    }
  },

  // Get monthly attendance for a specific employee
  getMonthlyAttendance: async (employeeId: string, tenantId: string, date?: Date): Promise<AttendanceRecord[]> => {
    try {
      const dateParam = date ? `date=${date.toISOString()}&` : '';
      const response = await api.get(`/attendance/${employeeId}?${dateParam}tenantId=${tenantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch monthly attendance:', error);
      throw error;
    }
  },

  // Check in
  checkIn: async (employeeId: string, tenantId: string): Promise<AttendanceRecord> => {
    const response = await api.post('/attendance/check-in', { employeeId, tenantId });
    return response.data.data;
  },

  // Check out
  checkOut: async (employeeId: string, tenantId: string): Promise<AttendanceRecord> => {
    const response = await api.post('/attendance/check-out', { employeeId, tenantId });
    return response.data.data;
  },

  // Get attendance stats
  getAttendanceStats: async (tenantId: string, date?: Date): Promise<AttendanceStats> => {
    try {
      const dateParam = date ? `date=${date.toISOString()}&` : '';
      const response = await api.get(`/attendance/stats?${dateParam}tenantId=${tenantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
      throw error;
    }
  }
};
