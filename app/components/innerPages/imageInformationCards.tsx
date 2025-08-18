"use client";

import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { useEffect, useRef } from "react";

interface InfoItemProps {
    icon?: string;
    title?: string;
    content?: string;
}

interface ImageInformationCardsProps {
    imageUrl?: string;
    imageDetailedCards?: InfoItemProps[];
}

const ImageInformationCards: React.FC<ImageInformationCardsProps> = ({
    imageUrl,
    imageDetailedCards,
}) => {
    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };

    const rowItems: InfoItemProps[] = typeof imageDetailedCards === 'string' ? JSON.parse(imageDetailedCards) : (imageDetailedCards || []);

    return (
        <div className="relative max-w-[1400px] mx-auto p-2 overflow-hidden mb-20">
            <Image src={imageUrl || 'https://dummyimage.com/1200x500/ddd/fff'} alt="" width={1200} height={800} className="absolute left-0 top-0 w-full h-full object-cover z-0" />
            {rowItems && rowItems?.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 divide-x-[1px] bg-white relative z-10 mb-[38vh]">
                {rowItems?.map((d, i) => (
                    <div key={i} className="p-16 flex flex-col gap-8">
                        {d?.icon && <div className="w-[60px]">
                            <Image src={d?.icon} alt={d?.title || ''} width={100} height={100} className="w-full" />
                        </div>}

                        {d?.title && <h4 className="font-headingFontExtraBold font-bold text-xs leading-snug" dangerouslySetInnerHTML={{__html: d?.title || ''}}></h4>}

                        {d?.content && <p dangerouslySetInnerHTML={{ __html: d?.content || ''}}></p>}
                    </div>
                ))}

            </div>
            }

            <div className="absolute left-0 bottom-0 w-full h-2/6 bg-gradient-to-b from-[#2741A8]/0 to-[#1B3B80] blur-sm scale-105"></div>
        </div>
    )
}

export default ImageInformationCards;