import UploadFiles from "./uploadFiles";

// Define the UploadedFile interface for backward compatibility
interface UploadedFile {
    url: string;
    alt: string;
    path: string;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: string;
}

interface UploadImagesProps {
    onUpload: (files: UploadedFile[]) => void;
}

const UploadImages: React.FC<UploadImagesProps> = ({
    onUpload
}) => {
    const handleUpload = (files: any[]) => {
        // Convert new file format to old format for backward compatibility
        const convertedFiles = files.map(file => ({
            url: file.url,
            alt: file.alt,
            path: file.path || file.url,
            originalSize: file.originalSize,
            optimizedSize: file.optimizedSize,
            compressionRatio: file.compressionRatio
        }));
        onUpload(convertedFiles);
    };

    return (
        <UploadFiles 
            onUpload={handleUpload}
            acceptedTypes="images"
        />
    );
};

export default UploadImages;
