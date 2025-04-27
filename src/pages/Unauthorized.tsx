
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">Access Denied</h1>
        <p className="text-gray-600 mt-2 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/">Go to Homepage</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
