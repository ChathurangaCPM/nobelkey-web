"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbSegment {
    label: string;
    href: string;
    isCurrentPage: boolean;
}

interface InnerBannerProps {
    isAdmin?: boolean;
    backgroundImage?: string;
    mainTitle?: string;
    subLine?: string;
    customLabels?: Record<string, string>; // Custom labels for specific paths
}

const InnerBanner: React.FC<InnerBannerProps> = ({
    isAdmin,
    backgroundImage,
    mainTitle,
    subLine,
    customLabels = {}
}) => {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        // Split the pathname into segments
        const segments = pathname.split('/').filter(Boolean);
        
        // Always start with Home
        const breadcrumbItems: BreadcrumbSegment[] = [
            { label: "Home", href: "/", isCurrentPage: false }
        ];

        // Generate breadcrumbs for each segment
        segments.forEach((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');
            const isCurrentPage = index === segments.length - 1;
            
            // Format the segment label
            let label = segment;
            
            // Check for custom labels first
            if (customLabels[segment]) {
                label = customLabels[segment];
            } else {
                // Default formatting: replace hyphens/underscores with spaces and capitalize
                label = segment
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());
            }

            breadcrumbItems.push({
                label,
                href,
                isCurrentPage
            });
        });

        // If we're on the home page, mark it as current
        if (segments.length === 0) {
            breadcrumbItems[0].isCurrentPage = true;
        }

        return breadcrumbItems;
    }, [pathname, customLabels]);

    return (
        <div className="relative pb-[180px] md:pb-[80px]">
            <Image 
                src={backgroundImage || 'https://dummyimage.com/1920x300/b6b6b6/fff'} 
                width={1920} 
                height={300} 
                alt="inner-banner-image" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0" 
            />
            <div className={`flex flex-col items-center justify-center gap-12 ${!isAdmin ? 'pt-[75px]' : ''} relative z-10 text-white pb-20 w-full opacity-90`}>
                <div className="bg-gradient-to-t to-blue-900 from-[#192c72] absolute left-0 top-0 w-full h-full z-10"></div>
                <div className="border-b-[1px] border-white/20 w-full text-center relative z-20">
                    <Breadcrumb>
                        <BreadcrumbList className="text-center justify-center">
                            {breadcrumbs.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <BreadcrumbItem>
                                        {item.isCurrentPage ? (
                                            <BreadcrumbPage className="text-white/50 py-5">
                                                {item.label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link 
                                                    href={item.href}
                                                    className="py-5 text-white transition-all ease-in-out duration-150 hover:underline hover:text-white"
                                                >
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator className="text-white" />
                                    )}
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex items-center justify-center gap-2 flex-col relative z-20 px-5 md:px-0">
                    {mainTitle && <h1 className="font-extrabold text-4xl leading-snug text-center">{mainTitle}</h1>}
                    {subLine && <p>{subLine}</p>}
                </div>
            </div>
        </div>
    );
};

export default InnerBanner;