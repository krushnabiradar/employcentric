import api from './api';

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTenants: number;
  activeTenants: number;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface TenantGrowth {
  period: string;
  count: number;
  growth: number;
}

export interface SystemUsage {
  cpu: {
    current: number;
    history: { timestamp: string; value: number; }[];
  };
  memory: {
    total: number;
    used: number;
    history: { timestamp: string; value: number; }[];
  };
  disk: {
    total: number;
    used: number;
    history: { timestamp: string; value: number; }[];
  };
}

export const systemApi = {
  // Get system statistics
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await api.get('/system/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch system stats:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch system stats');
    }
  },

  async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      const response = await api.get('/system/alerts');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch system alerts:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch system alerts');
    }
  },

  async getTenantGrowth(): Promise<TenantGrowth[]> {
    try {
      const response = await api.get('/system/tenant-growth');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch tenant growth:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch tenant growth data');
    }
  },

  async getSystemUsage(): Promise<SystemUsage> {
    try {
      const response = await api.get('/system/usage');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch system usage:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch system usage data');
    }
  }
};

export default systemApi;
