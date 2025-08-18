'use client';

import React, { useEffect, useState } from 'react';
import ImageSelector from "@/app/components/admin/imageSelector";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import TopHeader from '@/app/components/admin/theme/topHeader';
import { Button } from '@/components/ui/button';
import MultiContentForm from '@/app/components/admin/theme/mainHeaderContact';
import AdminHeaderNavigationLinks from '@/app/components/admin/theme/navigationLinks';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useAuthContext } from '@/providers/auth-provider';

// Update the schema to include the items array
const generalSettingsFormSchema = z.object({
    logo: z.string(),
    topLeftText: z.string().optional(),
    fb: z.string().optional(),
    twt: z.string().optional(),
    insta: z.string().optional(),
    linkend: z.string().optional(),
    mainContent: z.array(z.object({
        id: z.number(),
        topTitle: z.string(),
        content: z.string(),
        iconName: z.string().optional(),
        link: z.string().optional()
    })).optional(),
    navigationLinks: z.array(z.object({
        id: z.number(),
        title: z.string(),
        url: z.string()
    })).optional(),
});

interface ImageType {
    url: string;
    alt: string;
}

interface MainContentProps {
    id: number;
    topTitle: string;
    content: string;
    iconName?: string;
    link?: string;
}

interface NavigationLinkProps {
    id: number;
    title: string;
    url: string;
}

interface ThemeData {
    header?: {
        logo?: string;
        topLeftText?: string;
        mainContent?: Array<MainContentProps>;
        navigationLinks?: Array<NavigationLinkProps>;
    };
}

interface State {
    data?: {
        theme?: ThemeData;
    };
}

type FormValues = z.infer<typeof generalSettingsFormSchema>;

export default function ThemeSettingHeaderPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { state, setState, isLoadingAuthData } = useAuthContext();

    const form = useForm<FormValues>({
        resolver: zodResolver(generalSettingsFormSchema),
        defaultValues: {
            logo: "",
            topLeftText: '',
            mainContent: [{ id: 1, topTitle: '', content: '', iconName: '', link: '' }],
            navigationLinks: []
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

    const handleContentChange = (items: MainContentProps[]) => {
        setValue('mainContent', items, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true);
            const payload = {
                type: 'header',
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
                        header: {
                            ...prevState?.data?.theme?.header,
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
        if (state?.data?.theme?.header) {
            const { header } = state.data.theme;
            setValue('logo', header.logo || '');
            setValue('topLeftText', header.topLeftText || '');
            setValue('mainContent', header.mainContent || []);
            setValue('navigationLinks', header.navigationLinks || []);
            setValue('fb', header.fb || '');
            setValue('twt', header.twt || '');
            setValue('insta', header.insta || '');
            setValue('linkend', header.linkend || '');
        }
    }, [state, setValue]);

    if (isLoadingAuthData) {
        return (
            <div>Please wait.....</div>
        )
    }

    return (
        <div className="">
            <h1 className="text-2xl font-semibold">Customize Main Header</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Rest of the JSX remains the same */}
                    <div className="space-y-3">
                        {/* <TopHeader control={form.control} />
                        <hr /> */}
                        <div className='flex gap-4'>

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

                            {/* <FormField
                                control={form.control}
                                name="mainContent"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <MultiContentForm
                                                control={form.control}
                                                onChange={handleContentChange}
                                                data={{ items: field.value }}
                                                max={3}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            /> */}
                        </div>
                        
                        <hr />
                        
                        <FormField
                            control={form.control}
                            name="navigationLinks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <AdminHeaderNavigationLinks />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type='submit' disabled={isLoading}>
                        {isLoading && <LoaderCircle size={15} />}
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
