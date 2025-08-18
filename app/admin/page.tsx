import DashboardCards from "@/app/components/admin/dashboard/dashboardCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your website.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/pages/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Page
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <DashboardCards />

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/admin/pages">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Manage Pages
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/admin/media-library">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Media Library
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/admin/theme-settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Theme Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-sm text-muted-foreground">New contact received</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <p className="text-sm text-muted-foreground">Page updated</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <p className="text-sm text-muted-foreground">Media uploaded</p>
                            </div>
                        </div>
                        <Button asChild variant="link" className="p-0 h-auto mt-2">
                            <Link href="/admin/contact">View all activity</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Website</span>
                                <span className="text-sm font-medium text-green-600">Online</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Database</span>
                                <span className="text-sm font-medium text-green-600">Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Storage</span>
                                <span className="text-sm font-medium text-green-600">Available</span>
                            </div>
                        </div>
                        <Button asChild variant="link" className="p-0 h-auto mt-2">
                            <Link href="/admin/theme-settings">System Settings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
