"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../common/dataTable";
import { useState, useEffect } from "react";
import moment from 'moment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Newsletter subscription data type
type NewsletterData = {
    _id: string;
    email: string;
    name?: string;
    status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
    subscriptionDate: string;
    unsubscribeDate?: string;
    source?: string;
    isConfirmed: boolean;
    emailsSent: number;
    createdAt: string;
}

type NewsletterComponentProps = {
    initialData?: NewsletterData[];
}

function NewsletterComponent({ initialData = [] }: NewsletterComponentProps) {
    const [data, setData] = useState<NewsletterData[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [popupData, setPopupData] = useState<NewsletterData | null>(null);

    // Fetch newsletter subscriptions
    const fetchNewsletterData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/site/newsletter', {
                method: 'GET',
            });
            
            if (response.ok) {
                const result = await response.json();
                setData(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching newsletter data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialData.length === 0) {
            fetchNewsletterData();
        }
    }, [initialData.length]);

    const handlerOpenModal = (d: NewsletterData) => {
        setOpenDialog(true);
        setPopupData(d);
    }

    const getStatusBadge = (status: string, isConfirmed: boolean) => {
        if (status === 'active' && isConfirmed) {
            return <Badge variant="default" className="bg-green-500">Active</Badge>;
        } else if (status === 'pending' || !isConfirmed) {
            return <Badge variant="secondary">Pending</Badge>;
        } else if (status === 'unsubscribed') {
            return <Badge variant="destructive">Unsubscribed</Badge>;
        } else if (status === 'bounced') {
            return <Badge variant="outline" className="border-orange-500 text-orange-500">Bounced</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    };

    const columns: ColumnDef<NewsletterData>[] = [
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        {row.getValue("email")}
                    </div>
                )
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="capitalize">{row.getValue("name") || "N/A"}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const isConfirmed = row.original.isConfirmed;
                return getStatusBadge(status, isConfirmed);
            },
        },
        {
            accessorKey: "source",
            header: "Source",
            cell: ({ row }) => <div className="capitalize">{row.getValue("source") || "website"}</div>,
        },
        {
            accessorKey: "emailsSent",
            header: "Emails Sent",
            cell: ({ row }) => <div className="text-center">{row.getValue("emailsSent")}</div>,
        },
        {
            accessorKey: "subscriptionDate",
            header: "Subscribed",
            cell: ({ row }) => {
                return <div className="font-medium">{moment(row.getValue("subscriptionDate")).format('YYYY-MM-DD hh:mm a')}</div>
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                <Button onClick={fetchNewsletterData} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>
            
            <DataTable
                columns={columns}
                data={data}
                onRowClick={(d) => handlerOpenModal(d)}
                loading={loading}
            />

            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Newsletter Subscription Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Email</span>
                            <div>{popupData?.email}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Name</span>
                            <div>{popupData?.name || "N/A"}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Status</span>
                            <div>{getStatusBadge(popupData?.status || '', popupData?.isConfirmed || false)}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Confirmed</span>
                            <div>{popupData?.isConfirmed ? "Yes" : "No"}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Source</span>
                            <div className="capitalize">{popupData?.source || "website"}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Emails Sent</span>
                            <div>{popupData?.emailsSent || 0}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                            <span className="font-semibold">Subscription Date</span>
                            <div>{moment(popupData?.subscriptionDate).format('YYYY-MM-DD hh:mm a')}</div>
                        </div>
                        
                        {popupData?.unsubscribeDate && (
                            <div className="flex flex-col gap-2 border-b-[1px] border-b-black/20 p-2">
                                <span className="font-semibold">Unsubscribe Date</span>
                                <div>{moment(popupData.unsubscribeDate).format('YYYY-MM-DD hh:mm a')}</div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default NewsletterComponent;
