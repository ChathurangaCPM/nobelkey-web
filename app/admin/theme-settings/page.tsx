"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppWindow, Dock, Home, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ThemeData {
    mainConfigurations?: {
        mainCurrency?: string;
    };
}
interface State {
    data?: {
        theme?: ThemeData;
    };
}

const themeSettingsFormSchema = z.object({
    mainCurrency: z.string(),
});


type FormValues = z.infer<typeof themeSettingsFormSchema>;


const ThemeSettingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { state, setState } = useAuthContext();

    const form = useForm<FormValues>({
        resolver: zodResolver(themeSettingsFormSchema),
        defaultValues: {
            mainCurrency: "",
        },
    });

    const { setValue } = form;


    const onSubmit = async (values: FormValues) => {

        try {
            setIsLoading(true);
            const payload = {
                type: 'mainConfigurations',
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
                        mainConfigurations: {
                            ...prevState?.data?.theme?.mainConfigurations,
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
    }

    useEffect(() => {
        if (state?.data?.theme?.mainConfigurations) {
            const { mainConfigurations } = state.data.theme;
            setValue('mainCurrency', mainConfigurations.mainCurrency || '');
        }
    }, [state, setValue]);

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Theme Settings</h1>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="mainCurrency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Enter main currency that site wide use</FormLabel>
                                    <FormControl>
                                        <Input value={field.value} onChange={field.onChange} placeholder="USD" />
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

            <div className="grid grid-cols-3 gap-5">
                <Link href="/admin/theme-settings/header">
                    <Card className="cursor-pointer space-y-3 p-4">
                        <AppWindow strokeWidth={1} />
                        <h2 className="font-semibold">Header</h2>
                        <p>Customize Main Header</p>
                    </Card>
                </Link>
                <Link href="/admin/theme-settings/header">
                    <Card className="cursor-pointer space-y-3 p-4">
                        <Dock strokeWidth={1} />
                        <h2 className="font-semibold">Footer</h2>
                        <p>Customize Main Footer</p>
                    </Card>
                </Link>
                <Link href="/admin/theme-settings/home-page">
                    <Card className="cursor-pointer space-y-3 p-4">
                        <Home strokeWidth={1} />
                        <h2 className="font-semibold">Home page</h2>
                        <p>Customize Home page</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

export default ThemeSettingPage;