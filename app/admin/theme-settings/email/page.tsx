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
    emailSettings?: {
        host?: string;
        port?: number;
        password?: string;
        email?: string;
        type?: string;
        zepto_token?: string;
        zepto_from_name?: string;
        zepto_from_address?: string;
    };
}
interface State {
    data?: {
        theme?: ThemeData;
    };
}

const themeSettingsFormSchema = z.object({
    host: z.string().min(2),
    port: z.number(),
    password: z.string(),
    email: z.string().email(),
    zepto_token: z.string().optional(),
    zepto_from_name: z.string().optional(),
    zepto_from_address: z.string().email().optional().or(z.literal("")),
    type: z.string(),
});


type FormValues = z.infer<typeof themeSettingsFormSchema>;


const EmailSettingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('smtp');
    const { state, setState } = useAuthContext();

    const form = useForm<FormValues>({
        resolver: zodResolver(themeSettingsFormSchema),
        defaultValues: {
            host: "smtp.gmail.com",
            port: 587,
            password: "jmdo zimw lwbr jmak",
            email: "chathurangaonline.msg@gmail.com",
            type: "smtp",
            zepto_token: "",
            zepto_from_name: "",
            zepto_from_address: "",
        },
    });

    const { setValue } = form;


    const onSubmit = async (values: FormValues) => {
        console.log("values===", values);

        // return false;

        try {
            setIsLoading(true);
            const payload = {
                type: 'emailSettings',
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
    }

    useEffect(() => {


        if (state?.data?.theme?.emailSettings) {
            const { emailSettings } = state.data.theme;

            setValue('host', emailSettings[0].host || '');
            setValue('port', Number(emailSettings[0].port || '587'));
            setValue('password', emailSettings[0].password || '');
            setValue('email', emailSettings[0].email || '');
            setValue('type', emailSettings[0].type || 'smtp');
            setValue('zepto_token', emailSettings[0].zepto_token || '');
            setValue('zepto_from_name', emailSettings[0].zepto_from_name || '');
            setValue('zepto_from_address', emailSettings[0].zepto_from_address || '');

            setActiveTab( emailSettings[0].type || 'smtp')
        }
    }, [state, setValue]);

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Email Settings</h1>

            <div className="flex items-center gap-5">
                <button onClick={() => {
                    setActiveTab('smtp');
                    setValue('type', 'smtp')
                }} className={`p-3 px-5 ${activeTab === "smtp" ? 'bg-primary text-white font-semibold' : ''} rounded-md`}>SMTP</button>
                <button onClick={() => {
                    setActiveTab('zepto');
                    setValue('type', 'zepto')
                }} className={`p-3 px-5 ${activeTab === "zepto" ? 'bg-primary text-white font-semibold' : ''} rounded-md`}>ZEPTO Mail</button>
            </div>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="host"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Host</FormLabel>
                                    <FormControl>
                                        <Input value={field.value} onChange={field.onChange} placeholder="smtp.gmail.com" />
                                    </FormControl>

                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {activeTab === "smtp" ? <>
                            <FormField
                                control={form.control}
                                name="port"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Port</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="587" type="number" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Password</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="Password" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Email</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="sample@gmail.com" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </> : <>
                            <FormField
                                control={form.control}
                                name="zepto_token"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Zepto Token</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="Key" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zepto_from_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Zepto From Email Address</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="email" type="email" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zepto_from_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-semibold'>Zepto From Name</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} placeholder="Name" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </>}
                        <div className="flex justify-end">
                            <Button type='submit' disabled={isLoading}>
                                {isLoading && <LoaderCircle size={15} />}
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    );
}

export default EmailSettingPage;