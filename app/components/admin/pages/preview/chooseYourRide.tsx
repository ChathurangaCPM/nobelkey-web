import TopTagline from "@/app/components/common/topTagline";

interface ChooseYourRideProps {
    propsData?:{
        topTagline?: string;
        title?: string;
        descriptions?: string;
    }
}

const ChooseYourRide: React.FC<ChooseYourRideProps> = ({
    propsData
}) => {


    return (
        <div>
            <div className="container mx-auto md:py-10 text-center space-y-10 mb-20">
                <div>
                    <TopTagline title={propsData?.topTagline || "Lets Go With Us"} align="center" />
                    <h2 className="text-4xl font-bold mb-6 capitalize">{propsData?.title}</h2>
                    <p className="mt-5 max-w-[90%] md:max-w-[40%] mx-auto font-semibold">{propsData?.descriptions}</p>
                </div>

                <div className="grid px-5 md:px-0 md:grid-cols-3 gap-5 mt-20">
                    <div className="w-full h-[200px] flex items-center flex-col justify-center bg-slate-50 p-5">
                        <p>Vehicle will display here</p>
                        <p className="text-xs text-muted-foreground">Vehicle data will dynamically display here </p>
                    </div>
                    <div className="w-full h-[200px] flex items-center flex-col justify-center bg-slate-50 p-5">
                        <p>Vehicle will display here</p>
                        <p className="text-xs text-muted-foreground">Vehicle data will dynamically display here</p>
                    </div>
                    <div className="w-full h-[200px] flex items-center flex-col justify-center bg-slate-50 p-5">
                        <p>Vehicle will display here</p>
                        <p className="text-xs text-muted-foreground">Vehicle data will dynamically display here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseYourRide;