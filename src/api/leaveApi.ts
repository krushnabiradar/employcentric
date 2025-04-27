
import api from './api';

export interface LeaveRequest {
  _id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const leaveApi = {
  // Get all leaves
  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leaves');
    return response.data;
  },

  // Create new leave request
  createLeave: async (leaveData: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
  }): Promise<LeaveRequest> => {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  },

  // Approve leave request
  approveLeave: async (id: string): Promise<LeaveRequest> => {
    const response = await api.put(`/leaves/${id}/approve`);
    return response.data;
  },

  // Reject leave request
  rejectLeave: async (id: string, reason: string): Promise<LeaveRequest> => {
    const response = await api.put(`/leaves/${id}/reject`, { reason });
    return response.data;
  }
};
