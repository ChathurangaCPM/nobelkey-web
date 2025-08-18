"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface CommonRepeaterProps {
    title?: string;
    content?: string;
}

interface DocProps {
    fileName?: string;
    fileUrl?: string;
}

interface ProductTableProps {
    isAdmin?: boolean;
    featuresBenefits?: CommonRepeaterProps[];
    basicInformation?: CommonRepeaterProps[];
    documents?: DocProps[];
}

const ProductTable: React.FC<ProductTableProps> = ({
    featuresBenefits,
    basicInformation,
    documents,
    isAdmin
}) => {
    const [activeTab, setActiveTab] = useState<string>('fb');
    const [arrayData, setArrayData] = useState<(CommonRepeaterProps | DocProps)[]>([]);


    const featuresBenefitsItems: CommonRepeaterProps[] = typeof featuresBenefits === 'string' ? JSON.parse(featuresBenefits) : (featuresBenefits || []);
    const basicInformationItems: CommonRepeaterProps[] = typeof basicInformation === 'string' ? JSON.parse(basicInformation) : (basicInformation || []);
    const documentsItems: DocProps[] = typeof documents === 'string' ? JSON.parse(documents) : (documents || []);

    const handlerTabChange = (type: string) => {
        if (isAdmin) {
            return false;
        }
        setActiveTab(type);

        if (type === 'fb') {
            setArrayData(featuresBenefitsItems);
        } else if (type === 'bi') {
            setArrayData(basicInformationItems);
        } else {
            setArrayData(documentsItems);
        }
    }

    useEffect(() => {
        setArrayData(featuresBenefitsItems);
    }, [])



    return (
        <div className="mb-10 max-w-[1400px] mx-auto ">

            <ScrollArea className="w-full whitespace-nowrap md:hidden">
                <div className="flex w-full gap-0 border-t-[1px] border-b-[1px] text-sm font-semibold mb-1">
                    <button className={`p-5 text-center w-full border-b-2 ${activeTab === "fb" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'} border-r-[1px] border-r-black/15`} onClick={() => handlerTabChange('fb')}>Featured & Benefits</button>
                    <button className={`p-5 text-center w-full border-b-2 ${activeTab === "bi" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'} border-r-[1px] border-r-black/15`} onClick={() => handlerTabChange('bi')}>Basic Information</button>
                    <button className={`p-5 text-center w-full border-b-2 ${activeTab === "dc" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'}`} onClick={() => handlerTabChange('dc')}>Documents</button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="hidden md:grid grid-cols-3 gap-0  border-t-[1px] border-b-[1px] text-sm font-semibold mb-1">
                <button className={`p-5 text-center w-full border-b-2 ${activeTab === "fb" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'} border-r-[1px] border-r-black/15`} onClick={() => handlerTabChange('fb')}>Featured & Benefits</button>
                <button className={`p-5 text-center w-full border-b-2 ${activeTab === "bi" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'} border-r-[1px] border-r-black/15`} onClick={() => handlerTabChange('bi')}>Basic Information</button>
                <button className={`p-5 text-center w-full border-b-2 ${activeTab === "dc" ? 'border-b-blue-700 text-black' : 'border-transparent text-muted-foreground'}`} onClick={() => handlerTabChange('dc')}>Documents</button>
            </div>


            {(arrayData && arrayData.length > 0) && (activeTab === 'fb' || activeTab === 'bi') && <div className="flex flex-col gap-1">
                {arrayData?.map((d, i) => (
                    <div key={i} className="flex gap-1 font-semibold text-sm">
                        <p className="w-4/12 bg-[#DDDDDD]/45 p-3 py-4">{'title' in d ? d.title : ''}</p>
                        <p className="w-8/12 bg-[#3C51A3]/25 p-3 py-4">{'content' in d ? d.content : ''}</p>
                    </div>
                ))}
            </div>}


            {(arrayData && arrayData.length > 0) && activeTab === 'dc' && <div className="flex flex-col gap-1">
                {arrayData?.map((documentsRowItems, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <FileText size={50} strokeWidth={1} className="text-blue-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                                {'fileName' in documentsRowItems ? documentsRowItems.fileName || 'Document' : 'Document'}
                            </p>
                            <p className="text-xs text-gray-500">Attached file</p>
                        </div>
                        <button
                            onClick={() => {
                                if ('fileUrl' in documentsRowItems && documentsRowItems.fileUrl) {
                                    window.open(documentsRowItems.fileUrl, '_blank');
                                }
                            }}
                            className="flex w-max items-center border border-black/10 p-[5px] rounded-[30px] relative group overflow-hidden transition-all ease-in-out duration-300"
                        >
                            <span className="px-6 font-semibold capitalize text-sm transition-all z-20 relative ease-in-out duration-300 group-hover:text-white">{"Download"}</span>

                            <div className="w-[40px] h-[40px] rounded-full bg-[#3C51A3] grid place-content-center transition-all duration-300 ease-in-out group-hover:bg-white z-30">
                                <Download size={18} className="text-white transition-all ease-in-out duration-300 group-hover:text-[#3C51A3]" />
                            </div>

                            <div className="
                                absolute 
                                right-[5px] 
                                top-[5px] 
                                w-[40px] 
                                h-[40px] 
                                opacity-0 
                                rounded-full 
                                bg-[#3C51A3] 
                                z-10 
                                transition-all 
                                delay-100 
                                ease-in-out 
                                duration-300 
                                group-hover:opacity-75
                                group-hover:scale-[10]
                                "></div>
                        </button>
                    </div>))}
            </div>}



        </div>
    )
}

export default ProductTable;