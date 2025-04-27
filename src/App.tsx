import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages - Public
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import PlanComparison from "./pages/PlanComparison";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Settings from "./pages/settings/Settings";

// Pages - Tenant
import Attendance from "./pages/tenant/Attendance";
import Dashboard from "./pages/tenant/Dashboard";
import Employees from "./pages/tenant/Employees";
import Leave from "./pages/tenant/Leave";
import Payroll from "./pages/tenant/Payroll";
import Recruitment from "./pages/tenant/Recruitment";

// Pages - SuperAdmin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SystemSettings from "./pages/superadmin/SystemSettings";
import TenantApprovals from "./pages/superadmin/TenantApprovals";
import Tenants from "./pages/superadmin/Tenants";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/plans" element={<PlanComparison />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Settings Route - Accessible to all authenticated users */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "hr", "manager", "employee"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Settings />} />
                </Route>

                {/* Superadmin Routes */}
                <Route
                  path="/superadmin"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<SuperAdminDashboard />} />
                  <Route path="tenants" element={<Tenants />} />
                  <Route path="approvals" element={<TenantApprovals />} />
                  <Route path="system-settings" element={<SystemSettings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Tenant Routes */}
                <Route
                  path="/tenant"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "hr", "manager", "employee"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="leave" element={<Leave />} />
                  <Route path="payroll" element={<Payroll />} />
                  <Route path="recruitment" element={<Recruitment />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};


export default App;
