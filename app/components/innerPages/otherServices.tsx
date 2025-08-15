import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Percent, Plus } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReadMoreButton from "@/app/components/common/readMoreButton";

interface ServicesItems {
    imageUrl?: string,
    title?: string,
    tagline?: string,
    description?: string,
}

interface OtherServicesProps {
    mainTitle?: string;
    description?: string;
    link?: string;
    serviceItems?: ServicesItems[];
    innerPage?: ServicesItems[];
}

const OtherServices: React.FC<OtherServicesProps> = ({
    mainTitle,
    description,
    link,
    serviceItems,
    innerPage
}) => {

    const rowItems: ServicesItems[] = typeof serviceItems === 'string' ? JSON.parse(serviceItems) : (serviceItems || []);
    return (
        <div className="relative border-b-[1px] border-black/10 pt-10">
            <div className="text-center border-b-[1px] border-black/10 pb-10">
                <h2 className="text-[35px] font-extrabold leading-[32px]">{mainTitle}</h2>
            </div>



            <div className="px-0 pt-5 xl:pt-0 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full container mx-auto"
                >
                    <CarouselContent>
                        {rowItems && rowItems.map((d, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 lg:basis-1/3 xl:border-r-[1px] border-black/10 [&:nth-child(3n)]:border-r-0">
                                <div className="p-5 xl:p-14 xl:pb-0">
                                    <div className="transition-all group pb-10 ease-in-out duration-100 border-b-[4px] border-b-transparent hover:border-b-[#3C51A3]">
                                        <div className="overflow-hidden rounded-lg relative">
                                            <Image src={d.imageUrl || 'https://dummyimage.com/600x750/ddd/fff'} className="" width={600} height={750} alt={d.title || ''} />
                                            <div className="absolute bottom-0 w-full px-10 py-5 text-white z-10">
                                                <h4 className="font-semibold text-[22px] leading-[20px]">{d.title}</h4>
                                                <span className="text-xs font-medium">{d.tagline}</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-[30%] z-0 bg-gradient-to-b from-transparent to-black opacity-85 scale-125 blur-md"></div>
                                        </div>

                                        <div className="p-5 px-10 text-sm flex flex-col gap-5">
                                            <p>{d.description}</p>
                                            <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] opacity-0 group-hover:opacity-100 duration-100 " />
                                        </div>
                                    </div>
                                </div>

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden xl:flex" />
                    <CarouselNext className="hidden xl:flex" />
                </Carousel>
            </div>


        </div>
    )
}

export default OtherServices;