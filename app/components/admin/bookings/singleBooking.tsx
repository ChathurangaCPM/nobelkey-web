"use client"
import React, { useEffect, useState } from "react";
import { Baby, Calendar, Clock, LocateFixed, LocateIcon, Plane, User, Users } from "lucide-react";
import moment from "moment";
import MapDirections from "../common/mapDirections";
import { useAuthContext } from "@/providers/auth-provider";
import BookingStatusChanger from "./bookingStatusChanger";

interface SingleBookingProps {
    data?: {
        _id?: string;
        routeData?: {
            pickupLocation: string;
            dropLocation: string;
            baseFee: number;
            tripType: string;
        };
        currentStatus?: string;
        bookingId?: string;
        createdAt?: string;
        bookingData?: {
            firstName?: string;
            lastName?: string;
            email?: string;
            mobileNumber?: string;
            flightNumber?: string;
            flightOrigin?: string;
            adults?: number;
            children?: number;
            date: string;
            time: string;
            concernsToTheDriver?: string;
        };
    };
}

interface LatLng {
    lat: number;
    lng: number;
}

const SingleBooking: React.FC<SingleBookingProps> = ({
    data
}) => {
    const { state } = useAuthContext();

    const [originCoordinates, setOriginCoordinates] = useState<LatLng>({ lat: 0, lng: 0 });
    const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng>({ lat: 0, lng: 0 });
    

    useEffect(() => {
        const { locations } = state?.data?.theme;
        if (locations && Object.keys(locations).length !== 0) {
            const pickup = data?.routeData?.pickupLocation;
            const dropOff = data?.routeData?.dropLocation;
            const filterPickUp = locations?.find((d: { name: string; }) => d.name === pickup);
            const filterDropOff = locations?.find((d: { name: string; }) => d.name === dropOff);

            const pickupCoordinates = {
                lat: parseFloat(filterPickUp?.latitude || 0),
                lng: parseFloat(filterPickUp?.longitude || 0),
            }
            const dropOffCoordinates = {
                lat: parseFloat(filterDropOff?.latitude || 0),
                lng: parseFloat(filterDropOff?.longitude || 0),
            }

            setOriginCoordinates(pickupCoordinates);
            setDestinationCoordinates(dropOffCoordinates);

        }
    }, [state]);

    return (
        <div className="mt-3 space-y-4">
            <h1 className="text-2xl font-semibold">Booking {data?.bookingId || ''}: {moment(data?.createdAt).format('YYYY-MM-DD hh:mm A')}</h1>


            <div className="flex gap-5">
                <div className="w-8/12">
                    <div className="border-[1px] rounded-md flex flex-col gap-5 overflow-hidden">
                        <MapDirections
                            origin={originCoordinates}
                            destination={destinationCoordinates}
                        />

                        <div className="p-5 pt-0 flex flex-col gap-5">

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-[50px] h-[50px] border-[1px] flex items-center justify-center">
                                        <LocateIcon size={18} className="text-yellow-500" />
                                    </div>
                                    <div>
                                        <span className="uppercase text-xs text-muted-foreground">From</span>
                                        <h4 className="font-semibold">{data?.routeData?.pickupLocation}</h4>
                                    </div>
                                </div>
                                <div className="w-[1px] h-[50px] bg-slate-200 ml-[25px]"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-[50px] h-[50px] border-[1px] flex items-center justify-center">
                                        <LocateFixed size={18} className="text-yellow-500" />
                                    </div>
                                    <div>
                                        <span className="uppercase text-xs text-muted-foreground">To</span>
                                        <h4 className="font-semibold">{data?.routeData?.dropLocation}</h4>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="mt-5 flex flex-col gap-5">
                                <h3 className="flex items-center gap-3 font-semibold text-xl"><User size={40} strokeWidth={1} className="text-yellow-500" />Customer Information</h3>

                                <div className="grid grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span>First Name: </span>
                                            <div>{data?.bookingData?.firstName || '---'}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Last Name: </span>
                                            <div>{data?.bookingData?.lastName || '---'}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Email: </span>
                                            <div>{data?.bookingData?.email || '---'}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Phone: </span>
                                            <div>{data?.bookingData?.mobileNumber || '---'}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="uppercase text-muted-foreground flex items-center gap-2"><Plane strokeWidth={1.5} className="text-yellow-500" /> Flight Information</span>

                                        <div>
                                            Flight Number : {data?.bookingData?.flightNumber || '---'}
                                        </div>
                                        <div>
                                            Flight Origin : {data?.bookingData?.flightOrigin || '---'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-3 border-[1px] p-3">
                                        <Users strokeWidth={1.5} className="text-yellow-500" />

                                        <div className="flex flex-col">
                                            <span className="uppercase text-muted-foreground text-xs">Adults</span>
                                            {`${data?.bookingData?.adults ?? 0} Adult${(data?.bookingData?.adults ?? 0) > 1 ? 's' : ''}` || '---'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-[1px] p-3">
                                        <Baby strokeWidth={1.5} className="text-yellow-500" />

                                        <div className="flex flex-col">
                                            <span className="uppercase text-muted-foreground text-xs">Children</span>
                                            {`${data?.bookingData?.children} Children${(data?.bookingData?.children ?? 0) > 1 ? 's' : ''}` || '---'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-[1px] p-3">
                                        <Calendar strokeWidth={1.5} className="text-yellow-500" />

                                        <div className="flex flex-col">
                                            <span className="uppercase text-muted-foreground text-xs">Pickup Date</span>
                                            {moment(data?.bookingData?.date).format('YYYY-MM-DD')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-[1px] p-3">
                                        <Clock strokeWidth={1.5} className="text-yellow-500" />

                                        <div className="flex flex-col">
                                            <span className="uppercase text-muted-foreground text-xs">Pickup Time</span>
                                            {moment(data?.bookingData?.time).format('hh:mm A')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                Note:
                                <div className="italic bg-slate-50 p-5">{data?.bookingData?.concernsToTheDriver || '----'}</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-4/12 space-y-4">

                    <div className="flex items-center gap-2 justify-between">
                        <span className="text-xl">Base Fee</span>
                        <div className="text-3xl font-bold">
                        {state?.data?.theme?.mainConfigurations?.mainCurrency} {data?.routeData?.baseFee}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <span className="text-xl">Trip Type</span>
                        <div className="text-xl font-bold capitalize">
                            {data?.routeData?.tripType}
                        </div>
                    </div>

                    <div className="p-5 border-[1px] rounded-md space-y-2">
                        <div>
                            <h4 className="text-xl font-bold">Booking Status</h4>
                            <p className="text-muted-foreground text-xs">In here will display a current booking status</p>
                        </div>
                        <BookingStatusChanger cStatus={data?.currentStatus} id={data?._id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleBooking;