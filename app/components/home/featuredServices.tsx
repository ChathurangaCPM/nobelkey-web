import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Percent, Plus } from "lucide-react";
import ReadMoreButton from "../common/readMoreButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface FeaturedServicesProps {
    imageUrl?: string;
    alt?: string,
    carImage?: string
}

const FeaturedServices: React.FC<FeaturedServicesProps> = ({
    imageUrl,
    alt,
    carImage
}) => {
    return (
        <div className="relative">
            <div className="w-full px-5 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto flex flex-col xl:flex-row items-start justify-between pb-20">
                <div className="xl:w-[70%]">
                    <div className="relative pl-4 xl:max-w-[60%]">
                        <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                        <h1 className="text-[22px] xl:max-w-[70%] font-headingFontExtraBold leading-[32px] font-extrabold">Comprehensive Engineering Solutions & Innovation</h1>
                    </div>

                </div>
                <div className="xl:w-[30%] flex flex-col gap-4">
                    <p className="font-medium">From Consultancy to Execution, We Deliver Tailored Engineering Solutions</p>
                    <ReadMoreButton />
                </div>
            </div>

            <div className="border-t-[1px] border-black/10 px-0 pt-5 xl:pt-0 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full container mx-auto"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 lg:basis-1/3 xl:border-r-[1px] border-black/10 [&:nth-child(3n)]:border-r-0">
                                <div className="p-5 xl:p-14 xl:pb-0">
                                    <div className="transition-all group pb-10 ease-in-out duration-100 border-b-[4px] border-b-transparent hover:border-b-[#3C51A3]">
                                        <div className="overflow-hidden rounded-lg relative">
                                            <Image src={'https://dummyimage.com/600x750/ddd/fff'} className="" width={600} height={750} alt="slider 1" />
                                            <div className="absolute bottom-0 w-full px-10 py-5 text-white z-10">
                                                <h4 className="font-semibold text-[22px] leading-[20px]">Engineering Consultancy</h4>
                                                <span className="text-xs font-medium">Featured Service</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-[30%] z-0 bg-gradient-to-b from-transparent to-black opacity-85 scale-125 blur-md"></div>
                                        </div>

                                        <div className="p-5 px-10 text-sm flex flex-col gap-5">
                                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo ipsum</p>
                                            <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] opacity-0 group-hover:opacity-100 duration-100 " />
                                        </div>
                                    </div>
                                </div>

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden xl:flex"/>
                    <CarouselNext className="hidden xl:flex"/>
                </Carousel>
            </div>

          
        </div>
    )
}

export default FeaturedServices;