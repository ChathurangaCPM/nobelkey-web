import { Suspense } from "react";
import BookingPageComponent from "@/app/components/admin/bookings/listBookings";

export default function Bookings() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingPageComponent />
        </Suspense>
    );
}