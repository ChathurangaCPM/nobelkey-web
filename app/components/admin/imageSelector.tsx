import FileSelector from "./fileSelector";

interface ImageType {
    path: any;
    url: string;
    alt: string;
}

interface ImageSelectorProps {
    value: string;
    onChange: (files: ImageType[]) => void;
    removeImage: (value: boolean) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
    value,
    onChange,
    removeImage
}) => {
    const handleFileChange = (files: any[]) => {
        // Convert FileType to ImageType for backward compatibility
        const imageFiles = files.map(file => ({
            path: file.url || file.path,
            url: file.url,
            alt: file.alt
        }));
        onChange(imageFiles);
    };

    return (
        <FileSelector
            value={value}
            onChange={handleFileChange}
            removeFile={removeImage}
            acceptedTypes="images"
            title="Select an image"
            description="Select an image from the media library"
        />
    );
};

export default ImageSelector;
