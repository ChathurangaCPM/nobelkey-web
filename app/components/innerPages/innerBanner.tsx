import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";

interface InnerBannerProps {
    isAdmin?: boolean;
    backgroundImage?: string;
    mainTitle?: string;
    subLine?: string;
}

const InnerBanner: React.FC<InnerBannerProps> = ({
    isAdmin,
    backgroundImage,
    mainTitle,
    subLine
}) => {
    return (
        <div className="relative pb-[80px]">
            <Image src={backgroundImage || 'https://dummyimage.com/1920x300/b6b6b6/fff'} width={1920} height={300} alt="inner-banner-image" className="absolute left-0 top-0 w-full h-full object-cover z-0" />
            <div className={`flex flex-col items-center justify-center gap-12 ${!isAdmin ? 'pt-[75px]' : ''} relative z-10 text-white pb-20 w-full opacity-90 `}>
                <div className="bg-gradient-to-t to-blue-900 from-[#192c72] absolute left-0 top-0 w-full h-full z-10"></div>
                <div className="border-b-[1px] border-white/20 w-full text-center relative z-20">
                    <Breadcrumb>
                        <BreadcrumbList className="text-center justify-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="py-5 text-white transition-all ease-in-out duration-150 hover:underline hover:text-white">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-white"/>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components" className="py-5 text-white transition-all ease-in-out duration-150 hover:underline hover:text-white">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-white"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white/50">Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex items-center justify-center gap-2 flex-col relative z-20">
                    {mainTitle && <h1 className="font-extrabold text-4xl leading-snug">{mainTitle}</h1>}
                    {subLine && <p>{subLine}</p>}
                </div>
            </div>
        </div>
    )
}

export default InnerBanner;