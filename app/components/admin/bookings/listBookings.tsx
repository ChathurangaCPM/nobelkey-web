"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { DataTable } from "../common/dataTable";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import moment from 'moment';
import { useAuthContext } from "@/providers/auth-provider";

// Booking type definition
type Booking = {
    _id: string;
    bookingData: object;
    createdAt: string;
    currentStatus: string;
    routeData?: {
        vehicleName: string;
        pickupLocation: string;
        dropLocation: string;
        baseFee: number;
    };
}

type BookingPageComponentProps = {
    initialData?: Booking[];
}

function BookingPageComponent({ initialData }: BookingPageComponentProps) {
    const [data, setData] = useState<Booking[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const { state } = useAuthContext();
    const { data: session, status } = useSession();
    const router = useRouter();

    // Fetch bookings function
    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/admin/bookings', {
                method: 'GET',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setData(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data if no initial data provided
    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            router.push('/login');
            return;
        }

        // Only fetch if we don't have initial data
        if (!initialData || initialData.length === 0) {
            fetchBookings();
        }
    }, [session, status, router, initialData]);

    // Redirect if not authenticated
    if (status === 'loading') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div>Redirecting to login...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Bookings</h2>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">Error loading bookings</p>
                    <p className="text-sm">{error}</p>
                    <button 
                        onClick={fetchBookings}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: "vehicle",
            header: "Vehicle",
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="capitalize flex items-center gap-2">{data?.routeData?.vehicleName || 'N/A'}</div>
                )
            },
        },
        {
            accessorKey: "from",
            header: "From",
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="capitalize flex items-center gap-2">{data?.routeData?.pickupLocation || 'N/A'}</div>
                )
            },
        },
        {
            accessorKey: "to",
            header: "To",
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="capitalize flex items-center gap-2">{data?.routeData?.dropLocation || 'N/A'}</div>
                )
            },
        },
        {
            accessorKey: "currentStatus",
            header: "Status",
            cell: ({ row }) => {
                const data = row.original;
                const getStatusColor = (status: string) => {
                    switch (status?.toLowerCase()) {
                        case 'completed': return 'text-green-600';
                        case 'pending': return 'text-yellow-600';
                        case 'cancelled': return 'text-red-600';
                        case 'in-progress': return 'text-blue-600';
                        default: return 'text-gray-600';
                    }
                };
                return (
                    <div className={`capitalize flex items-center gap-2 ${getStatusColor(data?.currentStatus)}`}>
                        {data?.currentStatus || 'Unknown'}
                    </div>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created at",
            cell: ({ row }) => {
                return <div className="font-medium uppercase">{moment(row.getValue("createdAt")).format('YYYY-MM-DD hh:mm a')}</div>
            },
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const data = row.original;
                const currency = state?.data?.theme?.mainConfigurations?.mainCurrency || 'LKR';
                const amount = data?.routeData?.baseFee || 0;
                return <div className="font-medium uppercase">{currency} {amount.toLocaleString()}</div>
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
                                onClick={() => router.push(`/admin/bookings/${data?._id}`)}
                            >
                                View Booking
                            </DropdownMenuItem>
                            {/* Future actions can be added here */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bookings</h2>
                <Button 
                    onClick={fetchBookings}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>
            
            {data.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No bookings found</p>
                    <p className="text-gray-400 text-sm mt-2">Bookings will appear here once customers make reservations</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    onRowClick={(d) => router.push(`/admin/bookings/${d?._id}`)}
                    loading={loading}
                />
            )}
        </div>
    );
}

export default BookingPageComponent;