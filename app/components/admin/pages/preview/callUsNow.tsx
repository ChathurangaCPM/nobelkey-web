import CallUsNow from "@/app/components/home/callUsNow";

interface CallUsNowPreviewProps {
    propsData:{
        mainTitle?: string,
        description?: string,
        contactNumber?: number,
        rightImage?: string
    }
}

const CallUsNowPreview:React.FC<CallUsNowPreviewProps> = ({
    propsData
}) => {
    
    
    return(
        <div>
            <CallUsNow {...propsData}/>
        </div>
    )
}

export default CallUsNowPreview;