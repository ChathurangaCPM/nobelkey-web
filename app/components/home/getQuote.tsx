import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";


interface GetQuoteProps {
    imageUrl?: string;
    alt?: string,
    carImage?: string
}

const GetQuote: React.FC<GetQuoteProps> = ({
    imageUrl,
    alt,
    carImage
}) => {
    return (
        <div className="flex items-center flex-col lg:flex-row gap-5 border-t-[1px] border-b-[1px] border-black/10 pb-5 md:pb-0">
            <div className="lg:w-6/12 relative">
                <video src="/video/slider-back.mp4" autoPlay controls={false} loop className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
                <div className="p-5 lg:py-40 xl:py-64  lg:px-[8vw] xl:px-[13vw] relative z-10 text-white flex flex-col gap-2">
                    <ArrowDownRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 mb-5" />
                    <h3 className="font-headingFontExtraBold font-bold text-[22px] lg:text-[35px] uppercase">Ready to build something remarkable here?</h3>
                    <p className="text-sm">Get in touch with us to discuss your next project.</p>
                    <span className="text-sm text-[#7390FF] font-semibold">Start the Conversation.</span>
                    <div className="mt-4">
                        <ReadMoreButton />
                    </div>
                </div>
            </div>
            <div className="lg:w-6/12">
                <div className="px-5 lg:px-[8vw] xl:px-[13vw] flex flex-col gap-6">
                    <div className="relative pl-4 lg:max-w-[60%]">
                        <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                        <h1 className="text-[16px]  font-headingFontExtraBold leading-[24px] font-extrabold">Comprehensive Engineering Solutions & Innovation</h1>
                    </div>
                    <p className="text-sm mb-10">Looking for Solutions? Share a few details, and we'll get back to you with a customized estimate.</p>

                    <div className="flex flex-col">
                        <label className="text-sm m-0">First Name</label>
                        <input type="" placeholder="First Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Last Name</label>
                        <input type="" placeholder="Last Name" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Email</label>
                        <input type="email" placeholder="Email Address" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm m-0">Mobile Number</label>
                        <input type="" placeholder="Mobile Number" className="border-0 border-b-4 border-black/15 h-[50px] leading-[50px] outline-none transition-all ease-in-out duration-150 focus:border-[#3C51A3] font-semibold placeholder:font-normal"/>
                    </div>

                    <ReadMoreButton />
                </div>
            </div>
        </div>
    )
}

export default GetQuote;