import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, UserCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Desktop Sidebar - Full Height */}
      <div className="hidden lg:block w-64 bg-background border-r fixed h-screen">
        {/* Logo Section */}
        <div className="h-16 border-b flex items-center px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              EmployCentric
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-16 border-b flex items-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">
                EmployCentric
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3 h-[calc(100vh-4rem)]">
            <div className="space-y-1">
              <Sidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 overflow-hidden">
        <Header onSidebarToggle={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 