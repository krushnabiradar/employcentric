
import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface FeatureItem {
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

const features: FeatureItem[] = [
  {
    name: "Employee Management",
    starter: true,
    professional: true,
    enterprise: true
  },
  {
    name: "Attendance Tracking",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Advanced"
  },
  {
    name: "Leave Management",
    starter: true,
    professional: true,
    enterprise: true
  },
  {
    name: "Payroll Processing",
    starter: false,
    professional: true,
    enterprise: true
  },
  {
    name: "Recruitment Tools",
    starter: false,
    professional: "Basic",
    enterprise: "Advanced"
  },
  {
    name: "Custom Integrations",
    starter: false,
    professional: false,
    enterprise: true
  },
  {
    name: "Analytics Dashboard",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Premium"
  },
  {
    name: "API Access",
    starter: false,
    professional: "Limited",
    enterprise: "Full"
  },
  {
    name: "Priority Support",
    starter: false,
    professional: "Email",
    enterprise: "24/7 Phone & Email"
  },
  {
    name: "Maximum Employees",
    starter: "25",
    professional: "100",
    enterprise: "Unlimited"
  },
];

const SubscriptionComparisonTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-foreground sm:pl-6">Features</th>
            <th className="py-3.5 px-4 text-center text-sm font-semibold text-foreground">Starter</th>
            <th className="py-3.5 px-4 text-center text-sm font-semibold text-foreground bg-primary/5">Professional</th>
            <th className="py-3.5 px-4 text-center text-sm font-semibold text-foreground">Enterprise</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {features.map((feature, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
              <td className="py-4 px-4 text-sm sm:pl-6">{feature.name}</td>
              <td className="py-4 px-4 text-center">
                {renderFeatureValue(feature.starter)}
              </td>
              <td className="py-4 px-4 text-center bg-primary/5">
                {renderFeatureValue(feature.professional)}
              </td>
              <td className="py-4 px-4 text-center">
                {renderFeatureValue(feature.enterprise)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to render feature values
const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === 'boolean') {
    return value ? 
      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : 
      <X className="h-5 w-5 text-muted-foreground mx-auto" />;
  }
  return <span>{value}</span>;
};

export default SubscriptionComparisonTable;
