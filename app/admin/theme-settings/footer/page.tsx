"use client";

import ImageSelector from "@/app/components/admin/imageSelector";
import AdminFooterPrivacyLinks from "@/app/components/admin/theme/privacyLinks";
import AdminFooterUsefulLinks from "@/app/components/admin/theme/usefulLinks";
import AdminFooterWorkingHours from "@/app/components/admin/theme/workingHours";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FacebookIcon, InstagramIcon, LinkedinIcon, LoaderCircle, Twitter, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const generalFooterFormSchema = z.object({
    logo: z.string(),
    nlTitle: z.string(),
    topDescription: z.string().optional(),
    usefulLinks: z.array(z.object({
        id: z.number(),
        url: z.string(),
        title: z.string(),
    })).optional(),

    privacyLinks: z.array(z.object({
        id: z.number(),
        url: z.string(),
        title: z.string(),
    })).optional(),

    location: z.string().optional(),
    email: z.string().optional(),
    contactNumber: z.string().optional(),
    fb: z.string().optional(),
    ytb: z.string().optional(),
    twt: z.string().optional(),
    insta: z.string().optional(),
    linkend: z.string().optional(),
});

interface ImageType {
    url: string;
    alt: string;
}

interface ThemeData {
    footer?: {
        logo?: string;
        nlTitle?: string;
        topDescription?: string;
        workingHours?: Array<{
            id: number;
            topTitle: string;
            content: string;
        }>;
        location?: string;
        email?: string;
        contactNumber?: string;
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
            nlTitle: "",
            topDescription: '',
            usefulLinks: [{ id: 1, url: '', title: '' }],
            privacyLinks: [{ id: 1, url: '', title: '' }],
            location: '',
            email: '',
            contactNumber: '',
        },
    });


    const handlerImageChange = (images: ImageType[]) => {
        if (images && images.length > 0) {
            setValue('logo', images[0].url, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }


    const { setValue } = form;


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
                position: 'top-center',
                richColors: true,
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

            setValue('logo', footer.logo || '');
            setValue('nlTitle', footer.nlTitle || '');

            setValue('topDescription', footer.topDescription || '');

            setValue('usefulLinks', footer.usefulLinks || []);
            setValue('privacyLinks', footer.privacyLinks || []);
            setValue('location', footer.location || '');
            setValue('email', footer.email || '');
            setValue('contactNumber', footer.contactNumber || '');

            setValue('fb', footer.fb || '');
            setValue('ytb', footer.ytb || '');
            setValue('twt', footer.twt || '');
            setValue('insta', footer.insta || '');
            setValue('linkend', footer.linkend || '');
        }
    }, [state, setValue]);
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-10">Customize Main Footer</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <AdminFooterUsefulLinks />

                    <div className="border-[1px] rounded-2xl p-3 flex flex-col gap-3">
                        <h3 className="font-bold">News Letter Section</h3>
                        <FormField
                            control={form.control}
                            name="nlTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Title</FormLabel>
                                    <FormControl>
                                        <Input value={field.value} onChange={field.onChange} />
                                    </FormControl>

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
                    </div>

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
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold'>Contact Number</FormLabel>
                                <FormControl>
                                    <Input value={field.value} onChange={field.onChange} />
                                </FormControl>

                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <hr />

                    <h3 className="font-semibold text-lg mb-3">Bottom</h3>

                    <div className="flex flex-col gap-5">
                        <AdminFooterPrivacyLinks />

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

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                                    <FacebookIcon size={15} />
                                </div>
                                <FormField
                                    control={form?.control}
                                    name="fb"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input value={field.value || ""} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                                    <Youtube size={15} />
                                </div>
                                <FormField
                                    control={form?.control}
                                    name="ytb"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input value={field.value || ""} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                                    <Twitter size={15} />
                                </div>
                                <FormField
                                    control={form?.control}
                                    name="twt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input value={field.value || ""} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                                    <InstagramIcon size={15} />
                                </div>
                                <FormField
                                    control={form?.control}
                                    name="insta"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input value={field.value || ""} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                                    <LinkedinIcon size={15} />
                                </div>
                                <FormField
                                    control={form?.control}
                                    name="linkend"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input value={field.value || ""} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

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