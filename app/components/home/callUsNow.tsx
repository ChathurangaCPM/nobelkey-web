import { PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CallUsNowProps {
    mainTitle?: string,
    description?: string,
    contactNumber?: number,
    rightImage?: string
}

interface PhoneNumberProps {
    number: string;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({ number }) => {
    const formattedNumber = number.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');

    return (
        <Link href={`tel:${number}`} className="text-yellow-500 font-bold text-3xl">+{formattedNumber}</Link>
    );
};


const CallUsNow: React.FC<CallUsNowProps> = ({
    mainTitle,
    description,
    contactNumber,
    rightImage
}) => {
    return (
        <div className="bg-[#1B1B1B] relative overflow-hidden mb-20">
            <div className="container mx-auto flex flex-col p-5 pb-0 py-14 items-center text-white md:flex-row md:pb-0 md:p-0 md:items-end">
                <div className="flex flex-col gap-10 md:py-20 md:w-[50%]">
                    <h2 className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: mainTitle || '' }} />
                    <p className="max-w-full md:max-w-[40%] font-semibold">{description}</p>

                    {contactNumber && <div className="flex items-center gap-5">
                        <div className="p-4 flex items-center justify-center bg-yellow-500/20">
                            <PhoneCall size={40} className="text-yellow-500" />
                        </div>
                        <div>
                            <span className="block font-semibold text-xl">Call for taxi</span>
                            <PhoneNumber number={contactNumber?.toString() || ''} />
                        </div>
                    </div>}
                </div>

                <div className="pt-0 mt-10 md:mt-0 md:w-[50%] lg:flex lg:justify-end">
                    <Image src={rightImage || "/images/cta-men.png"} alt="Call us now" width={500} height={400} />
                </div>

            </div>

            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[10vw] border-b-white border-l-[20vw] border-l-transparent"></div>
        </div>
    )
}

export default CallUsNow;