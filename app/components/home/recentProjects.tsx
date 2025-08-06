import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


interface RecentProjectsProps {
    imageUrl?: string;
    alt?: string,
    carImage?: string
}

const RecentProjects: React.FC<RecentProjectsProps> = ({
    imageUrl,
    alt,
    carImage
}) => {
    return (
        <div className="relative pb-12">
            <div className="relative bg-[#3C51A3] flex justify-end overflow-hidden">
                <div className="w-2/3 flex justify-end -mb-1 overflow-hidden">
                    <Image src="/images/Recent.svg" alt="recent-text" className="block w-full" width={500} height={300} />
                </div>
            </div>

            <div className="w-11/12 xl:max-w-[1400px] mx-auto flex flex-col justify-between py-20 gap-4">
                <div className="xl:w-[70%]">
                    <div className="relative pl-4 xl:max-w-[60%]">
                        <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                        <h1 className="text-[22px] xl:max-w-[70%] font-headingFontExtraBold leading-[32px] font-extrabold">Comprehensive Engineering Solutions & Innovation</h1>
                    </div>
                </div>
                <p className="xl:max-w-[30%] font-normal">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi impedit dolor ex non maiores omnis</p>
                <ReadMoreButton />
            </div>

            <div className="w-full px-5 xl:px-0 md:w-10/12 xl:max-w-[1400px] mx-auto gap-3 md:mb-10">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 lg:basis-1/3 pb-5">
                                <Link href={'/'} className="border-[1px] border-black/10 rounded-lg overflow-hidden shadow-xl shadow-black/5 bg-white block group">
                                    <div className="p-8 md:p-16 flex flex-col gap-5">
                                        <h3 className="font-headingFontExtraBold font-bold text-[15px]">Comprehensive Electrical Design for a New Power Plant</h3>
                                        <p className="text-sm">Designed and implemented a 5MW solar power system with integrated storage for a major industrial facility, enhancing energy independence.</p>
                                        <div className="font-bold text-sm">Colombo, Sri Lanka</div>

                                        <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <Image src={'https://dummyimage.com/600x350/ddd/fff'} className="w-full" width={600} height={350} alt="slider 1" />
                                    </div>

                                </Link>

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

export default RecentProjects;