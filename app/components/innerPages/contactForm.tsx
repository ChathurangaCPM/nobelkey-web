"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReadMoreButton from "../common/readMoreButton";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const contactFormSchema = z.object({
    firstName: z.string()
        .min(3, "First name must be at least 3 characters long")
        .max(50, "First name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z.string()
        .max(50, "Last name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
        .optional(),
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(100, "Email cannot exceed 100 characters"),
    mobileNumber: z.string()
        .min(1, "Mobile number is required")
        .min(10, "Mobile number must be at least 10 digits")
        .max(15, "Mobile number cannot exceed 15 digits")
        .regex(/^[\d\+\-\s\(\)]+$/, "Mobile number can only contain digits, +, -, spaces, and parentheses")
        .refine((val) => {
            // Remove all non-digit characters to count actual digits
            const digitsOnly = val.replace(/\D/g, '');
            return digitsOnly.length >= 10;
        }, "Mobile number must contain at least 10 digits"),
    message: z.string()
        .min(15, "Message must be at least 15 characters long")
        .max(500, "Message cannot exceed 500 characters"),
});
interface ContactFormProps {
    title?: string;
    tagline?: string;
    toEmail?: string;
}


type FormValues = z.infer<typeof contactFormSchema>;

const ContactForm: React.FC<ContactFormProps> = ({
    title,
    tagline,
    toEmail,
}) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: '',
            mobileNumber: '',
            message: ''
        }
    });

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch((error) => {
                console.log('Autoplay failed:', error);
            });
        }
    }, []);

    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };

    const onSubmit = async (values: FormValues) => {
        try {
            const response = await fetch(`/api/site/contact`, {
                method: 'POST',
                body: JSON.stringify(values || {})
            });

            if (response.ok) {
                toast.success('Thank you for reaching out!', {
                    description: 'Your message has been received and we\'ll respond soon'
                })
                // Handle success
                form.reset();
            }
        } catch (error) {
            toast.error('Something wen wrong!', {
                description: 'Please try again later',
                richColors: true
            })
        }
    }

    return (
        <div className="border-b-[1px]">
            <div className="relative max-w-[800px] mx-auto overflow-hidden pb-10">
                <div className="text-center pb-10 flex flex-col gap-3">
                    <h2 className="text-[35px] font-extrabold leading-[32px]" dangerouslySetInnerHTML={{ __html: processContent(title || '') }}></h2>
                    <p dangerouslySetInnerHTML={{ __html: processContent(tagline || '') }}></p>
                </div>

                <div className="px-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <label className="text-sm m-0">First Name</label>
                                            <FormControl>
                                                <input value={field.value} onChange={field.onChange} type="text" placeholder="First Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <label className="text-sm m-0">Last Name</label>
                                            <FormControl>
                                                <input value={field.value} onChange={field.onChange} type="text" placeholder="Last Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <label className="text-sm m-0">Email</label>
                                            <FormControl>
                                                <input value={field.value} onChange={field.onChange} type="email" placeholder="Email Address" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <label className="text-sm m-0">Mobile Number</label>
                                            <FormControl>
                                                <input value={field.value} onChange={field.onChange} type="text" placeholder="Mobile Number" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex my-4 flex-col">
                                        <label className="text-sm m-0">Message</label>
                                        <FormControl>
                                            <textarea value={field.value} onChange={field.onChange} placeholder="Your message" cols={5} className="border-0 border-b-4 border-black/15 leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                                        </FormControl>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-center">
                                <ReadMoreButton type="button" isLoading={false} title="Submit Now" />
                            </div>
                        </form>

                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ContactForm;