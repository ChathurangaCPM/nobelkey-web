"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Percent, Plus } from "lucide-react";
import { useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReadMoreButton from "@/app/components/common/readMoreButton";
import Link from "next/link";

interface ProjectItemsProps {
    title?: string;
    location?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

interface ProjectSliderProps {
    title?: string;
    projects?: ProjectItemsProps[];
}

const ProjectSlider: React.FC<ProjectSliderProps> = ({
    projects,
    title
}) => {

    const rowItems: ProjectItemsProps[] = typeof projects === 'string' ? JSON.parse(projects) : (projects || []);
    return (
        <div className="relative border-t-[1px] border-b-[1px] border-black/10 py-10">
            <div className="text-center pb-10">
                <h2 className="text-[35px] font-extrabold leading-[32px]">{title}</h2>
            </div>

            <div className="px-0 pt-5 xl:pt-0 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full px-1"
                >
                    <CarouselContent>
                        {rowItems && rowItems.map((d, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 lg:basis-1/3 ml-1">
                                <Link href={d?.link || '#'} className={'border-[1px]  block rounded-md overflow-hidden shadow-md transition-all ease-in-out duration-150 hover:shadow-lg'}>
                                    <div className="p-8 md:p-16 flex flex-col gap-5">
                                        <h3 className="font-headingFontExtraBold font-bold text-[15px]">{d?.title}</h3>
                                        <p className="text-sm">{d?.description}</p>
                                        <div className="font-bold text-sm">{d?.location}</div>

                                        <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <Image src={d?.imageUrl || 'https://dummyimage.com/600x350/ddd/fff'} className="w-full" width={600} height={350} alt={`project ${d?.title}`} />
                                    </div>
                                </Link>

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

export default ProjectSlider;