"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {  MoreHorizontal, Trash2 } from "lucide-react";
import { DataTable } from "../common/dataTable";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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
    const [data, setData] = useState<PageData[]>(initialData || []);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const router = useRouter()

    const handleDeleteClick = (page: PageData) => {
        setPageToDelete(page);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pageToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/page?id=${pageToDelete._id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Page deleted successfully');
                // Remove the deleted page from the data
                setData(prevData => prevData.filter(page => page._id !== pageToDelete._id));
                setDeleteDialogOpen(false);
                setPageToDelete(null);
            } else {
                toast.error(result.message || 'Failed to delete page');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete page');
        } finally {
            setIsDeleting(false);
        }
    };

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
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/pages/${data?._id}`);
                  }}
                >
                  Edit Page
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(data);
                  }}
                  className="text-red-600 focus:text-red-600"
                  disabled={data.isHomePage}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Page
                </DropdownMenuItem>
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

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{pageToDelete?.title}"? This action cannot be undone.
                            {pageToDelete?.isHomePage && (
                                <div className="mt-2 text-red-600 font-medium">
                                    This is your home page and cannot be deleted.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting || pageToDelete?.isHomePage}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default PageComponent;
