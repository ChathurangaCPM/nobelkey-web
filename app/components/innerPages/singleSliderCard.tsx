import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SingleSliderCardsProps {
    image?: string;
}

interface SingleSliderCardSectionProps {
    isAdmin?: boolean;
    singleSliderRepeater?: SingleSliderCardsProps[];
}

const SingleSliderCardSection: React.FC<SingleSliderCardSectionProps> = ({
    singleSliderRepeater,
    isAdmin
}) => {

    const rowItems: SingleSliderCardsProps[] = typeof singleSliderRepeater === 'string' ? JSON.parse(singleSliderRepeater) : (singleSliderRepeater || []);


    return (
        <div className="mb-10 max-w-[1400px] mx-auto">
            <Carousel className="w-full">
                <CarouselContent>
                    {rowItems && rowItems.map((d, index) => (
                        <CarouselItem key={index}>
                            <div>
                                <Image src={d?.image || ""} width={1200} height={800} alt="" className="w-full"/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {!isAdmin && <CarouselPrevious />}
                {!isAdmin && <CarouselNext />}
                
            </Carousel>

        </div>
    )
}

export default SingleSliderCardSection;