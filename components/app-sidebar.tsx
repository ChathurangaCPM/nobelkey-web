"use client"

import * as React from "react"
import {
  
  Command,
  
  Route,
  LayoutDashboard,
  StickyNote,
  Settings2,
  
  Car,
  Calendar1,
  Image,
  Mail,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"

const initData = {
  user: {
    name: "Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    // {
    //   title: "Bookings",
    //   url: "/admin/bookings",
    //   icon: Calendar1,
    //   isActive: true,
    // },
    // {
    //   title: "Manage Routes",
    //   url: "#",
    //   icon: Route,
    //   items: [
    //     {
    //       title: "Locations",
    //       url: "/admin/manage-routes/locations",
    //     },
    //     {
    //       title: "Fees",
    //       url: "/admin/manage-routes/fees",
    //     },
    //   ],
    // },
    {
      title: "Pages",
      url: "/admin/pages",
      icon: StickyNote,
      items: [
        {
          title: "All Pages",
          url: "/admin/pages",
        },
        {
          title: "Create New",
          url: "/admin/pages/new",
        },
      ],
    },
    // {
    //   title: "Posts",
    //   url: "#",
    //   icon: StickyNote,
    //   items: [
    //     {
    //       title: "Create New",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Media Library",
      url: "/admin/media-library",
      icon: Image,
      items: [
      ],
    },
    {
      title: "Contact",
      url: "/admin/contact",
      icon: Mail,
      items: [
      ],
    },
    // {
    //   title: "Vehicles",
    //   url: "#",
    //   icon: Car,
    //   items: [
    //     {
    //       title: "All Vehicles",
    //       url: "/admin/vehicles",
    //     },
    //     {
    //       title: "Add New Vehicle",
    //       url: "/admin/vehicles/add-new-vehicle",
    //     },
    //   ],
    // },
    {
      title: "Theme Settings",
      url: "/admin/theme-settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/theme-settings",
        },
        {
          title: "Header",
          url: "/admin/theme-settings/header",
        },
        {
          title: "Footer",
          url: "/admin/theme-settings/footer",
        },
        {
          title: "Homepage",
          url: "/admin/theme-settings/home-page",
        },
      ],
    },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState(initData || {});

  const { data: session, status } = useSession();
  

  React.useMemo(() => {
    if (status === "authenticated") {
      setData({
        ...data,
        user: {
          name: session?.user?.name || 'Admin',
          email: session?.user?.email || '',
          avatar: session?.user?.image || '',
        },
      });
    }
  }, [session]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" target="_blank">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">NobelKey</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
