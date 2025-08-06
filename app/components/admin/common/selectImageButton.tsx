import { Button } from "@/components/ui/button";
import { ImageUp } from "lucide-react";
import Image from "next/image";

interface SelectImageButtonProps {
    value?: string;
    onClick: (value: boolean) => void;
    removeImage: (value: boolean) => void;
}

const SelectImageButton: React.FC<SelectImageButtonProps> = ({
    value,
    onClick, 
    removeImage
}) => {
    return (
        <button
            type="button"
            className={`w-max border border-gray-200 rounded-lg flex items-center justify-center ${value === "" ? 'p-5' : 'p-2'}`}
            onClick={() => onClick(true)}
        >
            {value ? (
                <div className="relative w-max">
                    <div className="w-[250px] h-[250px] rounded-md overflow-hidden relative">
                        <Image
                            src={value}
                            alt="Selected image"
                            layout="fill"
                            objectFit="cover"
                            className="absolute"
                        />
                    </div>
                    <Button onClick={() => removeImage(true)} className="absolute right-2 top-3 z-10">Remove</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-2 text-xs text-muted-foreground gap-2">
                    <ImageUp strokeWidth={1} />
                    Select Image
                </div>
            )}
        </button>
    )
}

export default SelectImageButton;