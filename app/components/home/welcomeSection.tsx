import Image from "next/image";
import TopTagline from "../common/topTagline";
import BusinessCard from "../common/businessCard";
import ReadMoreButton from "../common/readMoreButton";

interface WelcomeSectionProps {
    topTagline?: string;
    title?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
    secondImageUrl?: string;

    content?: string;
    bottomTagline?: string;
}


const WelcomeSection: React.FC<WelcomeSectionProps> = ({
    topTagline,
    title,
    description,
    link,
    imageUrl,
    secondImageUrl,
    content,
    bottomTagline,
}) => {
    return (
        <div className="w-full px-5 md:px-0 md:w-10/12 xl:max-w-[1400px] mx-auto py-10 xl:py-32 flex flex-col items-start gap-5 lg:flex-row">
            <div className="flex flex-col gap-10 flex-1">
                {topTagline && <div className="uppercase tracking-widest border rounded-xl text-xs font-medium px-4 py-[2px] inline-block w-fit">{topTagline}</div>}

                {title && <div className="relative pl-4">
                    <div className="w-[5px] h-[90%] bg-[#3C51A3] left-0 top-0 absolute" />
                    <h1 className="text-[22px] xl:max-w-[60%] font-headingFontExtraBold leading-[28px] font-extrabold">{title}</h1>
                </div>}

                {description && <span className="text-sm font-medium xl:max-w-[60%]">{description}</span>}

                <ReadMoreButton url={link} />
            </div>

            <div className="flex flex-col gap-8 flex-1 font-normal text-sm">
                <div className="flex items-center gap-5">
                    {imageUrl && <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={imageUrl || '/images/welcome_2.png'} alt="welcome 1" width={300} height={300} />
                    </div>}
                    {secondImageUrl && <div className="overflow-hidden rounded-xl max-w-[250px]">
                        <Image src={secondImageUrl || '/images/welcome_1.png'} alt="welcome 1" width={300} height={300} />
                    </div>}
                </div>
                {content}

                {bottomTagline && <h4 className="font-headingFontExtraBold leading-[32px] font-extrabold">{bottomTagline}</h4>}
            </div>
        </div>
    )
}

export default WelcomeSection;