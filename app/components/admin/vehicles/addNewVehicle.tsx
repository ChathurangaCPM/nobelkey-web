"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImageSelector from "../imageSelector";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VehicleData {
    _id?: string;
    vehicleName: string;
    image: string;
    backgroundImage?: string;
    initialCharge: number;
    perKmPrice?: number;
    maxPassenger: number;
    activeMainCity?: string;
}

const vehicleSchema = z.object({
    vehicleName: z.string().min(3),
    image: z.string(),
    backgroundImage: z.string().optional(),
    initialCharge: z.number(),
    perKmPrice: z.number().optional(),
    maxPassenger: z.number(),
    activeMainCity: z.string().optional(),
    id: z.string().optional(),
});

interface AddNewVehicleProps {
    data?: VehicleData;
}

interface ImageType {
    url: string;
    alt: string;
}

type FormValues = z.infer<typeof vehicleSchema>;

const AddNewVehicle: React.FC<AddNewVehicleProps> = ({
    data
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            vehicleName: "",
            image: '',
            backgroundImage: '',
            initialCharge: 0,
            perKmPrice: 0,
            maxPassenger: 1,
            activeMainCity: ''
        },
    });

    const { setValue } = form;

    const handlerImageChange = (images: ImageType[], type: 'image' | 'backgroundImage') => {
        if (images && images.length > 0) {
            setValue(type, images[0].url, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }

    const onSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true);

            let payload = values

            if (isEdit) {
                payload = {
                    ...payload,
                    id: data?._id
                };
            }

            const response = await fetch('/api/admin/vehicle/create', {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const resJson = await response.json();

            if (!response.ok) {
                toast.error("Something went wrong!", {
                    position: "top-center",
                    description: resJson?.message
                });


                return false;
            };


            toast.success("Successfully Created!", {
                position: "top-center"
            });

            setIsLoading(false);

            router.replace('/admin/vehicles');
            router.refresh()


        } catch (error) {
            console.log("error", error);

            setIsLoading(false);

            toast.error("Something wend wrong!", {
                position: "top-center"
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (data && Object.keys(data).length !== 0) {
            setIsEdit(true);

            setValue('vehicleName', data.vehicleName);
            setValue('image', data.image);
            setValue('backgroundImage', data.backgroundImage);
            setValue('initialCharge', data.initialCharge);
            setValue('perKmPrice', data.perKmPrice);
            setValue('maxPassenger', data.maxPassenger);
            setValue('activeMainCity', data.activeMainCity);

        }
    }, [data])

    return (
        <div className="space-y-3">
            <div>
                <h1 className="text-2xl font-semibold">{isEdit ? "Update" : "Add new"} vehicle</h1>
                <p className="text-sm text-muted-foreground">{isEdit ? "Update" : "Add new"} vehicle for easy to calculate fare</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex gap-5">
                        <div className="w-9/12 space-y-4">
                            <FormField
                                control={form.control}
                                name="vehicleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Vehicle Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            This name will display in the frontend
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="initialCharge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Initial Charge</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Base fare for the ride
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="perKmPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Price per Kilometer</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Rate charged per kilometer of travel
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxPassenger"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Maximum Passengers</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Maximum number of passengers allowed
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="activeMainCity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Active Main City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Primary city where this vehicle operates
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>


                        </div>

                        <div className="w-3/12 space-y-10 bg-gray-50 p-5 h-screen">
                            <FormField
                                control={form.control}
                                name="backgroundImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Select a background image</FormLabel>
                                        <FormControl>
                                            <ImageSelector
                                                value={field.value || ''}
                                                onChange={(images: ImageType[]) => handlerImageChange(images, "backgroundImage")}
                                                removeImage={() => setValue('backgroundImage', '')}
                                            />
                                        </FormControl>
                                        {field.value === "" && <FormDescription className="text-xs">
                                            Select a logo to display in the header
                                        </FormDescription>}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Select a main image</FormLabel>
                                        <FormControl>
                                            <ImageSelector
                                                value={field.value || ''}
                                                onChange={(d: ImageType[]) => handlerImageChange(d, "image")}
                                                removeImage={() => setValue('image', '')}
                                            />
                                        </FormControl>
                                        {field.value === "" && <FormDescription className="text-xs">
                                            Select a image to display as a vehicle
                                        </FormDescription>}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type='submit' disabled={isLoading}>
                                    {isLoading && <LoaderCircle size={15} />}
                                    {isEdit ? "Update" : "Submit"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddNewVehicle;