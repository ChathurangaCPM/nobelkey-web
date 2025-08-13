import React from 'react';
import Image from 'next/image';
import TopTagline from '@/app/components/common/topTagline';
import BusinessCard from '@/app/components/common/businessCard';
import ReadMoreButton from '@/app/components/common/readMoreButton';



interface WelcomeSectionProps {
    propsData?: {
        topTagline?: string;
        title?: string;
        description?: string;
        link?: string;
        imageUrl?: string;
        secondImageUrl?: string;

        content?: string;
        bottomTagline?: string;
    };
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
    propsData,
}) => {

    return (
        <div className="w-full px-5 md:px-0 md:w-10/12 xl:max-w-[1400px] mx-auto py-10 xl:py-32 flex flex-col items-start gap-5 lg:flex-row">
            <div className="flex flex-col gap-10 flex-1">
                {propsData?.topTagline && <div className="uppercase tracking-widest border rounded-xl text-xs font-medium px-4 py-[2px] inline-block w-fit">{propsData?.topTagline}</div>}

                {propsData?.title && <div className="relative pl-4">
                    <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                    <h1 className="text-[22px] xl:max-w-[60%] font-headingFontExtraBold leading-[28px] font-extrabold">{propsData?.title}</h1>
                </div>}

                {propsData?.description && <span className="text-sm font-medium xl:max-w-[60%]">{propsData?.description}</span>}

                <ReadMoreButton url={propsData?.link}/>
            </div>

            <div className="flex flex-col gap-8 flex-1 font-normal text-sm">
                <div className="flex items-center gap-5">
                    {propsData?.imageUrl && <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={propsData?.imageUrl || '/images/welcome_2.png'} alt="welcome 1" width={300} height={300} />
                    </div>}
                    {propsData?.secondImageUrl && <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={propsData?.secondImageUrl || '/images/welcome_1.png'} alt="welcome 1" width={300} height={300} />
                    </div>}
                </div>
                {propsData?.content}
                
                {propsData?.bottomTagline && <h4 className="font-headingFontExtraBold leading-[32px] font-extrabold">{propsData?.bottomTagline}</h4>}
            </div>
        </div>
    );
};

export default WelcomeSection;