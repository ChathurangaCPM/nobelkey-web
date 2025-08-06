import Image from "next/image";
import TopTagline from "../common/topTagline";
import ServiceCard from "../common/serviceCard";


interface Service {
    id: string | number;
    imageUrl?: string;
    title?: string;
    description?: string;
    linkText?: string;
    url?: string;
}

interface WhatWeOfferProps {
    backgroundImage?: string;
    topTagline?: string;
    title?: string;
    description?: string;
    services?: string,
}

const WhatWeOffer: React.FC<WhatWeOfferProps> = ({
    backgroundImage,
    topTagline,
    title,
    
    services
}) => {

    const getServices = JSON.parse(services || '');

    return (
        <div className="pb-40 bg-slate-100">
            <div className="relative">

                <div className="inset-0 bg-black z-10">
                    <div className="absolute left-0 top-0 bg-black/60 z-10 w-full h-full"></div>
                    <Image src={backgroundImage || "/images/bg-1.jpg"} alt={title || ''} layout="fill" objectFit="cover" className="z-0 absolute" />
                </div>

                <div className="text-center container mx-auto py-20 relative z-10 text-white pb-[200px]">
                    {topTagline && <TopTagline title={topTagline || ''} align="center" />}
                    <h2 className="text-4xl font-bold mb-6 capitalize" dangerouslySetInnerHTML={{ __html: title || '' }}></h2>
                </div>
            </div>

            <div className="container mx-auto grid md:grid-cols-3 gap-8 -mt-[100px] text-white z-30 relative p-5">
                {getServices && getServices?.length > 0 && getServices.map((service: Service) => <ServiceCard key={service?.id} data={service} />)}
            </div>
        </div>
    )
}

export default WhatWeOffer;