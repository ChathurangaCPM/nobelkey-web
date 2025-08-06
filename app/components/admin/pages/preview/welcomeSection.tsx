import React from 'react';
import Image from 'next/image';
import TopTagline from '@/app/components/common/topTagline';
import BusinessCard from '@/app/components/common/businessCard';



interface WelcomeSectionProps {
    propsData?: {
        imageUrl?: string;
        secondImageUrl?: string;
        topTagline?: string;
        title?: string;
        description?: string;
        callForTaxi?: string;
        founderName?: string;
        userImage?: string;
    };
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
    propsData,
}) => {
    
    return (
        <div className="container mx-auto py-20 flex flex-col items-center gap-5 justify-between lg:flex-row">
            <div className="flex flex-1 items-end justify-end gap-5 mb-3">
                {propsData?.imageUrl ? (
                    <Image
                        src={propsData?.imageUrl}
                        alt="First welcome image"
                        width={200} height={300} className="w-7/12 bg-black"
                    />
                ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full aspect-[4/3]">
                        No image selected
                    </div>
                )}

                {propsData?.secondImageUrl ? (
                    <Image
                        src={propsData?.secondImageUrl}
                        alt="Second welcome image"
                        width={200} height={200} className="w-5/12 bg-black"
                    />
                ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full aspect-[4/3]">
                        No image selected
                    </div>
                )}
            </div>
            <div className="flex-1 space-y-10 p-5">
                <TopTagline title={propsData?.topTagline as string} />
                <h2 className="text-4xl font-bold mb-6">{propsData?.title}</h2>
                <p>{propsData?.description}</p>
                <BusinessCard imageUrl={propsData?.userImage || "/images/auhtor.png"} name={propsData?.founderName || ''} title="Founder And CEO" phoneNumber={propsData?.callForTaxi || ''} />
            </div>
        </div>
    );
};

export default WelcomeSection;