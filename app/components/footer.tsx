"use client";

import { useSiteContext } from "@/providers/site-provider";
import { ArrowUpRight, Facebook, Instagram, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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


    useEffect(() => {
        setFooterData(siteState?.footer)
    }, [siteState])

    return (
        <>
            <div className="relative border-b-[1px] border-black/10">
                <ul className="flex flex-col md:flex-row items-center gap-0 md:gap-3 text-xs justify-center text-muted-foreground">
                    <li>
                        <Link href="/" className="block py-2 md:py-8 font-semibold text-[#3C51A3]">Home</Link>
                    </li>
                    <li>
                        <span className="w-[1px] h-3 bg-black/10 block"></span>
                    </li>
                    <li>
                        <Link href="/" className="block py-2 md:py-8 transition-all ease-in-out duration-150 hover:text-[#3c51a3] hover:font-semibold">Noblekey</Link>
                    </li>
                    <li>
                        <span className="w-[1px] h-3 bg-black/10 block"></span>
                    </li>
                    <li>
                        <Link href="/" className="block py-2 md:py-8 transition-all ease-in-out duration-150 hover:text-[#3c51a3] hover:font-semibold">Our Services</Link>
                    </li>
                    <li>
                        <span className="w-[1px] h-3 bg-black/10 block"></span>
                    </li>
                    <li>
                        <Link href="/" className="block py-2 md:py-8 transition-all ease-in-out duration-150 hover:text-[#3c51a3] hover:font-semibold">Our Products</Link>
                    </li>
                    <li>
                        <span className="w-[1px] h-3 bg-black/10 block"></span>
                    </li>
                    <li>
                        <Link href="/" className="block py-2 md:py-8 transition-all ease-in-out duration-150 hover:text-[#3c51a3] hover:font-semibold">Contact Us</Link>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col gap-3 items-center justify-center py-20">
                <div className="flex items-start group">
                    <h4 className="uppercase font-headingFontExtraBold font-semibold md:text-[25px] md:leading-[50px] tracking-tighter">Stay Informed</h4>
                    <ArrowUpRight strokeWidth={2} className="text-[#3C51A3] w-[30px] h-[30px] md:w-[45px] md:h-[45px] p-0 -mt-1 block" />
                </div>
                <div className="md:w-[60%] mx-auto text-center mb-4">
                    <p className="text-sm capitalize">Subscribe to receive the latest news, trends, and exclusive <br />Offers directly to your inbox</p>
                </div>
                <div className="px-5 md:px-0 xl:w-[600px] mx-auto flex ">
                    <input type="email" placeholder="Enter Your Email Here" className="outline-none border-[1px] border-black/10 border-r-0 px-8 w-full placeholder:text-sm transition-all ease-in-out duration-150 focus:border-[#3C51A3]" />
                    <button className="bg-[#3C51A3] w-[100px] h-[60px] md:h-[80px] flex items-center justify-center transition-all ease-in-out duration-150 hover:bg-[#2e3f83]">
                        <ArrowUpRight strokeWidth={1.5} size={25} className="text-white p-0 block" />
                    </button>
                </div>
            </div>

            <div className="border-t-[1px] border-black/10 text-sm py-3 px-5 md:px-0 md:py-0">
                <div className="w-full px-0 md:py-5 lg:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center justify-between">
                    <div className="font-semibold text-center md:text-left mb-3 md:mb-0">4/45, 3rd Lane, Thalakotuwa Gardens, Colombo 05</div>

                    <div className="flex flex-col xl:flex-row items-center gap-4">
                        <Link href={''} className="flex items-center gap-1 font-semibold py-0 xl:py-12 hover:underline group">
                            <span>(+94) 112 199239</span>
                            <ArrowUpRight strokeWidth={1.5} size={18} className="text-[#3C51A3] p-0 block transition-all ease-in-out duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                        <Link href={''} className="flex items-center gap-1 font-semibold py-0 xl:py-12 hover:underline group">
                            <span>contact@noblekey.net</span>
                            <ArrowUpRight strokeWidth={1.5} size={18}  className="text-[#3C51A3] p-0 block transition-all ease-in-out duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>

                        <div className="text-muted-foreground text-xs md:text-sm">© 2025 NobleKey. All Rights Reserved</div>
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm flex flex-col md:flex-row gap-0 items-center md:gap-2">
                        <span>Design and Development by</span>
                        <Link href={''} className="font-semibold text-black transition-all ease-in-out hover:text-[#3C51A3] hover:underline">Aurora 365 Pvt Ltd</Link>
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div className="w-full h-full absolute top-0 left-0 z-20 bg-gradient-to-t from-white/0 to-black/60"></div>
                <video src="/video/slider-back.mp4" autoPlay controls={false} loop className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
                <div className="w-full px-5 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto relative z-40 py-10 flex flex-col md:flex-row items-center justify-between">
                    <ul className="flex items-center flex-col md:flex-row gap-3 text-xs text-white font-semibold flex-1">
                        <li>
                            <Link href={''} className="transition-all ease-in-out duration-150 hover:underline">Terms & Conditions</Link>
                        </li>
                        <li className="hidden md:flex">
                            <span className="w-[1px] h-3 bg-white block"></span>
                        </li>
                        <li>
                            <Link href={''} className="transition-all ease-in-out duration-150 hover:underline">Privacy Policy</Link>
                        </li>
                         <li className="hidden md:flex">
                            <span className="w-[1px] h-3 bg-white block"></span>
                        </li>
                        <li>
                            <Link href={''} className="transition-all ease-in-out duration-150 hover:underline">Site map</Link>
                        </li>
                    </ul>

                    <Link href={''}>
                        Logo
                    </Link>
                    <div className="flex-1 flex justify-end">
                        Social Media
                    </div>
                </div>
            </div>


        </>
    )
}

export default Footer;