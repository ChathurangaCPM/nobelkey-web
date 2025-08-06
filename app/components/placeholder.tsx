import { Loader2 } from "lucide-react";

const Placeholder:React.FC = () => {
    return(
        <div className="w-screen h-screen fixed z-50 grid place-items-center transition-all ease-in-out">
            <div className="text-center">
                <Loader2 className="animate-spin w-8 h-8 mx-auto" />
                <h3>Please Wait...</h3>
            </div>
        </div>
    )
}

export default Placeholder;