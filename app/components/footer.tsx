"use client";

import { useSiteContext } from "@/providers/site-provider";
import { ArrowUpRight, Facebook, Instagram, PhoneCall, Twitter, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from "react";
import { UrlObject } from "url";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import moment from "moment";
import { IconGoogleColor } from "./common/svgIcons";

const newsletterSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(100, "Email cannot exceed 100 characters"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface WorkingHours {
    id?: number,
    topTitle?: string;
    content?: string;
}

interface UsefulLinks {
    id?: number,
    url?: string;
    title?: string;
}

const Footer: React.FC = () => {
    const { siteState } = useSiteContext();
    const [footerData, setFooterData] = useState(siteState?.footer || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();

    const videoRef = useRef<HTMLVideoElement>(null);

    const form = useForm<NewsletterFormValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            email: "",
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

    useEffect(() => {
        setFooterData(siteState?.footer)
    }, [siteState]);

    const isActiveLink = (url: string | UrlObject): boolean => {
        if (typeof url === 'string') {
            return pathname === url;
        }
        return pathname === url.pathname;
    };

    const onSubmit = async (values: NewsletterFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/site/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    source: 'footer'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('Successfully subscribed!', {
                    description: 'Thank you for subscribing to our newsletter. Please check your email for confirmation.'
                });
                form.reset();
            } else {
                toast.error('Subscription failed', {
                    description: data.message || 'Please try again later'
                });
            }
        } catch (error) {
            toast.error('Something went wrong!', {
                description: 'Please try again later'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <div className="relative border-b-[1px] border-black/10">
                {footerData && footerData?.usefulLinks?.length > 0 && (
                    <ul className="flex flex-col md:flex-row items-center gap-0 md:gap-3 text-xs justify-center text-muted-foreground">
                        {footerData?.usefulLinks?.map((d: { url: string | UrlObject; title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, i: Key | null | undefined) => (
                            <li key={i}>
                                <Link
                                    href={d?.url}
                                    className={`block py-2 md:py-8 transition-colors font-normal duration-200 ${isActiveLink(d?.url)
                                        ? "text-[#3C51A3] font-semibold"
                                        : "text-muted-foreground hover:text-[#2e3f83] hover:font-semibold"
                                        }`}
                                >
                                    {d?.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-col gap-3 items-center justify-center py-20">
                {footerData?.nlTitle && <div className="flex items-start group">
                    <h4 className="uppercase font-headingFontExtraBold font-semibold md:text-[25px] md:leading-[50px] tracking-tighter">{footerData?.nlTitle}</h4>
                    <ArrowUpRight strokeWidth={2} className="text-[#3C51A3] w-[30px] h-[30px] md:w-[45px] md:h-[45px] p-0 -mt-1 block" />
                </div>}


                {footerData?.topDescription && <div className="md:w-[60%] mx-auto text-center mb-4 px-5 md:px-0">
                    <p className="text-sm capitalize" dangerouslySetInnerHTML={{ __html: footerData?.topDescription }}></p>
                </div>}

                <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 md:px-0 xl:w-[600px] mx-auto">
                    <div className="flex">
                        <input 
                            type="email" 
                            placeholder="Enter Your Email Here" 
                            className="outline-none border-[1px] border-black/10 border-r-0 px-8 w-full placeholder:text-sm transition-all ease-in-out duration-150 focus:border-[#3C51A3]"
                            {...form.register("email")}
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#3C51A3] w-[100px] h-[60px] md:h-[80px] flex items-center justify-center transition-all ease-in-out duration-150 hover:bg-[#2e3f83] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <ArrowUpRight strokeWidth={1.5} size={25} className="text-white p-0 block" />
                            )}
                        </button>
                    </div>
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-2 text-center">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </form>
            </div>

            <div className="border-t-[1px] border-black/10 text-sm py-3 px-5 md:px-0 md:py-0">
                <div className="w-full px-0 md:py-5 lg:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center justify-between">
                    {footerData?.location && <div className="font-semibold text-center md:text-left mb-3 md:mb-0">{footerData?.location}</div>}

                    <div className="flex flex-col xl:flex-row items-center gap-4">
                        {footerData?.contactNumber && <Link href={`tel:${footerData?.contactNumber}`} target="_blank" className="flex items-center gap-1 font-semibold py-0 xl:py-12 hover:underline group">
                            <span>{footerData?.contactNumber}</span>
                            <ArrowUpRight strokeWidth={1.5} size={18} className="text-[#3C51A3] p-0 block transition-all ease-in-out duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>}
                        {footerData?.email && <Link href={`mailto:${footerData?.email}`} target="_blank" className="flex items-center gap-1 font-semibold py-0 xl:py-12 hover:underline group">
                            <span>{footerData?.email}</span>
                            <ArrowUpRight strokeWidth={1.5} size={18} className="text-[#3C51A3] p-0 block transition-all ease-in-out duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>}

                        <div className="text-muted-foreground text-xs md:text-sm">© {moment().format('YYYY')} NobleKey. All Rights Reserved</div>
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm flex flex-col md:flex-row gap-0 items-center md:gap-2">
                        <span>Design and Development by</span>
                        <Link href={'https://aurora365.net?utm_source=noblekey'} target="_blank" className="font-semibold text-black transition-all ease-in-out hover:text-[#3C51A3] hover:underline">Aurora 365 Pvt Ltd</Link>
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div className="w-full h-full absolute top-0 left-0 z-20 bg-gradient-to-t from-white/0 to-black/60"></div>
                <video
                    src="/video/slider-back.mp4"
                    ref={videoRef}
                    autoPlay={true}
                    controls={false}
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
                <div className="w-full px-5 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto relative z-40 py-10 flex flex-col md:flex-row items-center justify-between">
                    {footerData?.privacyLinks && (
                        <ul className="flex items-center flex-col md:flex-row gap-3 text-xs text-white font-semibold flex-1">
                            {footerData.privacyLinks.map((d: any, i: number) => (
                                <React.Fragment key={i}>
                                    <li>
                                        <Link
                                            href={d?.url}
                                            className="transition-all ease-in-out duration-150 hover:underline"
                                        >
                                            {d?.title}
                                        </Link>
                                    </li>

                                    {/* Render separator only if not last item */}
                                    {i !== footerData.privacyLinks.length - 1 && (
                                        <li className="hidden md:flex">
                                            <span className="w-[1px] h-3 bg-white block"></span>
                                        </li>
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>
                    )}


                    <Link href={'/'} className="w-[150px] my-5 lg:my-0">
                        {footerData?.logo && <Image src={footerData?.logo} width={200} height={100} alt="nobleky logo" />}
                    </Link>

                    <div className="flex-1 flex justify-end gap-2 items-center">
                        {footerData?.fb && <>
                            <Link href={footerData?.fb} target="_blank" className="block text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 155.139 155.139" className="w-[15px] h-[15px]"><g><path fill="#fff" d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"></path></g></svg>
                            </Link>
                            <span className="w-[1px] h-3 bg-white block"></span>
                        </>}

                        {footerData?.twt && <>
                            <Link href={footerData?.twt} target="_blank" className="block text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 1226.37 1226.37" className="w-[15px] h-[15px]"><g><path d="M727.348 519.284 1174.075 0h-105.86L680.322 450.887 370.513 0H13.185l468.492 681.821L13.185 1226.37h105.866l409.625-476.152 327.181 476.152h357.328L727.322 519.284zM582.35 687.828l-47.468-67.894-377.686-540.24H319.8l304.797 435.991 47.468 67.894 396.2 566.721H905.661L582.35 687.854z" fill="#fff"></path></g></svg>
                            </Link>
                            <span className="w-[1px] h-3 bg-white block "></span>
                        </>}

                        {footerData?.ytb && <>
                            <Link href={footerData?.ytb} target="_blank" className="block text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 310 310" className="w-[15px] h-[15px]"><g><path d="M297.917 64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359 0-61.369 5.776-72.517 19.938C0 79.663 0 100.008 0 128.166v53.669c0 54.551 12.896 82.248 83.386 82.248h143.226c34.216 0 53.176-4.788 65.442-16.527C304.633 235.518 310 215.863 310 181.835v-53.669c0-29.695-.841-50.16-12.083-63.521zm-98.896 97.765-65.038 33.991a9.997 9.997 0 0 1-14.632-8.863v-67.764a10 10 0 0 1 14.609-8.874l65.038 33.772a10 10 0 0 1 .023 17.738z" fill="#fff"></path></g></svg>
                            </Link>
                            <span className="w-[1px] h-3 bg-white block"></span>
                        </>}

                        {footerData?.linkend && <>
                            <Link href={footerData?.linkend} target="_blank" className="block text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" className="w-[15px] h-[15px]"><g><path d="M90 90V60.7c0-14.4-3.1-25.4-19.9-25.4-8.1 0-13.5 4.4-15.7 8.6h-.2v-7.3H38.3V90h16.6V63.5c0-7 1.3-13.7 9.9-13.7 8.5 0 8.6 7.9 8.6 14.1v26H90zM11.3 36.6h16.6V90H11.3zM19.6 10c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.7 9.6 9.7 9.6-4.4 9.6-9.7-4.3-9.6-9.6-9.6z" fill="#fff"></path></g></svg>
                            </Link>
                        </>}

                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;
