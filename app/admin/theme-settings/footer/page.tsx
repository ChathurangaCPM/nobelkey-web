"use client";

import ImageSelector from "@/app/components/admin/imageSelector";
import AdminFooterUsefulLinks from "@/app/components/admin/theme/usefulLinks";
import AdminFooterWorkingHours from "@/app/components/admin/theme/workingHours";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const generalFooterFormSchema = z.object({
    logo: z.string(),
    topDescription: z.string().optional(),
    callForTaxi: z.string().optional(),
    workingHours: z.array(z.object({
        id: z.number(),
        topTitle: z.string(),
        content: z.string(),
    })).optional(),
    usefulLinks: z.array(z.object({
        id: z.number(),
        url: z.string(),
        title: z.string(),
    })).optional(),

    location: z.string().optional(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
});

interface ImageType {
    url: string;
    alt: string;
}

interface ThemeData {
    footer?: {
        logo?: string;
        topDescription?: string;
        callForTaxi?: string;
        workingHours?: Array<{
            id: number;
            topTitle: string;
            content: string;
        }>;
        usefulLinks?: Array<{
            id: number;
            url: string;
            title: string;
        }>;
        location?: string;
        email?: string;
        whatsapp?: string;
    };
}


interface State {
    data?: {
        theme?: ThemeData;
    };
}

type FormValues = z.infer<typeof generalFooterFormSchema>;


const SiteFooterAdmin: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { state, setState } = useAuthContext();

    const form = useForm<FormValues>({
        resolver: zodResolver(generalFooterFormSchema),
        defaultValues: {
            logo: "",
            topDescription: '',
            callForTaxi: '',
            workingHours: [{ id: 1, topTitle: '', content: '' }],
            usefulLinks: [{ id: 1, url: '', title: '' }],
            location: '',
            email: '',
            whatsapp: '',
        },
    });

    const { setValue } = form;

    const handlerImageChange = (images: ImageType[]) => {
        if (images && images.length > 0) {
            setValue('logo', images[0].url, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }

    const onSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true);
          

            // return false;
            const payload = {
                type: 'footer',
                data: values
            }

            const response = await fetch('/api/admin/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Response not OK');
            }

            setState((prevState: State) => ({
                ...prevState,
                data: {
                    ...prevState?.data,
                    theme: {
                        ...prevState?.data?.theme,
                        footer: {
                            ...prevState?.data?.theme?.footer,
                            ...values
                        }
                    }
                }
            }));

            toast.success("Updated!", {
                position: 'top-center'
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (state?.data?.theme?.footer) {
            const { footer } = state.data.theme;

            console.log("workingHours ", footer);

            setValue('logo', footer.logo || '');
            setValue('callForTaxi', footer.callForTaxi || '');
            setValue('topDescription', footer.topDescription || '');
            setValue('workingHours', footer.workingHours || []);
            setValue('usefulLinks', footer.usefulLinks || []);
            setValue('location', footer.location || '');
            setValue('email', footer.email || '');
            setValue('whatsapp', footer.whatsapp || '');
        }
    }, [state, setValue]);
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-10">Customize Main Footer</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold'>Select a main logo</FormLabel>
                                <FormControl>
                                    <ImageSelector
                                        value={field.value}
                                        onChange={handlerImageChange}
                                        removeImage={() => setValue('logo', '')}
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
                        name="topDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold'>Footer description</FormLabel>
                                <FormControl>
                                    <Textarea value={field.value} onChange={field.onChange} />

                                </FormControl>

                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="callForTaxi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold'>Call For Taxi Contact Number</FormLabel>
                                <FormControl>
                                    <Input value={field.value} onChange={field.onChange} />
                                </FormControl>

                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <AdminFooterWorkingHours />
                    <AdminFooterUsefulLinks />

                    <hr />

                    <div className="flex items-start w-full gap-4">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Address</FormLabel>
                                        <FormControl>
                                            <Textarea value={field.value} onChange={field.onChange} />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" value={field.value} onChange={field.onChange} />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold'>Whatsapp Number</FormLabel>
                                <FormControl>
                                    <Input value={field.value} onChange={field.onChange} />
                                </FormControl>

                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button type='submit' disabled={isLoading}>
                            {isLoading && <LoaderCircle size={15} />}
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SiteFooterAdmin;