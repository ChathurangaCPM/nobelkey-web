"use client";

import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";


interface GetQuoteProps {
    leftMainTitle?: string;
    leftTagline?: string;
    leftSmallText?: string;
    leftLink?: string;
    leftLinkText?: string;

    rightTitle?: string;
    rightDescription?: string;
    isAdmin?: boolean;
}

const GetQuote: React.FC<GetQuoteProps> = ({
    leftMainTitle,
    leftTagline,
    leftSmallText,
    leftLink,
    leftLinkText,

    rightTitle,
    rightDescription,
    isAdmin
}) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch((error) => {
                console.log('Autoplay failed:', error);
            });
        }
    }, []);
    return (
        <div className="flex items-center flex-col lg:flex-row gap-5 border-t-[1px] border-b-[1px] border-black/10 pb-5 md:pb-0">
            <div className="lg:w-6/12 relative">
                <video 
                    ref={videoRef}
                    src="/video/contact_video.mp4" 
                    autoPlay={true} 
                    controls={false} 
                    loop 
                    muted
                    playsInline
                    className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
                <div className="absolute left-0 top-0 w-full h-full z-20 bg-black/40"></div>
                <div className={`p-5 lg:py-40 xl:py-64 lg:px-[8vw] ${isAdmin ? 'xl:px-[2vw]' : 'xl:px-[13vw]'} relative z-30 text-white flex flex-col gap-2`}>
                    <ArrowDownRight strokeWidth={2.7} size={30} className="text-[#7390FF] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 mb-5" />

                    {leftMainTitle && <h3 className="font-headingFontExtraBold font-bold text-[22px] lg:text-[35px] uppercase">{leftMainTitle}</h3>}
                    {leftTagline && <p className="text-sm">{leftTagline}</p>}
                    {leftSmallText && <span className="text-sm text-[#7390FF] font-semibold">{leftSmallText}</span>}

                    {leftLink && <div className="mt-4">
                        <ReadMoreButton url={leftLink || '#'} title={leftLinkText || 'Find Out More'} className="bg-white text-black"/>
                    </div>}
                </div>
            </div>
            <div className={`lg:w-6/12 ${isAdmin ? 'pointer-events-none' : ''}`}>
                <div className={`px-5 lg:px-[8vw] ${isAdmin ? 'xl:px-[2vw]' : 'xl:px-[13vw]'} flex flex-col gap-6`}>
                    {rightTitle && <div className="relative pl-4 lg:max-w-[60%]">
                        <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                        <h1 className="text-[16px]  font-headingFontExtraBold leading-[24px] font-extrabold">{rightTitle}</h1>
                    </div>}
                    
                    {rightDescription && <p className="text-sm mb-10">{rightDescription}</p>}

                    <div className="flex flex-col">
                        <label className="text-sm m-0">First Name</label>
                        <input type="" placeholder="First Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Last Name</label>
                        <input type="" placeholder="Last Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Email</label>
                        <input type="email" placeholder="Email Address" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Mobile Number</label>
                        <input type="" placeholder="Mobile Number" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                    </div>

                    <ReadMoreButton title="Submit Now"/>
                </div>
            </div>
        </div>
    )
}

export default GetQuote;