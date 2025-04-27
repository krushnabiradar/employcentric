import { useState } from "react";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

// Form schema for general settings
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

// Form schema for security settings
const securitySettingsSchema = z.object({
  mfaRequired: z.boolean().default(false),
  passwordRotation: z.number().int().min(0).max(365),
  sessionTimeout: z.number().int().min(5).max(1440),
  allowedIpRanges: z.string().optional(),
});

// Form schema for feature settings
const featureSettingsSchema = z.object({
  enableRecruiting: z.boolean().default(true),
  enablePayroll: z.boolean().default(true),
  enableAttendance: z.boolean().default(true),
  enableLeave: z.boolean().default(true),
  enablePerformance: z.boolean().default(false),
  enableTraining: z.boolean().default(false),
});

const TenantSettings = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize forms
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "Acme Corporation",
      contactEmail: "contact@acme.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      logo: "",
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
    },
  });
  
  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      mfaRequired: false,
      passwordRotation: 90,
      sessionTimeout: 60,
      allowedIpRanges: "",
    },
  });
  
  const featureForm = useForm<z.infer<typeof featureSettingsSchema>>({
    resolver: zodResolver(featureSettingsSchema),
    defaultValues: {
      enableRecruiting: true,
      enablePayroll: true,
      enableAttendance: true,
      enableLeave: true,
      enablePerformance: false,
      enableTraining: false,
    },
  });
  
  // Form submission handlers
  const onGeneralSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    console.log("General settings saved:", data);
    toast({
      title: "Success",
      description: "General settings have been saved successfully.",
    });
  };
  
  const onSecuritySubmit = (data: z.infer<typeof securitySettingsSchema>) => {
    console.log("Security settings saved:", data);
    toast({
      title: "Success",
      description: "Security settings have been saved successfully.",
    });
  };
  
  const onFeatureSubmit = (data: z.infer<typeof featureSettingsSchema>) => {
    console.log("Feature settings saved:", data);
    toast({
      title: "Success",
      description: "Feature settings have been saved successfully.",
    });
  };
  
  return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenant Settings</h1>
            <p className="text-muted-foreground">
              Tenant ID: {tenantId} - Acme Corporation
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage basic information about this tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL to your company logo
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={generalForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <div
                                className="h-10 w-10 rounded-md border"
                                style={{ backgroundColor: field.value }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <div
                                className="h-10 w-10 rounded-md border"
                                style={{ backgroundColor: field.value }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies for this tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="mfaRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Require Multi-Factor Authentication
                            </FormLabel>
                            <FormDescription>
                              Enforce MFA for all users in this tenant
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={securityForm.control}
                        name="passwordRotation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Rotation (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Number of days before password change is required (0 to disable)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Minutes of inactivity before user is logged out
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={securityForm.control}
                      name="allowedIpRanges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allowed IP Ranges</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3} 
                              placeholder="e.g., 192.168.1.0/24, 10.0.0.0/8" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Restrict access to specific IP ranges (comma separated, leave empty for no restrictions)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Feature Settings */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
                <CardDescription>
                  Enable or disable features for this tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...featureForm}>
                  <form onSubmit={featureForm.handleSubmit(onFeatureSubmit)} className="space-y-4">
                    <div className="space-y-4">
                      <FormField
                        control={featureForm.control}
                        name="enableRecruiting"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Recruiting</FormLabel>
                              <FormDescription>
                                Enable recruitment management features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="enablePayroll"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Payroll</FormLabel>
                              <FormDescription>
                                Enable payroll management features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="enableAttendance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Attendance</FormLabel>
                              <FormDescription>
                                Enable attendance tracking features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="enableLeave"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Leave Management</FormLabel>
                              <FormDescription>
                                Enable leave request features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="enablePerformance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Performance Management</FormLabel>
                              <FormDescription>
                                Enable performance review features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="enableTraining"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Training</FormLabel>
                              <FormDescription>
                                Enable training management features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default TenantSettings; 