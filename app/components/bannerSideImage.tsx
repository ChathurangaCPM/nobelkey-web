import Image from "next/image";
interface BannerSideImageProps {
    carImage?: string;
}

const BannerSideImage: React.FC<BannerSideImageProps> = ({
    carImage
}) => {
    return (
        <div className="relative">
            <Image
                src={carImage || '/images/car-1.png'}
                alt="car"
                width={400}
                height={200}
                className=" w-full"
            />
        </div>
    )
}

export default BannerSideImage;