"use client";

import Image from "next/image";
import { AnimatedBeamDemo } from "./common/animatedBeam";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {  CircleCheckBig, Loader2 } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import { useSiteContext } from "@/providers/site-provider";

interface Vehicle {
    _id: string;
    vehicleName: string;
    maxPassenger: number;
    image: string;
}

interface BookingDetailsViewProps {
    availableVehicles: Vehicle[];
    selectedVehicle: string;
    tripType: string;
    totalPassengers?: number;
    childrenCount?: number;
    adults?: number;
    pickupLocation?: string;
    dropLocation?: string;
    baseFee?: number;
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber?: string;
    concernsToTheDriver?: string;
    date: string;
    time: string;
    flightNumber?: string;
    flightOrigin?: string;
    adults: number;
    children: number;
    paymentType: string;
}

const bookingSchema = z.object({
    firstName: z.string().min(3, { message: "First name is required" }),
    lastName: z.string().min(3, { message: "Last name is required" }),
    email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
    mobileNumber: z.string().optional(),
    concernsToTheDriver: z.string().optional(),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
    flightNumber: z.string().optional(),
    flightOrigin: z.string().optional(),
    adults: z.number(),
    children: z.number(),
    paymentType: z.string(),
});


const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({
    availableVehicles,
    selectedVehicle,
    tripType,
    totalPassengers = 4, // Default value if not provided
    childrenCount: initialChildren = 0,
    adults: initialAdults = 1,
    pickupLocation,
    dropLocation,
    baseFee
}: BookingDetailsViewProps) => {
    const [selectedVehicleData, setSelectedVehicleData] = useState<Vehicle[]>(availableVehicles || []);
    const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
    const [formData, setFormData] = useState<object>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCompleteScreen, setIsCompleteScreen] = useState<boolean>(false);
    const { siteState } = useSiteContext();
    
    

    const form = useForm<FormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            concernsToTheDriver: "",
            date: "",
            time: "",
            flightNumber: "",
            flightOrigin: "",
            adults: initialAdults,
            children: initialChildren,
            paymentType: "",
        }
    });

    const { setValue, watch } = form;

    // Watch for changes in adults and children values
    const currentAdults = watch('adults');
    const currentChildren = watch('children');

    // Set initial values when component mounts
    useEffect(() => {
        setValue('adults', initialAdults);
        setValue('children', initialChildren);
    }, [initialAdults, initialChildren, setValue]);

    const handlePassengerChange = (e: React.MouseEvent<HTMLButtonElement>, type: 'adult' | 'children', increment: boolean) => {
        e.preventDefault();

        
        const maxPassengers = availableVehicles.find((v: { _id: string; }) =>
            v._id === selectedVehicle
        )?.maxPassenger || totalPassengers;

        if (type === 'adult') {
            const newAdultValue = increment ? currentAdults + 1 : currentAdults - 1;

            // Validate adult count
            if (newAdultValue >= 1 && // At least 1 adult required
                newAdultValue <= maxPassengers && // Don't exceed max passengers
                (newAdultValue + currentChildren) <= maxPassengers) { // Check total
                setValue('adults', newAdultValue);
            }
        } else {
            const newChildrenValue = increment ? currentChildren + 1 : currentChildren - 1;

            // Validate children count
            if (newChildrenValue >= 0 && // Can't be negative
                newChildrenValue <= maxPassengers && // Don't exceed max passengers
                (currentAdults + newChildrenValue) <= maxPassengers) { // Check total
                setValue('children', newChildrenValue);
            }
        }
    };

    const onSubmit = async (values: FormValues) => {

        const reValidateTime = moment(`${values.date} ${values?.time}`).format('YYYY-MM-DD hh:mm A');

        const formattedData = {
            ...values,
            time: reValidateTime
        };
        setFormData(formattedData);
        setIsOpenConfirm(true);
    };


    const handlerConfirm = async () => {

        try {
            setIsLoading(true);

            const payload = {
                bookingData: formData,
                mainCurrency: siteState?.mainConfigurations?.mainCurrency || '',
                selectedVehicle,
                routeData: {
                    selectedVehicle,
                    vehicleName: selectedVehicleData.find((v: { _id: string; }) => v._id === selectedVehicle)?.vehicleName,
                    tripType,
                    totalPassengers,
                    pickupLocation,
                    dropLocation,
                    baseFee
                }
            }

            const response = await fetch(`/api/site/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                toast.error('Something went wrong!', {
                    description: 'Please try again later',
                    position: 'top-center'
                })
            }

            toast.success("Booking Successfully", {
                position: 'top-center',
            });
            setIsLoading(false);
            setIsCompleteScreen(true);

            setFormData({});


        } catch (error) {
            toast.error("Something went wrong!", {
                position: 'top-center'
            })
            console.log("error", error);
            setIsLoading(false);
            setFormData({});
        } finally {
            setIsLoading(false);
            setFormData({});
        }
    }


    useEffect(() => {
        setSelectedVehicleData(availableVehicles || []);
    }, [availableVehicles])

    return (
        <div className="relative">

            {isLoading || isCompleteScreen ? <div className="p-20 flex flex-col items-center justify-center">
                {isLoading && <Loader2 strokeWidth={0.4} size={250} className="animate-spin text-yellow-400" />}
                {isCompleteScreen && <CircleCheckBig strokeWidth={0.4} size={250} className="text-yellow-400 " />}

                <div className="text-center">
                    <h3 className="text-2xl font-bold">{isLoading ? 'Please wait...' : 'Request Send Successfully!'}</h3>
                    {isCompleteScreen && <p className="text-muted-foreground">Successfully submitted and our member will call you shortly</p>}
                </div>
            </div> : <>

                <div className="bg-gray-100 p-5 py-10 lg:p-10 lg:py-20">
                    <AnimatedBeamDemo pickupLocation={pickupLocation} dropLocation={dropLocation} tripType={tripType || ''} />
                </div>

                <div className="p-5 lg:p-10 space-y-10">
                    <div className="">
                        <h2 className="font-bold text-2xl">Book a Ride</h2>
                        <p className="text-muted-foreground text-sm">Fill the below required input to proceed</p>

                    </div>
                    <div className="flex items-center gap-10">
                        <div>
                            <Image src={selectedVehicleData.find((v: { _id: string; }) => v._id === selectedVehicle)?.image || ''} alt="vehicle name" width={300} height={250} />
                        </div>

                        <div>
                            <b className="text-xl">{availableVehicles.find((v: { _id: string; }) => v._id === selectedVehicle)?.vehicleName}</b>
                            <div className="flex items-center gap-2 mt-1">
                                <span>Maximum Capacity:</span>
                                <span className="">{availableVehicles.find((v: { _id: string; }) => v._id === selectedVehicle)?.maxPassenger} passengers</span>
                            </div>

                            {tripType === 'round-trip' && (
                                <div className="mt-2 text-yellow-500">
                                    * Round trip price includes return journey
                                </div>
                            )}
                        </div>
                    </div>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="text"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="text"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="email"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="text"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />


                                <div className="flex items-center">

                                    <FormField
                                        control={form.control}
                                        name="adults"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-semibold'>Adults</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-3 w-full">
                                                        <Button
                                                            variant="ghost"
                                                            className="text-2xl text-black bg-slate-50 h-[36px] rounded-none"
                                                            onClick={(e) => handlePassengerChange(e, 'adult', false)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            readOnly
                                                            className="flex-1 text-center rounded-none"
                                                            type="number"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            className="text-2xl text-black bg-slate-50 h-[36px] rounded-none"
                                                            onClick={(e) => handlePassengerChange(e, 'adult', true)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>How many adult will join</FormDescription>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <FormField
                                    control={form.control}
                                    name="children"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Children</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-3 w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className="text-2xl text-black bg-slate-50 h-[36px] rounded-none"
                                                        onClick={(e) => handlePassengerChange(e, 'children', false)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        className="flex-1 text-center rounded-none"
                                                        type="number"
                                                        value={field.value}
                                                        readOnly
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        className="text-2xl text-black bg-slate-50 h-[36px] rounded-none"
                                                        onClick={(e) => handlePassengerChange(e, 'children', true)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>How many children will join</FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="p-5 border-[1px]">
                                <span className="text-xl mb-5 block">Flight Information</span>

                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="flightNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-semibold'>Flight Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="rounded-none"
                                                        type="text"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormDescription>Optional</FormDescription>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="flightOrigin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-semibold'>Flight Origin</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="rounded-none"
                                                        type="text"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormDescription>Optional</FormDescription>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="date"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-none"
                                                    type="time"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="concernsToTheDriver"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Other Concerns to the Driver</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="rounded-none"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Optional</FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="text-2xl flex justify-between items-center">
                                <h3 className="flex items-center">Price: </h3>
                                <p className="font-semibold">{siteState?.mainConfigurations?.mainCurrency} {baseFee}</p>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="rounded-none">Submit Reservation</Button>
                            </div>
                        </form>
                    </Form>

                </div>
            </>}



            <AlertDialog open={isOpenConfirm} onOpenChange={() => setIsOpenConfirm(false)}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="rounded-none" onClick={handlerConfirm}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default BookingDetailsView;