'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface BreadcrumbSegment {
    label: string;
    href: string;
    isLast: boolean;
}

const DynamicBreadcrumb = () => {
    const pathname = usePathname();

    // Function to generate breadcrumb segments from pathname
    const generateBreadcrumbs = (path: string): BreadcrumbSegment[] => {
        // Remove leading slash and split by '/'
        const segments = path.replace(/^\//, '').split('/');
        
        // Filter out empty segments
        const validSegments = segments.filter(segment => segment.length > 0);
        
        const breadcrumbs: BreadcrumbSegment[] = [];
        
        // Build breadcrumbs progressively
        validSegments.forEach((segment, index) => {
            const href = '/' + validSegments.slice(0, index + 1).join('/');
            const isLast = index === validSegments.length - 1;
            
            // Convert segment to readable label
            const label = formatSegmentLabel(segment, validSegments, index);
            
            breadcrumbs.push({
                label,
                href,
                isLast
            });
        });
        
        return breadcrumbs;
    };

    // Function to format segment labels
    const formatSegmentLabel = (segment: string, allSegments: string[], index: number): string => {
        // Handle specific route patterns
        const routeLabels: { [key: string]: string } = {
            'admin': 'Admin Panel',
            'theme-settings': 'Theme Settings',
            'media-library': 'Media Library',
            'manage-routes': 'Manage Routes',
            'pages': 'Pages',
            'bookings': 'Bookings',
            'contact': 'Contact',
            'vehicles': 'Vehicles',
            'header': 'Header',
            'footer': 'Footer',
            'home-page': 'Home Page',
            'email': 'Email',
            'locations': 'Locations',
            'new': 'New'
        };

        // Check if it's a known route
        if (routeLabels[segment]) {
            return routeLabels[segment];
        }

        // Handle dynamic routes (like IDs)
        if (segment.match(/^[0-9a-f]{24}$/)) {
            // MongoDB ObjectId pattern
            return 'Edit';
        }

        // Handle UUID patterns
        if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
            return 'Edit';
        }

        // Handle numeric IDs
        if (segment.match(/^\d+$/)) {
            return 'Edit';
        }

        // Default: capitalize and replace hyphens with spaces
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const breadcrumbs = generateBreadcrumbs(pathname);

    // Don't show breadcrumb if we're at the root admin page
    if (breadcrumbs.length <= 1) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <Fragment key={breadcrumb.href}>
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                            {breadcrumb.isLast ? (
                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={breadcrumb.href}>
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {!breadcrumb.isLast && (
                            <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
