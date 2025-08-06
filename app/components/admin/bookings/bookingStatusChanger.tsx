"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface BookingStatusChangerProps {
    cStatus?: string,
    id?: string,
    onStatusChange?: (status: string) => void;
}

const BookingStatusChanger: React.FC<BookingStatusChangerProps> = ({
    id,
    cStatus,
    onStatusChange
}) => {
    const [currentStatus, setCurrentStatus] = useState<string>(cStatus || "pending");
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChangeDropdown = (selected: string) => {
        setPendingStatus(selected);
        setShowConfirm(true);
        setError(null);
    };

    const updateBookingStatus = async (bookingId: string, status: string) => {

        try {
            const response = await fetch('/api/admin/bookings/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }

            const data = await response.json();

            toast.success("Successfully change booking status!")

            return data;
        } catch (error) {
            console.log("error", error);
            throw new Error('Error updating booking status');
        }
    };

    const handleConfirm = async () => {
        if (!pendingStatus) return;

        setIsLoading(true);
        setError(null);

        try {
            await updateBookingStatus(id || '', pendingStatus);
            setCurrentStatus(pendingStatus);
            if (onStatusChange) {
                onStatusChange(pendingStatus);
            }
        } catch (err) {
            setError('Failed to update booking status. Please try again.');
            console.error('Error updating status:', err);
        } finally {
            setIsLoading(false);
            setPendingStatus(null);
            setShowConfirm(false);
        }
    };

    const handleCancel = () => {
        setPendingStatus(null);
        setShowConfirm(false);
        setError(null);
    };

    return (
        <div className="w-full space-y-2">
            <Select value={currentStatus} onValueChange={handleChangeDropdown}>
                <SelectTrigger className="w-full" disabled={isLoading}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accept">Accept</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
            </Select>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <AlertDialog open={showConfirm} onOpenChange={handleCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. When you change the status the client will be notified through email.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BookingStatusChanger;