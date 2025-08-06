import Image from "next/image";

import { Camera, Ellipsis, Lock, MessageCircle, Smile, ThumbsUp } from "lucide-react";
import { IconInfo, IconShare } from "../../common/svgIcons";

interface OgDataPreviewProps {
    data?: {
        image?: string,
        title?: string,
        description?: string,

    }
}

const OgDataPreview: React.FC<OgDataPreviewProps> = ({
    data
}) => {

    return (
        <div className="p-0 rounded-lg shadow-lg font-sans max-w-lg border-[1px]">

            <div className="flex items-center gap-2 justify-between p-3 border-b-[1px]">
                <div className="flex gap-2">
                    <Image src="/images/facebook.png" alt="facebook" width={45} height={45} />
                    <div className="flex flex-col ">
                        <h4 className="font-semibold">Facebook</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs">24m</span>
                            <Lock size={12} />
                        </div>
                    </div>
                </div>
                <Ellipsis size={20} />
            </div>

            {data?.image && data?.image !== "" && <div className="w-full h-[280px] overflow-hidden relative">
                <Image src={data?.image || ''} width={400} height={300} className="w-full absolute -top-1/2" objectFit="cover" alt={""} />
            </div>}
            <div className="border-t-[1px] p-4 bg-gray-100 relative">
                <div className="absolute right-3 -top-3 bg-white z-10 rounded-full flex items-center justify-center w-6 h-6 border-[1px]">
                    <IconInfo className="w-3 h-3 block mx-auto" />
                </div>
                <span className="uppercase text-gray-600 text-sm">site.lk</span>
                <h3 className="text-md font-semibold">{data?.title || "Page title will display here"}</h3>
                <p className="text-gray-500 truncate text-[14px]">{data?.description || ""}</p>
            </div>

            <div className="p-5 border-t-[1px]">
                <div className="border-b-[1px] flex items-center justify-around pb-3">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                        <ThumbsUp size={20} /> <span>Like</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                        <MessageCircle size={20} /> <span>Comment</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                        <IconShare className="w-5 h-5" fill="#78716C" /> <span>Share</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-3 pointer-events-none">
                    <Image src="/images/facebook.png" alt="facebook" width={40} height={40} />
                    <div className="relative w-full">
                        <input type="text" placeholder="Write a comment" className="rounded-full bg-gray-100 w-full px-5 py-2" />
                        <div className="flex items-center gap-3 absolute right-4 top-1/2 -translate-y-[50%] text-gray-400">
                            <Smile strokeWidth={1.2} size={17}/>
                            <Camera strokeWidth={1.3} size={17}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OgDataPreview;