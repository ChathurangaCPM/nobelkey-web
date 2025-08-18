"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Percent, Plus } from "lucide-react";
import { useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReadMoreButton from "@/app/components/common/readMoreButton";
import Link from "next/link";

interface ProjectItemsProps {
    imageUrl?: string,
}

interface ProjectOverviewProps {
    content?: string;
    projectSliderImages?: ProjectItemsProps[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
    projectSliderImages,
    content
}) => {
    const rowItems: ProjectItemsProps[] = typeof projectSliderImages === 'string' ? JSON.parse(projectSliderImages) : (projectSliderImages || []);
    
    // State to track current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to go to previous image
    const goToPrevious = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? rowItems.length - 1 : prevIndex - 1
        );
    };

    // Function to go to next image
    const goToNext = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === rowItems.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative max-w-[1400px] mx-auto mt-20">
            <div className="relative">
                {rowItems && rowItems?.length > 0 && (
                    <Image 
                        src={rowItems[currentImageIndex]?.imageUrl || ''} 
                        alt={`Project image ${currentImageIndex + 1}`} 
                        width={1800} 
                        height={1700}
                        className="transition-opacity duration-300 ease-in-out"
                    />
                )}
            </div>

            <div className="flex flex-col lg:flex-row items-start relative lg:-top-[170px] md:-mb-[170px]">
                <div className="flex w-full lg:w-[150px] items-center flex-row lg:flex-col  divide-y-[1px] divide-x-[1px] lg:divide-x-0 border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-black/20 lg:border-white/20 divide-black/20 lg:divide-white/20">
                    <button 
                        onClick={goToPrevious}
                        className="px-0 lg:px-10 flex-1 flex items-center justify-center py-2 lg:py-5 transition-all ease-in-out duration-150 hover:bg-white/10"
                        disabled={rowItems.length <= 1}
                    >
                        <ChevronLeft size={45} strokeWidth={1} className="text-black lg:text-white"/>
                    </button>
                    <button 
                        onClick={goToNext}
                        className="px-0 lg:px-10 flex-1 flex items-center justify-center py-2 lg:py-5 transition-all ease-in-out duration-150 hover:bg-white/10"
                        disabled={rowItems.length <= 1}
                    >
                        <ChevronRight size={45} strokeWidth={1} className="text-black lg:text-white"/>
                    </button>
                </div>
                <div className="bg-white p-5 lg:p-20">
                    {content && (
                        <div
                            className="rich-content max-w-none text-gray-700 leading-relaxed
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-0 [&_h1]:leading-tight
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-5 [&_h2]:mt-2 [&_h2]:leading-tight
                [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-2 [&_h3]:leading-tight
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mb-3 [&_h4]:mt-2 [&_h4]:leading-tight
                [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-gray-900 [&_h5]:mb-3 [&_h5]:mt-2 [&_h5]:leading-tight
                [&_h6]:text-base [&_h6]:font-semibold [&_h6]:text-gray-900 [&_h6]:mb-2 [&_h6]:mt-2 [&_h6]:leading-tight
                [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed
                [&_ul]:list-none [&_ul]:mb-4 [&_ul]:pl-0 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:pl-4 [&_ol]:space-y-2
                [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:flex [&_li]:items-start [&_li]:gap-2
                [&_ul_li]:before:content-[''] [&_ul_li]:before:inline-block [&_ul_li]:before:w-6 [&_ul_li]:before:h-6 [&_ul_li]:before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTkgMTggNiA2IDYtNiIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDEyIDEyKSIvPgo8L3N2Zz4K')] [&_ul_li]:before:bg-no-repeat [&_ul_li]:before:bg-center [&_ul_li]:before:bg-contain [&_ul_li]:before:flex-shrink-0 [&_ul_li]:before:mt-0.5
                [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:transition-colors [&_a]:duration-200
                [&_strong]:font-bold [&_strong]:text-gray-900
                [&_em]:italic
                [&_u]:underline
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:mb-4 [&_blockquote]:bg-gray-50 [&_blockquote]:italic [&_blockquote]:text-gray-600
                [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-4 [&_pre]:overflow-x-auto
                [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:mb-4
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:mb-4
                [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-gray-100 [&_th]:font-semibold [&_th]:text-left
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2
                [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-8"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectOverview;