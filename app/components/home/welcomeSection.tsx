import Image from "next/image";
import TopTagline from "../common/topTagline";
import BusinessCard from "../common/businessCard";
import ReadMoreButton from "../common/readMoreButton";

interface WelcomeSectionProps {
    imageUrl?: string;
    secondImageUrl?: string;
    topTagline?: string;
    title?: string;
    description?: string;
    userImage?: string;
    founderName?: string;
    callForTaxi?: string;
}


const WelcomeSection: React.FC<WelcomeSectionProps> = ({
    imageUrl,
    secondImageUrl,
    topTagline,
    title,
    description,
    userImage,
    founderName,
    callForTaxi,
}) => {
    return (
        <div className="w-full px-5 md:px-0 md:w-10/12 xl:max-w-[1400px] mx-auto py-10 xl:py-32 flex flex-col items-start gap-5 lg:flex-row">
            <div className="flex flex-col gap-10 flex-1">
                <div className="uppercase tracking-widest border rounded-xl text-xs font-medium px-4 py-[2px] inline-block w-fit">Choose us</div>

                <div className="relative pl-4">
                    <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                    <h1 className="text-[22px] xl:max-w-[60%] font-headingFontExtraBold leading-[28px] font-extrabold">Confidence-Building and Client-Focused.</h1>
                </div>

                <span className="text-sm font-medium xl:max-w-[60%]">Discover Engineered Solutions Designed to Optimize Performance and Value</span>

                <ReadMoreButton />
            </div>
            
            <div className="flex flex-col gap-8 flex-1 font-normal text-sm">
                <div className="flex items-center gap-5">
                    <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={'/images/welcome_2.png'} alt="welcome 1" width={300} height={300} />
                    </div>
                    <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={'/images/welcome_1.png'} alt="welcome 1" width={300} height={300} />
                    </div>
                </div>

                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, libero error! Voluptas, porro reprehenderit amet aut itaque ex velit, maxime quod, impedit nesciunt rerum quaerat aperiam eius repudiandae voluptatem a!  Voluptas, porro reprehenderit amet aut itaque ex velit, maxime quod, impedit nesciunt rerum quaerat aperiam eius repudiandae voluptatem a!  Voluptas, porro reprehenderit amet aut itaque ex velit, maxime quod, impedit nesciunt rerum quaerat aperiam eius repudiandae voluptatem a!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum sed, quos beatae non nemo voluptatem  Voluptas, porro reprehenderit amet aut itaque ex velit, maxime quod, impedit nesciunt rerum quaerat aperiam eius repudiandae voluptatem a!</p>

                <h4 className="font-headingFontExtraBold leading-[32px] font-extrabold">Simple and Professional.</h4>
            </div>
            {/* <div className="flex flex-1 items-end justify-end gap-5 mb-3">
                <Image src={imageUrl || "/images/about-1.png" } alt={title || ''} width={200} height={300} className="w-7/12 bg-black" />
                <Image src={secondImageUrl || "/images/about-2.png"} alt="sub image" width={200} height={200} className="w-5/12 bg-black"/>
            </div>
            <div className="flex-1 space-y-10 p-5">
                {topTagline && <TopTagline title={topTagline}/>}
                <h2 className="text-4xl font-bold mb-6">{title}</h2>
                <p>{description}</p>
                {founderName && <BusinessCard imageUrl={userImage || "/images/auhtor.png"} name={founderName || ''} title="Founder And CEO" phoneNumber={callForTaxi || ''}/>}
            </div> */}
        </div>
    )
}

export default WelcomeSection;