import { useAuth } from "@/contexts/AuthContext";
import TenantDashboardLayout from "@/components/layouts/tenant/TenantDashboardLayout";
import SuperAdminDashboardLayout from "@/components/layouts/superadmin/SuperAdminDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserRound, Mail, Building, Briefcase, Calendar, Clock, MapPin, Phone } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return user?.role === "superadmin" ? (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your profile information.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg sm:text-xl">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl">{user?.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {user?.email}
                </CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {user?.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{user?.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Profile Settings</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Update your profile information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
                  <TabsTrigger value="personal" className="text-sm sm:text-base">Personal</TabsTrigger>
                  <TabsTrigger value="security" className="text-sm sm:text-base">Security</TabsTrigger>
                  <TabsTrigger value="notifications" className="text-sm sm:text-base">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                          defaultValue={user?.name?.split(" ")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                          defaultValue={user?.name?.split(" ")[1]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        defaultValue={user?.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        defaultValue={user?.phone}
                      />
                    </div>
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input
                        type="password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input
                        type="password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      />
                    </div>
                    <Button className="w-full sm:w-auto">Update Password</Button>
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Email Notifications</label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications about your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Push Notifications</label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on your devices
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
  ) : (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your profile information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xl">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.name}</CardTitle>
              <CardDescription>
                <Badge className="capitalize">{user?.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Human Resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/settings">Edit Profile</a>
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  I am an experienced HR professional with a passion for creating positive workplace cultures. 
                  I specialize in employee relations, talent acquisition, and organizational development.
                  With over 5 years of experience in the field, I've helped companies improve their HR 
                  processes and employee satisfaction.
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="employment" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="employment">
                <Card>
                  <CardHeader>
                    <CardTitle>Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Employee ID</div>
                        <div className="text-sm text-muted-foreground">EMP{Math.floor(Math.random() * 10000)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Department</div>
                        <div className="text-sm text-muted-foreground">Human Resources</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Position</div>
                        <div className="text-sm text-muted-foreground">HR Manager</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Reports To</div>
                        <div className="text-sm text-muted-foreground">John Smith (Director)</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Employment Type</div>
                        <div className="text-sm text-muted-foreground">Full Time</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Joining Date</div>
                        <div className="text-sm text-muted-foreground">15 Jan, 2022</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">HR Management</Badge>
                      <Badge variant="secondary">Recruitment</Badge>
                      <Badge variant="secondary">Employee Relations</Badge>
                      <Badge variant="secondary">Performance Management</Badge>
                      <Badge variant="secondary">Training & Development</Badge>
                      <Badge variant="secondary">Conflict Resolution</Badge>
                      <Badge variant="secondary">HRIS Systems</Badge>
                      <Badge variant="secondary">Employment Law</Badge>
                      <Badge variant="secondary">Benefits Administration</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                          <div className="mt-1 rounded-full bg-primary/10 p-1.5">
                            {i % 3 === 0 ? (
                              <Clock className="h-4 w-4 text-primary" />
                            ) : i % 3 === 1 ? (
                              <Calendar className="h-4 w-4 text-primary" />
                            ) : (
                              <Briefcase className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {i % 3 === 0
                                ? "Checked in at 8:30 AM"
                                : i % 3 === 1
                                ? "Submitted leave request"
                                : "Updated profile information"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {i + 1} day{i !== 0 ? "s" : ""} ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
