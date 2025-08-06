"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {  MoreHorizontal } from "lucide-react";
import { DataTable } from "../common/dataTable";
import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment';


// app/components/admin/pages/page-component.tsx
type Payment = {
    isHomePage: string;
    _id: string;
    id: string;
    status: string;
    email: string;
    amount: number;
}

type PageComponentProps = {
    initialData: Payment[]; // Replace 'any' with your actual page data type
}

function PageComponent({ initialData }: PageComponentProps) {
    const [data] = useState<Payment[]>(initialData || []);
    
    const router = useRouter()

    const columns: ColumnDef<Payment>[] = [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="capitalize flex items-center gap-2">{row.getValue("title")} {data?.isHomePage && (<div className="font-semibold">-Home Page</div>)}</div>
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
                data={data} 
                onRowClick={(d) => router.push(`/admin/pages/${d?._id}`)} 
                loading={false}
            />
        </div>
    );
}

export default PageComponent;