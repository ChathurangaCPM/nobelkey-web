"use client";

import SEOData from "@/app/components/admin/common/seoData";
import CreateNewContent from "@/app/components/admin/pages/createNewContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Component } from "@/lib/componentTypes";
import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useState, useEffect } from "react";
import { toast } from "sonner";

interface CreateNewPageProps {
    data?: {
        _id?: string;
        title?: string;
        slug?: string;
        components?: Component[];
        seoData?: SeoDataType;
        parent?: string | { _id: string; title: string; slug: string };
    };
}

interface PageOption {
    _id: string;
    title: string;
    slug: string;
}

// Define a type for SEO data
interface SeoDataType {
    basicSeo?: BasicSeoData;
    ogSeo?: OgSeoData;
}

interface BasicSeoData {
    title?: string;
    description?: string;
    keywords?: string;
}

interface OgSeoData {
    title?: string;
    description?: string;
    image?: string;
}

const CreateNewPage: React.FC<CreateNewPageProps> = ({
    data
}) => {
    const [title, setTitle] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [componentData, setComponentData] = useState<Component[]>([]);
    const [seoData, setSeoData] = useState<SeoDataType>({});
    const [isCheckingSlug, setIsCheckingSlug] = useState<boolean>(false);
    const [slugExists, setSlugExists] = useState<boolean>(false);
    const [slugChecked, setSlugChecked] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [parentPage, setParentPage] = useState<string>('');
    const [availablePages, setAvailablePages] = useState<PageOption[]>([]);
    const [isLoadingPages, setIsLoadingPages] = useState<boolean>(false);
    const isEdit = Boolean(data && Object.keys(data).length !== 0);

    // Fetch available pages for parent selection
    useEffect(() => {
        const fetchPages = async () => {
            setIsLoadingPages(true);
            try {
                const response = await fetch('/api/admin/page?delete=false');
                const result = await response.json();
                if (result.success) {
                    // Filter out current page if editing
                    const filteredPages = result.data.filter((page: PageOption) => 
                        isEdit ? page._id !== data?._id : true
                    );
                    setAvailablePages(filteredPages);
                }
            } catch (error) {
                console.error('Error fetching pages:', error);
            } finally {
                setIsLoadingPages(false);
            }
        };

        fetchPages();
    }, [isEdit, data?._id]);

    // Update slug when title changes (always keep it as base slug)
    useEffect(() => {
        if (title) {
            const baseSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setSlug(baseSlug);
        }
    }, [title]);

    useEffect(() => {
        const checkSlug = async () => {
            if (!slug) {
                setSlugChecked(true); // Set to true if no slug
                return;
            }
            
            setIsCheckingSlug(true);
            setSlugChecked(false); // Set to false while checking
            try {
                const url = `/api/admin/page/check-slug?slug=${slug}${isEdit && data?._id ? `&excludeId=${data._id}` : ''}`;
                const response = await fetch(url);
                const responseData = await response.json();
                setSlugExists(responseData.exists || false);
                setSlugChecked(true); // Set to true after check completes
            } catch (error) {
                console.error('Error checking slug:', error);
                setSlugChecked(true); // Set to true even if there's an error
            } finally {
                setIsCheckingSlug(false);
            }
        };

        const timeoutId = setTimeout(() => {
            checkSlug();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [slug]);

    const handleComponentChange = (components: Component[]) => {
        setComponentData(components);
    };

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newSlug = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setSlug(newSlug);
        // Slug check will be triggered by the useEffect
    };

    const handleCreatePage = async () => {
        if (slugExists) {
            alert('Please choose a different URL slug as this one already exists.');
            return;
        }

        if (!slugChecked) {
            alert('Please wait while we verify the URL slug.');
            return;
        }
        
        if (title === "") {
            alert('Title can not be empty.');
            return;
        }

        const pageData = {
            title,
            slug,
            components: componentData,
            seoData,
            type: "page" as const,
            parent: (parentPage && parentPage !== 'none') ? parentPage : null,
            ...(isEdit && data?._id ? { id: data._id } : {})
        };

        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/page/create', {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pageData),
            });

            if (!response.ok) throw new Error('Failed to create page');

            toast.success("Successfully Created!", {
                position: "top-center",
                richColors: true,
            });
        } catch (error) {
            console.error('Error creating page:', error);
            alert('Failed to create page. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSeoData = (seoData: SeoDataType) => {
        setSeoData(seoData);
    };

    useEffect(() => {
        if(data && Object.keys(data).length !== 0) {
            setTitle(data?.title || '');
            setSlug(data?.slug || '');
            setComponentData(data?.components || []);
            setSeoData(data?.seoData  || {});
            // Handle parent field - it could be a string ID or populated object
            const parentId = typeof data?.parent === 'object' && data?.parent?._id 
                ? data.parent._id 
                : (data?.parent as string) || 'none';
            setParentPage(parentId);
            setSlugChecked(true); // Initialize as checked for existing pages
        }
    }, [data]);

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">{isEdit ? "Update" : "Create New"} Page</h1>

            <div className="flex gap-5">
                <div className="flex-1 space-y-3">
                    <Input 
                        type="text" 
                        placeholder="Page title" 
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Parent Page (Optional)</label>
                        <Select value={parentPage} onValueChange={setParentPage}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingPages ? "Loading pages..." : "Select parent page"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Parent (Root Page)</SelectItem>
                                {availablePages.map((page) => (
                                    <SelectItem key={page._id} value={page._id}>
                                        {page.title} ({page.slug})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Input 
                            type="text"
                            placeholder="URL slug"
                            value={slug}
                            onChange={handleSlugChange}
                            className={slugExists ? 'border-red-500' : ''}
                        />
                        <div className="text-xs">
                            <span className="text-muted-foreground">
                                https://www.site.lk/<b>{(() => {
                                    if (parentPage && parentPage !== 'none') {
                                        const selectedParent = availablePages.find(page => page._id === parentPage);
                                        if (selectedParent) {
                                            return `${selectedParent.slug}/${slug}`;
                                        }
                                    }
                                    return slug;
                                })()}</b>
                            </span>
                        </div>
                        
                        {isCheckingSlug && (
                            <div className="text-sm text-muted-foreground">
                                Checking availability...
                            </div>
                        )}
                        
                        {slugChecked && slugExists && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    This URL is already in use. Please choose a different one.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {slugChecked && !slugExists && slug && (
                            <Alert>
                                <AlertDescription>
                                    This URL is available!
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <CreateNewContent 
                        data={componentData.map(comp => JSON.stringify(comp))} 
                        onChange={handleComponentChange}
                        editData={data?.components?.map(comp => JSON.stringify(comp))}
                    />

                    <SEOData onSave={handleSaveSeoData} title={title} initialData={data?.seoData}/>
                </div>

                <div className="w-[300px] sticky top-[100px]">
                    <Button 
                        className="w-full flex items-center gap-1"
                        onClick={handleCreatePage}
                        disabled={title === "" || isLoading}
                    >
                        {isLoading && <LoaderCircle size={15} className="animate-spin"/>}
                        {isEdit ? "Update" : "Create"} Page
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewPage;
