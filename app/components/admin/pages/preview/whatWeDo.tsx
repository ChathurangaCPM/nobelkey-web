import React from 'react';
import Image from 'next/image';
import TopTagline from '@/app/components/common/topTagline';
import ServiceCard from '@/app/components/common/serviceCard';

interface WhatWeDoProps {
    propsData?: {
        backgroundImage?: string;
        topTagline?: string;
        title?: string;
        description?: string;
        services?: object[];
    };
}

const WhatWeDo: React.FC<WhatWeDoProps> = ({
    propsData,
}) => {

    const servicesList = typeof propsData?.services === 'string' ? JSON.parse(propsData?.services) : (propsData?.services || []);

    return (
        <div className="pb-40 bg-slate-100 pointer-events-none">
            <div className="relative">

                <div className="inset-0 bg-black z-10">
                    <div className="absolute left-0 top-0 bg-black/60 z-10 w-full h-full"></div>
                    {propsData?.backgroundImage ? <Image src={propsData?.backgroundImage} alt="what we do background" layout="fill" objectFit="cover" className="z-0 absolute" /> :
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full aspect-[4/3]">
                            No image selected
                        </div>}
                </div>

                <div className="text-center container mx-auto py-20 relative z-10 text-white pb-[200px]">
                    <TopTagline title={propsData?.topTagline || ''} align="center" />
                    <h2
                        className="text-4xl font-bold mb-6 capitalize"
                        dangerouslySetInnerHTML={{ __html: propsData?.title || '' }}
                    />
                    <p className="mt-5 max-w-[90%] lg:max-w-[40%] mx-auto font-semibold">{propsData?.description}</p>
                </div>
            </div>

            <div className="container mx-auto grid md:grid-cols-3 gap-8 -mt-[100px] text-white z-30 relative p-5">
                {servicesList && servicesList?.length > 0 && servicesList?.map((d: object, i: React.Key) => <ServiceCard key={i} data={d}/>)}
            </div>
        </div>
    );
};

export default WhatWeDo;