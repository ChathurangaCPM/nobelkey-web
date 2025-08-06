import CustomerReviews from "@/app/components/home/customerReviews";

interface TestimonialsPreviewProps {
    propsData?: {
        leftImage?: string;
        topTagline?: string;
        title?: string;
        groupTitle?: string;
        leftDescriptions?: string;
        rightTitle?: string;
        rightDescriptions?: string;
        leftTitle?: string;
        leftTopTagline?: string;
        rightTopTagline?: string;
        testimonials?: string;
        testimonialsRightRepeater?: string;
    };
}



const TestimonialsPreview:React.FC<TestimonialsPreviewProps> = ({
    propsData
}) => {
    const defaultData = {
        groupTitle: propsData?.groupTitle || '',
        leftDescriptions: propsData?.leftDescriptions || '',
        rightTitle: propsData?.rightTitle || '',
        ...propsData
    };

    return(
        <div className="p-4">
            <CustomerReviews {...defaultData}/>
        </div>
    )
}

export default TestimonialsPreview;