import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Percent, Plus } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReadMoreButton from "@/app/components/common/readMoreButton";
import Link from "next/link";

interface ProjectItemsProps {
    imageUrl?: string,
    title?: string,
    link?: string,
    description?: string,
    location?: string,
}

interface ProjectListingProps {
    projectItems?: ProjectItemsProps[];
}

const ProjectListing: React.FC<ProjectListingProps> = ({
    projectItems,
}) => {

    const rowItems: ProjectItemsProps[] = typeof projectItems === 'string' ? JSON.parse(projectItems) : (projectItems || []);
    
    return (
        <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 px-5 lg:px-0 lg:grid-cols-3 gap-4 mb-10">
            {rowItems && rowItems?.length > 0 && rowItems?.map((d, i) => (
                <Link key={i} href={d?.link || '#'} className={'border-[1px] rounded-md overflow-hidden shadow-md transition-all ease-in-out duration-150 hover:shadow-lg hover:scale-[1.01]'}>
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
            ))}
        </div>
    )
}

export default ProjectListing;