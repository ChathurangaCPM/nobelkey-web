"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReadMoreButton from "../common/readMoreButton";


interface ContactFormProps {
    title?: string;
    tagline?: string;
    toEmail?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
    title,
    tagline,
    toEmail,
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

    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };

    return (
        <div className="border-b-[1px]">
            <div className="relative max-w-[800px] mx-auto overflow-hidden pb-10">
                <div className="text-center pb-10 flex flex-col gap-3">
                    <h2 className="text-[35px] font-extrabold leading-[32px]" dangerouslySetInnerHTML={{ __html: processContent(title || '') }}></h2>
                    <p dangerouslySetInnerHTML={{ __html: processContent(tagline || '') }}></p>
                </div>

                <div className="">
                    <div className="grid grid-cols-2 gap-5">
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
                    </div>

                    <div className="flex flex-col mt-4 mb-5">
                        <label className="text-sm m-0">Message</label>
                        <textarea placeholder="Your message" cols={5} className="border-0 border-b-4 border-black/15 leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal" />
                    </div>

                    <div className="flex items-center justify-center">
                        <ReadMoreButton title="Submit Now" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm;