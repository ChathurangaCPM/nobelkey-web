"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {  MoreHorizontal } from "lucide-react";
import { DataTable } from "../common/dataTable";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment';


// app/components/admin/pages/page-component.tsx
type PageData = {
    isHomePage: boolean;
    _id: string;
    title: string;
    slug: string;
    parent?: string | { _id: string; title: string; slug: string };
    createdAt: string;
    children?: PageData[];
    level?: number;
}

type PageComponentProps = {
    initialData: PageData[];
}

function PageComponent({ initialData }: PageComponentProps) {
    const [data] = useState<PageData[]>(initialData || []);
    
    const router = useRouter()

    // Function to organize pages into hierarchical structure
    const organizePages = (pages: PageData[]): PageData[] => {
        const pageMap = new Map<string, PageData>();
        const rootPages: PageData[] = [];
        
        // First pass: create a map of all pages
        pages.forEach(page => {
            pageMap.set(page._id, { ...page, children: [], level: 0 });
        });
        
        // Second pass: organize into hierarchy
        pages.forEach(page => {
            const pageWithChildren = pageMap.get(page._id)!;
            const parentId = typeof page.parent === 'object' ? page.parent?._id : page.parent;
            
            if (parentId && pageMap.has(parentId)) {
                const parent = pageMap.get(parentId)!;
                pageWithChildren.level = (parent.level || 0) + 1;
                parent.children!.push(pageWithChildren);
            } else {
                rootPages.push(pageWithChildren);
            }
        });
        
        // Flatten the hierarchy for table display
        const flattenPages = (pages: PageData[]): PageData[] => {
            const result: PageData[] = [];
            pages.forEach(page => {
                result.push(page);
                if (page.children && page.children.length > 0) {
                    result.push(...flattenPages(page.children));
                }
            });
            return result;
        };
        
        return flattenPages(rootPages);
    };

    const hierarchicalData = useMemo(() => organizePages(data), [data]);

    const columns: ColumnDef<PageData>[] = [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          const data = row.original;
          const level = data.level || 0;
          const indentation = level * 20; // 20px per level
          
          return (
            <div className="capitalize flex items-center gap-2" style={{ paddingLeft: `${indentation}px` }}>
              {level > 0 && (
                <span className="text-gray-400 mr-2">
                  {'└─ '}
                </span>
              )}
              {row.getValue("title")} 
              {data?.isHomePage && (<div className="font-semibold">-Home Page</div>)}
            </div>
          )
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {    
          return <div className="font-medium uppercase">{moment(row.getValue("createdAt")).format('YYYY-MM-DD hh:mm a')}</div>
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const data = row.original
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/pages/${data?._id}`)}
                >
                  Edit Page
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Pages</h2>
                <Button onClick={() => router.push('/admin/pages/new')}>Create new page</Button>
            </div>
            <DataTable 
                columns={columns} 
                data={hierarchicalData} 
                onRowClick={(d) => router.push(`/admin/pages/${d?._id}`)} 
                loading={false}
            />
        </div>
    );
}

export default PageComponent;
