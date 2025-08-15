import { Button } from "@/components/ui/button";
import { ImageUp, FileUp, FileText } from "lucide-react";
import Image from "next/image";

interface SelectFileButtonProps {
    value?: string;
    onClick: (value: boolean) => void;
    removeFile: (value: boolean) => void;
    acceptedTypes?: 'images' | 'documents' | 'all';
}

const SelectFileButton: React.FC<SelectFileButtonProps> = ({
    value,
    onClick, 
    removeFile,
    acceptedTypes = 'all'
}) => {
    const getButtonText = () => {
        switch (acceptedTypes) {
            case 'images':
                return 'Select Image';
            case 'documents':
                return 'Select Document';
            default:
                return 'Select File';
        }
    };

    const getIcon = () => {
        switch (acceptedTypes) {
            case 'images':
                return <ImageUp strokeWidth={1} />;
            case 'documents':
                return <FileText strokeWidth={1} />;
            default:
                return <FileUp strokeWidth={1} />;
        }
    };

    const isImageFile = (url: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const getFileName = (url: string) => {
        try {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        } catch {
            return 'Selected file';
        }
    };

    return (
        <button
            type="button"
            className={`w-max border border-gray-200 rounded-lg flex items-center justify-center ${value === "" ? 'p-5' : 'p-2'}`}
            onClick={() => onClick(true)}
        >
            {value ? (
                <div className="relative w-max">
                    {isImageFile(value) ? (
                        <div className="w-[250px] h-[250px] rounded-md overflow-hidden relative">
                            <Image
                                src={value}
                                alt="Selected image"
                                layout="fill"
                                objectFit="cover"
                                className="absolute"
                            />
                        </div>
                    ) : (
                        <div className="w-[250px] h-[250px] rounded-md border border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                            <FileText size={48} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600 text-center px-4 break-words">
                                {getFileName(value)}
                            </span>
                        </div>
                    )}
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile(true);
                        }} 
                        className="absolute right-2 top-3 z-10"
                        size="sm"
                    >
                        Remove
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-2 text-xs text-muted-foreground gap-2">
                    {getIcon()}
                    {getButtonText()}
                </div>
            )}
        </button>
    )
}

export default SelectFileButton;
