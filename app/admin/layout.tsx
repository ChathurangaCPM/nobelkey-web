import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthUserProvider } from "@/providers/auth-provider";
import DynamicBreadcrumb from "@/app/components/admin/dynamicBreadcrumb";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";


const openFont = Poppins({
    subsets: ["latin"],
    weight: "400"
});

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Manage your site",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <AuthUserProvider>
            <div className={`${openFont.className} antialiased bg-slate-50`}>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <DynamicBreadcrumb />
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>

            </div>
        </AuthUserProvider>
    );
}
