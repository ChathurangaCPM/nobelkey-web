import { ChevronRight } from "lucide-react"
import Link from "next/link"

const ReadMoreButton:React.FC = () => {
    return(
        <Link href="#" className="flex w-max items-center border border-black/10 p-[5px] rounded-[30px] relative group overflow-hidden transition-all ease-in-out duration-300">
            <span className="px-6 font-semibold capitalize text-sm transition-all z-20 relative ease-in-out duration-300 group-hover:text-white">Find out more</span>

            <div className="w-[40px] h-[40px] rounded-full bg-[#3C51A3] grid place-content-center transition-all duration-300 ease-in-out group-hover:bg-white z-30">
                <ChevronRight className="text-white transition-all ease-in-out duration-300 group-hover:text-[#3C51A3]"/>
            </div>

            <div className="
                absolute 
                right-[5px] 
                top-[5px] 
                w-[40px] 
                h-[40px] 
                opacity-0 
                rounded-full 
                bg-[#3C51A3] 
                z-10 
                transition-all 
                delay-100 
                ease-in-out 
                duration-300 
                group-hover:opacity-75
                group-hover:scale-[10]
                "></div>
        </Link>
    )
}

export default ReadMoreButton;