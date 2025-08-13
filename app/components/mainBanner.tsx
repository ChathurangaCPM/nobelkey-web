"use client";

import Image from "next/image";
import BookingWidget from "./bookingWidget";
import BannerSideImage from "./bannerSideImage";
import { motion } from 'framer-motion'
import ScrollingText from "./scrollingText";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SliderItem {
    id: string;
    imageUrl: string;
}

interface MainBannerProps {
    backgroundImageUrl?: string;
    leftText?: string;
    scrollText?: string;
    sliderItems?: SliderItem[] | string;
}

const MainBanner: React.FC<MainBannerProps> = ({
    backgroundImageUrl,
    leftText,
    scrollText,
    sliderItems
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch((error) => {
                console.log('Autoplay failed:', error);
            });
        }
    }, []);

    // Parse slider items
    const rowItems: SliderItem[] = typeof sliderItems === 'string' 
        ? JSON.parse(sliderItems) 
        : (sliderItems || []);

    // Auto-slide functionality (optional)
    useEffect(() => {
        if (rowItems.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % rowItems.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [rowItems.length]);

    // Navigation functions
    const goToPreviousSlide = () => {
        setCurrentSlide((prev) => 
            prev === 0 ? rowItems.length - 1 : prev - 1
        );
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % rowItems.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Get current slider item for background image
    const currentSliderItem = rowItems[currentSlide];
    const displayBackgroundImage = currentSliderItem?.imageUrl || backgroundImageUrl || "/images/ww.png";

    return (
        <div className="relative overflow-hidden border-b-[1px] border-black/5">
            {/* Main background image with smooth transition */}
            <motion.div 
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-[60vw] xl:w-[60vw] absolute left-1/2 bottom-[40vh] xl:bottom-[2vw] -translate-x-1/2 z-40 pointer-events-none"
            >
                <Image 
                    src={displayBackgroundImage} 
                    alt={`noble-key-slider-${currentSlide + 1}`} 
                    width={1300} 
                    height={700} 
                    className="w-full transition-all duration-500" 
                />
            </motion.div>

            <div className="h-[40vh] xl:h-[50vh] bg-[#0F1A42] relative -z-10"></div>

            <div className="relative w-full bg-[#0F1A42] xl:bg-transparent">
                <div className="flex items-start gap-2 justify-between w-full border-b-[1px] border-black/5 xl:absolute top-0 left-0">
                    <Image src="/images/texts/noble-key.svg" alt="noble-key" width={300} height={300} className="w-full relative z-30" />
                    <div className="w-full xl:w-1/2 absolute bottom-0 right-0 h-1/2 bg-gradient-to-t from-[#0f1a4285] to-gray-100/0 z-20"></div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-0 bg-[#0F1A42] xl:bg-transparent">
                <div className="w-full xl:w-[50%] xl:pl-[10vw] pt-10 xl:pt-[10vw] flex flex-col gap-8 p-2">
                    <div className="text-sm font-medium xl:w-[40%] pl-3 leading-[18px] relative text-white xl:text-black">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[85%] bg-[#3C51A3]"></div>
                        {leftText || "Discover Engineered Solutions Designed to Optimize Performance and Value"}
                    </div>
                    <ScrollingText text={scrollText}/>
                </div>
                
                <div className="w-full xl:w-[50%] relative overflow-hidden">
                    <div className="relative overflow-hidden h-[22vh] xl:h-[19.8vw]">
                        <video
                            src="/video/slider-back.mp4"
                            ref={videoRef}
                            autoPlay={true}
                            controls={false}
                            loop
                            muted
                            playsInline
                            className="absolute z-10 w-full h-full top-0 left-0 object-cover">
                        </video>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center bg-[#3C51A3]">
                        <button 
                            onClick={goToPreviousSlide}
                            disabled={rowItems.length <= 1}
                            className="p-5 text-center flex-1 flex items-center justify-center transition-all ease-in-out duration-75 hover:bg-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="text-white" size={43} strokeWidth={1.2} />
                        </button>
                        
                        <div className="flex items-center gap-1 font-semibold text-white justify-center text-sm w-20">
                            <span className="text-xs text-white/45 font-normal leading-3">
                                {String(currentSlide + 1).padStart(2, '0')}
                            </span>
                            <span className="font-bold leading-4">
                                {String(Math.max(rowItems.length, 1)).padStart(2, '0')}
                            </span>
                        </div>
                        
                        <button 
                            onClick={goToNextSlide}
                            disabled={rowItems.length <= 1}
                            className="p-5 text-center flex-1 flex items-center justify-center transition-all ease-in-out duration-75 hover:bg-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="text-white" size={43} strokeWidth={1.2} />
                        </button>
                    </div>

                    {/* Dot indicators (optional) */}
                    {/* {rowItems.length > 1 && (
                        <div className="flex justify-center gap-2 py-3 bg-[#3C51A3]">
                            {rowItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentSlide 
                                            ? 'bg-white' 
                                            : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default MainBanner;