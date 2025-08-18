"use client";

import ReadMoreButton from "../common/readMoreButton";
import { useEffect, useRef } from "react";

interface GetAQuoteRowProps {
    title?: string;
    description?: string;
    link?: string;
    linkText?: string;
    isAdmin?: boolean;
}

const GetAQuoteRow: React.FC<GetAQuoteRowProps> = ({
    title,
    description,
    link,
    linkText,
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
        <div className="relative overflow-hidden px-5 lg:px-0 py-20">
            <video
                src="/video/slider-back.mp4"
                ref={videoRef}
                autoPlay={true}
                controls={false}
                loop
                muted
                playsInline
                className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
            <div className="w-full p-6 py-20 lg:w-11/12 xl:px-0 gap-5 xl:max-w-[1400px] mx-auto bg-white relative z-20 rounded-md flex flex-col lg:flex-row justify-between items-start">
                <div className="w-full lg:w-auto lg:flex-1">
                    <div className="w-[100%] flex flex-col gap-4">
                        {title && <div className="relative lg:pl-4 text-center lg:text-right">
                            <h1 className="text-[20px] font-headingFontExtraBold leading-[35px] font-extrabold lg:border-r-4 lg:border-r-[#3C51A3] lg:pr-4" dangerouslySetInnerHTML={{ __html: title || ''}}></h1>
                        </div>}
                        
                    </div>
                </div>

                <div className="w-full lg:w-auto lg:flex-1 flex flex-col justify-center gap-5">
                    {description && <p className="text-sm text-center lg:text-left lg:max-w-[80%]">{description}</p>}
                    <div className="flex justify-center lg:justify-start">
                         <ReadMoreButton url={link} title={linkText}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetAQuoteRow;