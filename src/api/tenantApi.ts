
import axios from 'axios';
import api from './api';

// Types for tenant data
export interface Tenant {
  id: string;
  name: string;
  company: string;
  plan: string;
  status: string;
  email: string;
  phone?: string;
  users: number;
  createdAt: string;
  address?: string;
  industry?: string;
}

// Types for tenant creation/update
export interface TenantFormData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  plan: string;
  address?: string;
  industry?: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

// Base API URL
const TENANTS_URL = "/tenants";

// Get all tenants
export const getTenants = async () => {
  const response = await api.get(TENANTS_URL);
  return response.data;
};

// Get tenant by ID
export const getTenantById = async (id: string) => {
  const response = await api.get(`${TENANTS_URL}/${id}`);
  return response.data;
};

// Create new tenant
export const createTenant = async (tenantData: TenantFormData) => {
  const response = await api.post(TENANTS_URL, tenantData);
  return response.data;
};

// Update tenant
export const updateTenant = async (id: string, tenantData: Partial<TenantFormData>) => {
  const response = await api.put(`${TENANTS_URL}/${id}`, tenantData);
  return response.data;
};

// Activate tenant
export const activateTenant = async (id: string) => {
  const response = await api.patch(`${TENANTS_URL}/${id}/activate`);
  return response.data;
};

// Suspend tenant
export const suspendTenant = async (id: string) => {
  const response = await api.patch(`${TENANTS_URL}/${id}/suspend`);
  return response.data;
};

// Delete tenant
export const deleteTenant = async (id: string) => {
  const response = await api.delete(`${TENANTS_URL}/${id}`);
  return response.data;
};
