import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SolutionsCardsProps {
    image?: string;
    title?: string;
    tagline?: string;
    link?: string;
    description?: string;
}

interface SolutionsCardSectionProps {
    isAdmin?: boolean;
    solutionCardsRepeater?: SolutionsCardsProps[];
}

const SolutionsCardSection: React.FC<SolutionsCardSectionProps> = ({
    solutionCardsRepeater,
    isAdmin
}) => {

    const rowItems: SolutionsCardsProps[] = typeof solutionCardsRepeater === 'string' ? JSON.parse(solutionCardsRepeater) : (solutionCardsRepeater || []);

    return (
        <div className="mb-20">
            <div className="border-t-[1px] border-b-[1px]56">
                {rowItems && rowItems?.length > 0 && <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 ">
                    {rowItems?.map((d, i) => (
                        <Link href={d?.link || '#'} key={i} className={`${isAdmin ? 'pointer-events-none' : ''}`}>
                            <div className="p-5 xl:p-14 xl:pb-0">
                                <div className="transition-all group lg:pb-10 ease-in-out duration-100 border-b-[4px] border-b-transparent hover:border-b-[#3C51A3]">
                                    <div className="overflow-hidden rounded-lg relative">
                                        <Image src={d?.image || 'https://dummyimage.com/600x750/ddd/fff'} className="" width={600} height={750} alt={d?.title || ''} />
                                        <div className="absolute bottom-0 w-full px-10 py-5 text-white z-10">
                                            <h4 className="font-semibold text-[22px] leading-[20px]">{d?.title}</h4>
                                            {d?.tagline && <span className="text-xs font-medium">{d?.tagline}</span>}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-[30%] z-0 bg-gradient-to-b from-transparent to-black opacity-85 scale-125 blur-md"></div>
                                    </div>

                                    <div className="p-5 px-10 text-sm flex flex-col gap-5">
                                        <p>{d?.description}</p>
                                        <ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] lg:opacity-0 lg:group-hover:opacity-100 duration-100 " />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default SolutionsCardSection;