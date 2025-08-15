"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";


interface ContactCardProps {
    phone?: string;
    address?: string;
    email?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
    phone,
    address,
    email,
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
        <div className="relative max-w-[800px] mx-auto overflow-hidden text-white mb-10">
            <video
                src="/video/slider-back.mp4"
                ref={videoRef}
                autoPlay={true}
                controls={false}
                loop
                muted
                playsInline
                className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>

            <div className="text-center py-5 relative z-10 border-b-[1px] border-white/15">
                <Link href={`tel:${phone}`}>{phone}</Link>
            </div>
            <div className="text-center py-5 relative z-10 border-b-[1px] border-white/15" dangerouslySetInnerHTML={{ __html: processContent(address || '')}}></div>
            <div className="text-center py-5 relative z-10 border-b-[1px] border-white/15">
                <Link href={`mailto:${email}`}>{email}</Link>
            </div>

        </div>
    )
}

export default ContactCard;