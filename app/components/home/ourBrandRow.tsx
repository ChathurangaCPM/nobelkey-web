import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


interface OurBrandRowProps {
    imageUrl?: string;
    alt?: string,
    carImage?: string
}

const OurBrandRow: React.FC<OurBrandRowProps> = ({
    imageUrl,
    alt,
    carImage
}) => {
    return (
        <div className="relative overflow-hidden px-5 lg:px-0 py-20">
            <video src="/video/slider-back.mp4" autoPlay controls={false} loop className="absolute top-0 left-0 z-10 w-full h-full object-cover"></video>
            <div className="w-full p-6 lg:w-11/12 xl:px-0 gap-5 xl:max-w-[1400px] mx-auto bg-white relative z-20 rounded-md flex flex-col lg:flex-row justify-between">
                <div className="pb-5 lg:p-20 lg:border-r-[1px] lg:border-black/10 flex-1">
                    <div className="w-[100%] flex flex-col gap-4">
                        <div className="relative pl-4">
                            <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                            <h1 className="text-[16px] lg:max-w-[50%] font-headingFontExtraBold leading-[25px] font-extrabold">Innovating Through Our Own Brands</h1>
                        </div>
                        <p className="text-sm lg:max-w-[65%]">Our brands reflect NobleKey's commitment to excellence, Designed and managed in-house</p>

                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row justify-center gap-5">
                    <Link href={'/'} className="lg:p-10 flex-1 flex items-center flex-col justify-center gap-5 lg:border-r-[1px] lg:border-black/10 group">
                        <Image src={'https://dummyimage.com/600x250/ddd/fff'} alt={''} className="w-full" width={300} height={200} />
                        <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                    <Link href={'/'} className="lg:p-10 flex-1 flex items-center flex-col justify-center gap-5 group">
                        <Image src={'https://dummyimage.com/600x250/ddd/fff'} alt={''} className="w-full" width={300} height={200} />
                        <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OurBrandRow;