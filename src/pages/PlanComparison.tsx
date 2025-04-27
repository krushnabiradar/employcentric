import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubscriptionComparisonTable from '@/components/pricing/SubscriptionComparisonTable';

const PlanComparison = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">Compare Plans</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Choose the plan that best fits your business needs. All plans include our core HR management features, with additional capabilities as you scale.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-12">
          <SubscriptionComparisonTable />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button asChild variant="outline" className="min-w-[200px]">
            <Link to="/register?plan=starter">Start with Starter</Link>
          </Button>
          <Button asChild className="min-w-[200px]">
            <Link to="/register?plan=professional">Choose Professional</Link>
          </Button>
          <Button asChild variant="secondary" className="min-w-[200px]">
            <Link to="/contact?subject=Enterprise">Contact Sales for Enterprise</Link>
          </Button>
        </div>
      </div>

      <div className="bg-muted mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold">Still not sure which plan is right for you?</h2>
            <p className="mt-4 text-muted-foreground">
              Our team is ready to help you choose the best solution for your business needs.
              Schedule a free consultation call with our experts.
            </p>
            <Button className="mt-6">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparison;
