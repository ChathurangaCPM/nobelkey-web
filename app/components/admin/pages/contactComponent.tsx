"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "../common/dataTable";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsletterComponent from "./newsletterComponent";


// app/components/admin/pages/page-component.tsx
type ContactData = {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    mobileNumber?: string;

    createdAt: string;
}

type ContactComponentProps = {
    initialData: ContactData[];
}

function ContactComponent({ initialData }: ContactComponentProps) {
    const [data] = useState<ContactData[]>(initialData || []);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [popupData, setPopupData] = useState<ContactData | null>(null);

    const router = useRouter()


    const handlerOpenModal = (d: ContactData) => {
        console.log("darta===", d);
        setOpenDialog(true);
        setPopupData(d);
    }


    const columns: ColumnDef<ContactData>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => {

                return (
                    <div className="capitalize flex items-center gap-2">
                        {row.getValue("firstName")}
                    </div>
                )
            },
        },
        {
            accessorKey: "email",
            header: "Slug",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Created at",
            cell: ({ row }) => {
                return <div className="font-medium uppercase">{moment(row.getValue("createdAt")).format('YYYY-MM-DD hh:mm a')}</div>
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Contact Management</h2>
            </div>
            
            <Tabs defaultValue="contacts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="contacts">Contact Forms</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletter Subscribers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contacts" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Contact Form Entries</h3>
                    </div>
                    <DataTable
                        columns={columns}
                        data={data}
                        onRowClick={(d) => handlerOpenModal(d)}
                        loading={false}
                    />
                </TabsContent>
                
                <TabsContent value="newsletter" className="space-y-4">
                    <NewsletterComponent />
                </TabsContent>
            </Tabs>

            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>View all information</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                        <span  className="font-semibold">First Name</span>
                        <div>{popupData?.firstName}</div>
                    </div>
                    <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                        <span className="font-semibold">Last Name</span>
                        <div>{popupData?.lastName}</div>
                    </div>
                    <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                        <span className="font-semibold">Mobile</span>
                        <div>{popupData?.mobileNumber}</div>
                    </div>
                    <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                        <span className="font-semibold">Message</span>
                        <div>{popupData?.message}</div>
                    </div>
                    <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                        <span className="font-semibold">Date</span>
                        <div>{moment(popupData?.createdAt).format('YYYY-MM-DD hh:mm a')}</div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ContactComponent;
