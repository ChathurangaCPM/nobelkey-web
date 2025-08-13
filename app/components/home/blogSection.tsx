import Image from "next/image";
import BlogCard from "../common/blogCard";
import TopTagline from "../common/topTagline";
import ReadMoreButton from "../common/readMoreButton";
import Link from "next/link";

interface BlogItems {
    title?: string;
    url?: string;
    description?: string;
    publishData?: string;
}


interface BlogSectionProps {
    mainTitle?: string;
    link?: string;
    linkText?: string;
    blogItems?: BlogItems[]
}

const BlogSection: React.FC<BlogSectionProps> = ({
    mainTitle,
    link,
    linkText,
    blogItems
}) => {
    const rowItems: BlogItems[] = typeof blogItems === 'string' ? JSON.parse(blogItems) : (blogItems || []);

    return (
        <div className="overflow-hidden mb-20">
            <div className="relative bg-gradient-to-b from-[#FB8723]/0 to-[#ECECEC] overflow-hidden flex border-b-[1px] border-black/20">
                <div className="overflow-hidden -mb-1 -mt-1 w-full">
                    <Image src="/images/Inside.svg" alt="blog background" width={1400} height={500} className="w-6/12 object-cover" />
                </div>
            </div>

            <div className="w-full px-5 md:px-0 md:w-11/12 xl:max-w-[1400px] mx-auto py-20 border-b-[1px] border-black/15">
                <div className="w-[100%] flex flex-col gap-4">
                    {mainTitle && <div className="relative pl-4">
                        <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                        <h1 className="text-[18px] xl:w-[20%] font-headingFontExtraBold leading-[30px] font-extrabold">{mainTitle}</h1>
                    </div>}

                    {link && <ReadMoreButton url={link} title={linkText}/>}
                </div>
            </div>

             <div className="w-full md:w-11/12 xl:max-w-[1400px] mx-auto">
                {rowItems && rowItems.map((d, i) => (
                    <Link key={i} href={d?.url || '#'} className="flex lg:items-center flex-col lg:flex-row gap-5 justify-between py-10 px-5 lg:px-0 group border-b-[1px] border-black/15 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[calc(100%+100px)] h-full bg-white shadow-[1px_1px_18px_10px_rgba(0,0,0,0.02)] z-0 shadow-black/15  opacity-0 invisible group-hover:opacity-30 group-hover:visible transition-all ease-in-out duration-300"></div>
                        <div className="flex flex-col gap-2 flex-1 relative z-10">
                            <h3 className="font-headingFontExtraBold font-bold lg:max-w-[60%] leading-7">{d?.title}</h3>
                            <p className="text-sm">{d?.description}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-20 flex-1 lg:justify-end z-10">
                            <div className="text-sm text-muted-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ease-in-out duration-300">Published: {d?.publishData}</div>
                            <ReadMoreButton url={d?.url}/>
                        </div>
                    </Link>
                ))}
             </div>
        </div>
    )
}

export default BlogSection;