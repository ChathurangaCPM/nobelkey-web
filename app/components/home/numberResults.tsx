import Image from "next/image";
import { ArrowUpRight} from "lucide-react";
import * as LucideIcons from 'lucide-react';
interface NumberItem {
    id: string;
    number: string;
    icon: string;
    text: string;
}

interface NumberResultsProps {
    mainTitle?: string;
    description?: string;
    middleImage?: string;
    items?: NumberItem[] | string;
}


const NumberResults: React.FC<NumberResultsProps> = ({
    mainTitle,
    description,
    middleImage,
    items,
}) => {
    const rowItems: NumberItem[] = typeof items === 'string' ? JSON.parse(items) : (items || []);

    // Get the last item for special styling
    const lastItem = rowItems[rowItems.length - 1];
    const otherItems = rowItems.slice(0, -1);

    const renderIcon = (iconName: string, isLast: boolean = false) => {
        // Dynamically get the icon component from lucide-react
        const IconComponent = (LucideIcons as any)[iconName];

        // Fallback to Plus icon if the specified icon doesn't exist
        const FinalIcon = IconComponent || LucideIcons.Plus;

        const sizeClass = isLast ? "w-[50px] h-[50px] xl:w-[80px] xl:h-[80px]" : "w-[50px] h-[50px] xl:w-[100px] xl:h-[100px]";
        const strokeWidth = isLast ? 1.2 : 1;

        return <FinalIcon className={sizeClass} strokeWidth={strokeWidth} />;
    };

    return (
        <div className="relative bg-[#3C51A3] px-5 xl:px-0 py-20 text-white mb-[80px]">
            <div className="">
                {/* Header Section */}
                <div className="xl:absolute xl:left-[7.5vw] xl:top-[7vw] xl:w-[500px] flex flex-col gap-5">
                    {mainTitle && (
                        <div className="relative pl-4">
                            <div className="w-[5px] h-[92%] bg-[#7390FF] left-0 -top-[2px] absolute" />
                            <h1 className="text-[17px] max-w-[60%] font-headingFontExtraBold leading-[25px] font-extrabold">
                                {mainTitle}
                            </h1>
                        </div>
                    )}

                    {description && <p>{description}</p>}

                    <ArrowUpRight strokeWidth={2} size={50} />
                </div>

                {/* Middle Image */}
                {middleImage && (
                    <div className="xl:absolute xl:left-1/2 xl:-translate-x-1/2 bottom-0 z-10 pointer-events-none xl:w-[45vw]">
                        <Image
                            src={middleImage || "/images/number_image.png"}
                            width={800}
                            height={800}
                            alt=""
                            className="w-full"
                        />
                    </div>
                )}

                {/* Dynamic Regular Items */}
                {otherItems.map((item, index) => (
                    <div key={item.id} className="flex gap-3 justify-end relative overflow-hidden w-full md:w-10/12 xl:max-w-[1400px] mx-auto">
                        <div className="flex items-end w-full xl:max-w-[50%] border-b-[1px] border-white/10 justify-end group">
                            <div className="flex flex-1 xl:w-[60%] justify-end">
                                <div className="overflow-hidden flex items-baseline gap-2 text-[75px] xl:text-[180px] transition-all ease-in-out duration-500 group-hover:translate-y-0 xl:translate-y-8 font-barlow-condensed font-normal leading-[100px] xl:leading-[160px]">
                                    {item.number} {renderIcon(item.icon)}
                                </div>
                            </div>
                            <div className="text-right flex-1 xl:w-[40%] pb-5">
                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Last Item with Special Structure */}
                {lastItem && (
                    <div className="flex gap-3 justify-end relative overflow-hidden xl:mb-36">
                        <div className="w-full hidden xl:block absolute top-0 right-0 h-1/2 bg-gradient-to-b from-[#0f1a4285] to-gray-100/0 z-0"></div>

                        <div className="absolute left-0 top-0 w-full h-[1px] bg-white/15 z-20" />

                        <div className="w-[100%] hidden xl:block absolute z-0 pointer-events-none opacity-85">
                            <Image
                                src="/images/texts/noblekey_black.svg"
                                width={1800}
                                height={800}
                                alt="noblekey"
                                className="h-full left-0 w-auto top-0"
                            />
                        </div>

                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/15 z-20" />

                        <div className="w-full xl:max-w-[1400px] mx-auto flex justify-end relative z-40">
                            <div className="flex items-end w-full xl:max-w-[40%] justify-end group">
                                <div className="flex w-[60%]">
                                    <div className="overflow-hidden flex items-baseline gap-2 text-[75px] xl:text-[180px] transition-all ease-in-out duration-500 group-hover:translate-y-0 xl:translate-y-8 font-barlow-condensed font-normal leading-[100px] xl:leading-[160px]">
                                        {lastItem.number} {renderIcon(lastItem.icon, true)}
                                    </div>
                                </div>
                                <div className="text-right w-[40%] pb-5">
                                    <span dangerouslySetInnerHTML={{ __html: lastItem.text }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NumberResults;