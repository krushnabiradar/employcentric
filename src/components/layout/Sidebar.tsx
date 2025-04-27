import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Building,
  Calendar,
  Clock,
  CreditCard,
  LayoutDashboard,
  Server as ServerIcon,
  Settings,
  UserCheck,
  UserCircle,
  UserPlus,
  UserRound,
  Users
} from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  roles?: string[];
}

const superAdminNavItems: NavItem[] = [
  {
    label: "System Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/superadmin",
  },
  {
    label: "Tenant Management",
    icon: <Building className="h-5 w-5" />,
    href: "/superadmin/tenants",
  },
  {
    label: "Tenant Approvals",
    icon: <UserCheck className="h-5 w-5" />,
    href: "/superadmin/approvals",
  },
  {
    label: "System Settings",
    icon: <ServerIcon className="h-5 w-5" />,
    href: "/superadmin/system-settings",
  },
  {
    label: "User Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
  {
    label: "Profile",
    icon: <UserCircle className="h-5 w-5" />,
    href: "/superadmin/profile",
  },
];

const tenantNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/tenant/dashboard",
    roles: ["admin", "hr", "manager", "employee"],
  },
  {
    label: "Employees",
    icon: <Users className="h-5 w-5" />,
    href: "/tenant/employees",
    roles: ["admin", "hr", "manager"],
  },
  {
    label: "Attendance",
    icon: <Clock className="h-5 w-5" />,
    href: "/tenant/attendance",
    roles: ["admin", "hr", "manager", "employee"],
  },
  {
    label: "Leave Management",
    icon: <Calendar className="h-5 w-5" />,
    href: "/tenant/leave",
    roles: ["admin", "hr", "manager", "employee"],
  },
  {
    label: "Payroll",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/tenant/payroll",
    roles: ["admin", "hr"],
  },
  {
    label: "Recruitment",
    icon: <UserPlus className="h-5 w-5" />,
    href: "/tenant/recruitment",
    roles: ["admin", "hr"],
  },
  {
    label: "Profile",
    icon: <UserRound className="h-5 w-5" />,
    href: "/tenant/profile",
    roles: ["admin", "hr", "manager", "employee"],
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
    roles: ["admin", "hr", "manager", "employee"],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const getFilteredNavItems = (items: NavItem[]) => {
    if (!user?.role) return items;
    return items.filter(item => 
      !item.roles || item.roles.includes(user.role)
    );
  };

  const navItems = user?.role === "superadmin" 
    ? superAdminNavItems 
    : getFilteredNavItems(tenantNavItems);

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "text-base sm:text-sm",
            location.pathname === item.href
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
} 