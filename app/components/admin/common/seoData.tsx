import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SEOPreview from "./seoPreview";
import { useState, useEffect } from "react";
import OgDataPreview from "./ogDataPreview";
import ImageSelector from "../imageSelector";

interface SEODataProps {
    title?: string;
    description?: string;
    onSave?: (data: {
        basicSeo: BasicSeoData;
        ogSeo: OgSeoData;
    }) => void;
    initialData?: {
        basicSeo?: BasicSeoData;
        ogSeo?: OgSeoData;
    };
}

interface BasicSeoData {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    robots?: string;
    viewport?: string;
    author?: string;
}

interface OgSeoData {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    twitterCard?: string;
    twitterCreator?: string;
}

interface ImageType {
    url: string;
    alt: string;
}

const DEFAULT_VIEWPORT = "width=device-width, initial-scale=1.0";
const DEFAULT_ROBOTS = "index, follow";

const SEOData: React.FC<SEODataProps> = ({
    title: initialTitle,
    description: initialDescription,
    onSave,
    initialData
}) => {
    const [basicSeo, setBasicSeo] = useState<BasicSeoData>({
        title: initialTitle,
        description: initialDescription,
        viewport: DEFAULT_VIEWPORT,
        robots: DEFAULT_ROBOTS,
        ...initialData?.basicSeo
    });

    const [ogSeo, setOgSeo] = useState<OgSeoData>({
        title: initialTitle,
        description: initialDescription,
        ...initialData?.ogSeo
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        // Update SEO data when initial props change
        if (initialTitle || initialDescription) {
            setBasicSeo(prev => ({
                ...prev,
                title: initialTitle || prev.title,
                description: initialDescription || prev.description
            }));
            setOgSeo(prev => ({
                ...prev,
                title: initialTitle || prev.title,
                description: initialDescription || prev.description
            }));
        }
    }, [initialTitle, initialDescription]);

    const handleBasicSeoChange = (
        field: keyof BasicSeoData,
        value: string
    ) => {
        setBasicSeo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOgSeoChange = (
        field: keyof OgSeoData,
        value: string
    ) => {
        setOgSeo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const copyFromBasic = () => {
        setOgSeo(prev => ({
            ...prev,
            title: basicSeo.title,
            description: basicSeo.description
        }));
    };

    useEffect(() => {
        if (onSave) {
            onSave({
                basicSeo,
                ogSeo
            });
        }
    }, [ogSeo, basicSeo])

    
    useEffect(() => {
        if (initialData) {
            // Update basicSeo with all available fields
            setBasicSeo(prevState => ({
                ...prevState,
                title: initialData.basicSeo?.title || initialTitle || prevState.title,
                description: initialData.basicSeo?.description || initialDescription || prevState.description,
                keywords: initialData.basicSeo?.keywords || prevState.keywords,
                canonicalUrl: initialData.basicSeo?.canonicalUrl || prevState.canonicalUrl,
                robots: initialData.basicSeo?.robots || DEFAULT_ROBOTS,
                viewport: initialData.basicSeo?.viewport || DEFAULT_VIEWPORT,
                author: initialData.basicSeo?.author || prevState.author
            }));
    
            // Update ogSeo with all available fields
            setOgSeo(prevState => ({
                ...prevState,
                title: initialData.ogSeo?.title || initialTitle || prevState.title,
                description: initialData.ogSeo?.description || initialDescription || prevState.description,
                image: initialData.ogSeo?.image || prevState.image,
                type: initialData.ogSeo?.type || prevState.type,
                url: initialData.ogSeo?.url || prevState.url,
                siteName: initialData.ogSeo?.siteName || prevState.siteName,
                locale: initialData.ogSeo?.locale || prevState.locale,
                twitterCard: initialData.ogSeo?.twitterCard || prevState.twitterCard,
                twitterCreator: initialData.ogSeo?.twitterCreator || prevState.twitterCreator
            }));
        }
    }, [initialData, initialTitle, initialDescription]);

    return (
        <div className="flex flex-col gap-4 p-5 border-[1px] mt-3 rounded-md">
            {/* Basic SEO Section */}
            <div className="mb-2">
                <h3 className="text-2xl font-bold">SEO Data</h3>
                <p className="text-xs text-muted-foreground">
                    Configure your pages SEO settings to improve visibility in search results
                </p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <Label className="font-semibold">SEO Page Title</Label>
                        <Input
                            type="text"
                            placeholder="SEO Title"
                            value={basicSeo.title || ""}
                            onChange={(e) => handleBasicSeoChange("title", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Keep your title between 50-60 characters for optimal display in search results
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Meta Description</Label>
                        <Textarea
                            placeholder="SEO Description"
                            value={basicSeo.description || ""}
                            onChange={(e) => handleBasicSeoChange("description", e.target.value)}
                            rows={5}
                        />
                        <p className="text-xs text-muted-foreground">
                            Aim for 150-160 characters to optimize your description for search results
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Keywords</Label>
                        <Textarea
                            placeholder="Enter keywords separated by commas"
                            value={basicSeo.keywords || ""}
                            onChange={(e) => handleBasicSeoChange("keywords", e.target.value)}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            Add relevant keywords separated by commas (e.g., web development, React, Next.js)
                        </p>
                    </div>

                    {showAdvanced && (
                        <>
                            <div className="space-y-2">
                                <Label className="font-semibold">Canonical URL</Label>
                                <Input
                                    type="text"
                                    placeholder="https://example.com/page"
                                    value={basicSeo.canonicalUrl || ""}
                                    onChange={(e) => handleBasicSeoChange("canonicalUrl", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold">Robots</Label>
                                <Input
                                    type="text"
                                    placeholder="index, follow"
                                    value={basicSeo.robots || ""}
                                    onChange={(e) => handleBasicSeoChange("robots", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold">Author</Label>
                                <Input
                                    type="text"
                                    placeholder="Author name"
                                    value={basicSeo.author || ""}
                                    onChange={(e) => handleBasicSeoChange("author", e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full"
                    >
                        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                    </Button>
                </div>

                <div className="flex-1">
                    <SEOPreview data={basicSeo} />
                </div>
            </div>

            <hr className="my-6" />

            {/* Open Graph Section */}
            <div className="mb-4">
                <h3 className="text-xl font-bold">Open Graph (OG) Data</h3>
                <p className="text-xs text-muted-foreground">
                    Configure how your content appears when shared on social media
                </p>
                <Button
                    variant="secondary"
                    onClick={copyFromBasic}
                    className="mt-2"
                >
                    Copy from Basic SEO
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <Label className="font-semibold">OG Image</Label>
                        <ImageSelector
                            value={ogSeo.image || ""}
                            onChange={(images: ImageType[]) => {
                                if (images.length > 0) {
                                    handleOgSeoChange("image", images[0].url);
                                }
                            }}
                            removeImage={() => handleOgSeoChange("image", "")}
                        />
                        <p className="text-xs text-muted-foreground">
                            Recommended size: 1200x630 pixels for optimal display
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">OG Title</Label>
                        <Input
                            type="text"
                            placeholder="Social Media Title"
                            value={ogSeo.title || ""}
                            onChange={(e) => handleOgSeoChange("title", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">OG Description</Label>
                        <Textarea
                            placeholder="Social Media Description"
                            value={ogSeo.description || ""}
                            onChange={(e) => handleOgSeoChange("description", e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">OG Type</Label>
                        <Input
                            type="text"
                            placeholder="website"
                            value={ogSeo.type || ""}
                            onChange={(e) => handleOgSeoChange("type", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Site Name</Label>
                        <Input
                            type="text"
                            placeholder="Your Site Name"
                            value={ogSeo.siteName || ""}
                            onChange={(e) => handleOgSeoChange("siteName", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Twitter Card</Label>
                        <Input
                            type="text"
                            placeholder="summary_large_image"
                            value={ogSeo.twitterCard || ""}
                            onChange={(e) => handleOgSeoChange("twitterCard", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Twitter Creator</Label>
                        <Input
                            type="text"
                            placeholder="@username"
                            value={ogSeo.twitterCreator || ""}
                            onChange={(e) => handleOgSeoChange("twitterCreator", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <OgDataPreview data={ogSeo} />
                </div>
            </div>
        </div>
    );
};

export default SEOData;