
import ScrollingText from "@/app/components/scrollingText";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface MainBannerProps {
    backgroundImageUrl?: string;
    leftText?: string;
    scrollText?: string;
    imageArray?: object[],
}

const MainBanner: React.FC<MainBannerProps> = ({
    backgroundImageUrl,
    leftText,
    scrollText,
    imageArray,
}) => {
    return (
        <div className="">
            <div className="relative  overflow-hidden border-b-[1px] border-black/5">

                <div className="w-full sm:w-[60vw] xl:w-[60vw] absolute left-1/2 bottom-[40vh] xl:bottom-[2vw] -translate-x-1/2 z-40 pointer-events-none">
                    <Image src={backgroundImageUrl || "/images/ww.png"} alt="noble-key-slider" width={1300} height={700} className="w-full" />
                </div>

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
                            {leftText}
                        </div>
                        <ScrollingText text={scrollText} />
                    </div>
                    <div className="w-full xl:w-[50%] relative overflow-hidden">
                        <div className="relative overflow-hidden h-[22vh] xl:h-[19.8vw]">
                            <video src="/video/slider-back.mp4" autoPlay controls={false} loop className="absolute z-10 w-full h-full top-0 left-0 object-cover"></video>
                            {/* <Image src="/images/0_Blue_Abstract_1280x720.png" alt="back" width={400} height={200} className="w-full object-cover absolute left-0 top-0 h-full z-0" /> */}
                        </div>

                        <div className="flex items-center bg-[#3C51A3]">
                            <div className="p-5 text-center flex-1 flex items-center justify-center transition-all ease-in-out duration-75 hover:bg-black/10 cursor-pointer">
                                <ChevronLeft className="text-white" size={43} strokeWidth={1.2} />
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-white justify-center text-sm w-20">
                                <span className="text-xs text-white/45 font-normal leading-3">01</span>
                                <span className="font-bold leading-4">05</span>
                            </div>
                            <div className="p-5 text-center flex-1 flex items-center justify-center transition-all ease-in-out duration-75 hover:bg-black/10 cursor-pointer">
                                <ChevronRight className="text-white" size={43} strokeWidth={1.2} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default MainBanner;