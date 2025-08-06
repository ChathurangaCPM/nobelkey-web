import Image from "next/image";

interface BusinessCardProps {
    imageUrl: string;
    alt?: string;
    title: string;
    name: string;
    phoneNumber: string;
}

interface PhoneNumberProps {
    number: string;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({ number }) => {
    const formattedNumber = number.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');

    return (
        <div className="text-amber-500 font-bold text-2xl">{formattedNumber}</div>
    );
};


const BusinessCard: React.FC<BusinessCardProps> = ({
    imageUrl,
    title,
    alt,
    name,
    phoneNumber
}) => (
    <div className="flex flex-col items-center gap-10 bg-white rounded-lg w-max lg:flex-row">
        <div className="flex items-center gap-5">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                <Image src={imageUrl} alt={alt || ''} width={100} height={100} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-gray-600 font-medium">{title}</h2>
                <div className="font-cursive text-2xl text-gray-800 font-extrabold">{name}</div>
            </div>
        </div>
        <div className="ml-0 w-full lg:w-auto lg:ml-auto">
            <div className="flex flex-col">
                <span className="text-gray-600 font-medium">Call For Taxi</span>
                <PhoneNumber number={phoneNumber} />
            </div>
        </div>
    </div>
);

export default BusinessCard;
