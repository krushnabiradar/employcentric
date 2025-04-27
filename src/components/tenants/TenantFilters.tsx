
import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TenantFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filter: string, value: string) => void;
}

const plans = [
  { label: "All Plans", value: "all" },
  { label: "Basic", value: "basic" },
  { label: "Professional", value: "professional" },
  { label: "Enterprise", value: "enterprise" },
];

const statuses = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Pending", value: "pending" },
];

export function TenantFilters({ onSearch, onFilterChange }: TenantFiltersProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [planOpen, setPlanOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(plans[0]);
  const [selectedStatus, setSelectedStatus] = React.useState(statuses[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setPlanOpen(false);
    onFilterChange("plan", plan.value);
  };

  const handleStatusSelect = (status: typeof statuses[0]) => {
    setSelectedStatus(status);
    setStatusOpen(false);
    onFilterChange("status", status.value);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
      <form 
        onSubmit={handleSearch} 
        className="flex-1 md:max-w-sm"
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Popover open={planOpen} onOpenChange={setPlanOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={planOpen}
              className="justify-between"
            >
              {selectedPlan.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search plan..." />
              <CommandEmpty>No plan found.</CommandEmpty>
              <CommandGroup>
                {plans.map((plan) => (
                  <CommandItem
                    key={plan.value}
                    onSelect={() => handlePlanSelect(plan)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPlan.value === plan.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {plan.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={statusOpen}
              className="justify-between"
            >
              {selectedStatus.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search status..." />
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={() => handleStatusSelect(status)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStatus.value === status.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Button variant="outline">Export</Button>
      </div>
    </div>
  );
}
