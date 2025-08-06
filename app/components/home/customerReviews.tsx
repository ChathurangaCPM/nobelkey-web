import { Testimonials } from "../common/testimonials";
import TopTagline from "../common/topTagline";
import Image from "next/image";

// Interface for testimonial data
interface PointItem {
    id: string;
    title: string;
    description: string;
    iconUrl?: string;
}
interface CustomerReviewsProps {
    leftDescriptions?: string;
    leftTitle?: string;
    leftTopTagline?: string;
    rightDescriptions?: string;
    rightTitle?: string;
    rightTopTagline?: string;
    testimonials?: string | string[];
    testimonialsRightRepeater?: string | string[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
    leftDescriptions,
    leftTitle,
    leftTopTagline,
    rightDescriptions,
    rightTitle,
    rightTopTagline,
    testimonials,
    testimonialsRightRepeater,
}) => {

    const pointList = typeof testimonialsRightRepeater === 'string' ? JSON.parse(testimonialsRightRepeater) : (testimonialsRightRepeater || []);

    const testimonialData = typeof testimonials === 'string' ? JSON.parse(testimonials) : (testimonials || []);


    return (
        <div className="bg-slate-100 relative overflow-hidden">
            <Image src="/images/map.png" alt="" width={1000} height={800} className="w-1/2 absolute top-1/2 -translate-y-1/2 left-0 z-0" />
            <div className="container mx-auto flex flex-col items-center relative z-10 lg:flex-row">
                <div className="flex-1 p-5 py-10 md:py-20 md:pr-20">
                    <TopTagline title={leftTopTagline || "Customer Reviews"} align="left" />
                    <h2 className="text-4xl font-bold mb-6 capitalize mt-5">{leftTitle || "What Our Customers Say"}</h2>
                    <p className="mt-5 text-muted-foreground">{leftDescriptions}</p>
                    <div className="mt-10">
                        <Testimonials
                            items={testimonialData}
                            showNavigation={true}
                            showCounter={true}
                            autoPlay={true}
                            autoPlayInterval={5000}
                        />
                    </div>
                </div>
                <div className="flex-1 bg-[#ff9900] p-5 py-10 md:p-20 md:py-28  text-white relative bg-striped-pattern bg-pattern-size w-full">
                    <div className="relative z-10">
                        <TopTagline title={rightTopTagline || "Why Choose Us"} align="left" textColor="white" />
                        <h2 className="text-4xl font-bold mb-6 capitalize mt-5">{rightTitle || "Why Ride with CityCabs?"}</h2>
                        <p className="mt-5 text-white">{rightDescriptions}</p>

                        {pointList && pointList?.length > 0 && <div className="flex flex-col gap-5 mt-10">
                            {pointList.map((d: PointItem, ) => (
                                <div key={d.id}>
                                    {d?.iconUrl && <Image src={d?.iconUrl} alt={d?.title} width={100} height={100} className="w-[80px]" />}
                                    <h3 className="text-xl font-semibold">{d?.title}</h3>
                                    <p>{d?.title}</p>
                                </div>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerReviews;