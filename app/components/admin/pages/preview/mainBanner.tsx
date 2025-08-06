
import Image from "next/image";

interface MainBannerProps {
    propsData?: {
        imageUrl?: string;
        alt?: string;
        carImage?: string;
    };
}

const MainBanner: React.FC<MainBannerProps> = ({
    propsData
}) => {
    return (
        <div className="pt-[150px]">
            <div className="relative py-20 text-white overflow-hidden">
                <div className="absolute opacity-35 md:opacity-100 bottom-0 z-10 h-full right-[15vw] flex items-end skew-x-[160deg] justify-start">
                    <div className="w-[100px] h-[80%]  bg-[#222] relative bottom-0"></div>
                    <div className="w-[200px] h-full  bg-yellow-500 "></div>
                    <div className="w-[100px] h-[80%]  bg-[#222] mb-[40%]"></div>
                </div>
                <Image
                    src={propsData?.imageUrl || '/images/slider-bg.jpg'}
                    alt={propsData?.alt || "main banner"}
                    width={1800}
                    height={400}
                    className="object-cover w-full absolute left-0 top-0 h-full" />

                <div className="container mx-auto md:flex-row items-end justify-between gap-10 flex flex-col p-5 md:p-0">
                    <div className="md:flex-1 w-full opacity-20 pointer-events-none">
                        {/* <BookingWidget /> */}
                    </div>
                    <div className="flex-1 z-10">
                        <div className="relative">
                            <Image
                                src={propsData?.carImage || '/images/car-1.png'}
                                alt="car"
                                width={400}
                                height={200}
                                className=" w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner;