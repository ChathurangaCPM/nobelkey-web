export interface BookingProps {
    mainCurrency: string;
    routeData:  {
        pickupLocation?: string;
        dropLocation?: string;
        tripType?: string;
        baseFee?: number;
        vehicleName?: string;
    };
    bookingData: {
        email: string;
        // [key: string]: string;
        firstName?: string;
        lastName?: string;
        date?: string;
        time?: string;
        mobileNumber?: string;
        adults?: number;
        children?: number;
        flightNumber?: string;
        flightOrigin?: string;
        concernsToTheDriver?: string;
    };
    firstName?: string;
    lastName?: string;
    email: string;
    mobileNumber?: string;
    concernsToTheDriver?: string;
    date?: string;
    time?: string;
    flightNumber?: string;
    flightOrigin?: string;
    adults?: number;
    children?: number;
    paymentType?: string;
}
