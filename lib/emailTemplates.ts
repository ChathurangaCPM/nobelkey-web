import { BookingProps } from "@/app/types/booking";

export const generateBookingEmailTemplate = (booking: BookingProps): string => {
    return `
        <h1>New Booking Received</h1>
        <p>Customer Details:</p>
        <ul>
            <li>Name: ${booking?.bookingData?.firstName} ${booking?.bookingData?.lastName}</li>
            <li>Email: ${booking?.bookingData?.email}</li>
            <li>Date: ${booking?.bookingData?.date}</li>
            <li>Time: ${booking?.bookingData?.time}</li>
            <li>Mobile Number: ${booking?.bookingData?.mobileNumber || 'Not specify'}</li>
            <li>Adults: ${booking?.bookingData?.adults}</li>
            <li>Children: ${booking?.bookingData?.children}</li>
            
        </ul>
        <br/>
        <p>Route:</p>
        <ul>    
            <li>From: ${booking?.routeData?.pickupLocation}</li>
            <li>To: ${booking?.routeData?.dropLocation}</li>
            <li>Trip Type: ${booking?.routeData?.tripType}</li>
            <li>Base Fee: <b>${booking?.mainCurrency} ${booking?.routeData?.baseFee}</b></li>
            <li>Flight Number: <b>${booking?.bookingData?.flightNumber || 'Not specify'}</b></li>
            <li>Flight Origin: <b>${booking?.bookingData?.flightOrigin || 'Not specify'}</b></li>
            <li>Concerns To TheDriver: <b>${booking?.bookingData?.concernsToTheDriver || 'Not specify'}</b></li>
        </ul>

        <br/>
        <p>Vehicle: ${booking?.routeData?.vehicleName}</p>
    `;
};