
import TopTagline from "@/app/components/common/topTagline";
import Image from "next/image";

interface BookYourRideProps {
    propsData?: {
        leftImage?: string;
        topTagline?: string;
        title?: string;
    };
}


const BookYourRide: React.FC<BookYourRideProps> = ({
    propsData
}) => {
    return (
        <div className="bg-white mb-20 relative overflow-hidden w-full">
            <div className="flex flex-col relative justify-between z-20 lg:flex-row">
                <div className="relative py-5 flex items-end flex-1 md:pr-20">
                    <Image
                        src={propsData?.leftImage || "/images/car-2.png"}
                        alt="Fare Calculator"
                        width={500}
                        height={400}
                        className="w-full relative z-10"
                    />
                    <div className="absolute right-0 top-0 h-full w-[50%] bg-[#1E1E1E]"></div>
                </div>
                <div className="flex-1 bg-[#1E1E1E] p-5 md:pl-10 md:py-10">
                    <div className="md:w-[70%] text-white">
                        <TopTagline title={propsData?.topTagline || "Online Booking"} className={`text-white`} />
                        <h1 className={`text-4xl font-bold mb-6`}>{propsData?.title || "Book Your Taxi Ride"}</h1>
                        <div className="border-dashed border-[1px] grid place-items-center h-[200px] p-3 text-center">
                            Booking Widget will display here
                        </div>
                        {/* <BookingWidget 
                            version={2} 
                            isPreview={true}
                            customTagline={propsData?.topTagline}
                            customTitle={propsData?.title}
                        /> */}
                    </div>
                </div>
                <div className="w-0 h-0 border-b-[250px] border-b-[#1E1E1E] border-r-[150px] border-r-transparent absolute z-20 -right-[150px] top-0"></div>
            </div>
            <div className="absolute right-0 bottom-0 h-[80%] w-[40%] bg-[#1E1E1E]">
            </div>
            <div className="absolute right-0 top-0 h-[20%] w-[20%] bg-slate-100 z-0">
            </div>
        </div>
    )
}

export default BookYourRide;