import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SelectImageButton from "./common/selectImageButton";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadImages from "./common/uploadImage";
import Image from "next/image";

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
    const [open, setOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('selectImage');
    const [allImages, setAllImages] = React.useState<ImageType[]>([]);

    // Load all images when component mounts
    const loadImages = async () => {
        try {
            const response = await fetch('/api/admin/media');
            const { files } = await response.json();

            setAllImages(files);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };


    useEffect(() => {
        loadImages();
    }, []);

    const handlerSelectImage = (paths: ImageType[]) => {


        const reOrganize = paths?.map((img) => {
            return {
                ...img,
                url: img.path
            }
        });

        // Update all images with newly uploaded ones
        setAllImages(prevImages => [...reOrganize, ...prevImages]);

        // Update the selected value
        onChange(paths);

        // Switch to select image tab
        setActiveTab('selectImage');
    };

    const handleImageSelect = (imagePath: ImageType) => {
        onChange([imagePath]);
        setOpen(false);
    };

    return (
        <div className="relative">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <SelectImageButton value={value} onClick={() => setOpen(true)} removeImage={removeImage} />
                </DialogTrigger>
                <DialogContent className="min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Select a image</DialogTitle>
                        <DialogDescription>
                            Select a image from the media library
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList>
                                <TabsTrigger value="selectImage">Media</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="selectImage" className="max-h-[40vh] overflow-y-auto">
                                <div className="grid grid-cols-4 gap-4 p-4">
                                    {allImages && allImages?.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-primary"
                                            onClick={() => handleImageSelect(image)}
                                        >
                                            <Image
                                                src={image?.url}
                                                alt={image?.alt}
                                                width={300}
                                                height={300}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="upload">
                                <UploadImages onUpload={handlerSelectImage} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageSelector;