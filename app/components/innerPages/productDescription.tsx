"use client";

import Image from "next/image";
import ReadMoreButton from "../common/readMoreButton";
import { useEffect, useRef } from "react";

interface InfoItemProps {
    title?: string;
    description?: string;
}

interface ProductDescriptionProps {
    mainTitle?: string;
    content?: string;
    itemContent?: InfoItemProps[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
    mainTitle,
    content,
    itemContent,
}) => {
    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };

    const rowItems: InfoItemProps[] = typeof itemContent === 'string' ? JSON.parse(itemContent) : (itemContent || []);

    return (
        <div className="relative max-w-[1000px] mx-auto p-2 overflow-hidden mb-20 flex flex-col gap-5 px-5 md:px-0">
            {mainTitle && <h3 className="font-extrabold text-4xl mb-5" dangerouslySetInnerHTML={{ __html: mainTitle || '' }}></h3>}
            {content && <p dangerouslySetInnerHTML={{ __html: processContent(content || '') }}></p>}
            {rowItems && rowItems?.length > 0 && rowItems?.map((d, i) => (
                <div key={i} className="flex flex-col gap-3 border-b-[1px] py-5">
                    <h3 className="text-lg font-extrabold" dangerouslySetInnerHTML={{ __html: processContent(d?.title || '') }}></h3>
                    <p dangerouslySetInnerHTML={{ __html: processContent(d?.description || '') }}></p>
                </div>
            ))}
        </div>
    )
}

export default ProductDescription;