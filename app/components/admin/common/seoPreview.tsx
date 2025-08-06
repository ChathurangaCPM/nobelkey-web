import Image from "next/image";

interface BasicSeoData {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    robots?: string;
    viewport?: string;
    author?: string;
}
interface SEOPreviewProps {
    data: BasicSeoData;
}

const SEOPreview: React.FC<SEOPreviewProps> = ({
    data,
}) => {
    return (
        <div className="p-10 rounded-lg shadow-lg font-sans max-w-lg">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 border-[1px] rounded-full flex items-center justify-center">
                    <Image src={'/images/logo-dark.png'} width={30} height={30} className="rounded-full" alt={""} />
                </div>
                <div className="font-sans">
                    <p>Site name</p>
                    <p className="text-xs">https://www.site.lk</p>
                </div>
            </div>
            <h3 className="text-[#1a0dab] text-xl">{data?.title || "Page title will display here"}</h3>
            {data?.description && <p className="text-gray-600 truncate line-clamp-3">{data?.description}</p>}
        </div>
    )
}

export default SEOPreview;