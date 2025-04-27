import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              EmployCentric
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
