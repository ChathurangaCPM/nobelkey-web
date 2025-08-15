import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SelectFileButton from "./common/selectFileButton";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadFiles from "./common/uploadFiles";
import Image from "next/image";
import { FileText, Download } from "lucide-react";

interface FileType {
    _id: string;
    path?: any; // For backward compatibility
    url: string;
    alt: string;
    title: string;
    fileCategory: 'images' | 'documents';
    mimeType: string;
    fileSize?: number;
}

interface FileSelectorProps {
    value: string;
    onChange: (files: FileType[]) => void;
    removeFile: (value: boolean) => void;
    acceptedTypes?: 'images' | 'documents' | 'all';
    title?: string;
    description?: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({
    value,
    onChange,
    removeFile,
    acceptedTypes = 'all',
    title = 'Select a file',
    description = 'Select a file from the media library'
}) => {
    const [open, setOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('selectFile');
    const [allFiles, setAllFiles] = React.useState<FileType[]>([]);

    // Load all files when component mounts
    const loadFiles = async () => {
        try {
            const response = await fetch('/api/admin/media');
            const { files } = await response.json();

            // Filter files based on accepted types
            let filteredFiles = files;
            if (acceptedTypes === 'images') {
                filteredFiles = files.filter((file: FileType) => 
                    file.fileCategory === 'images' || file.mimeType?.startsWith('image/')
                );
            } else if (acceptedTypes === 'documents') {
                filteredFiles = files.filter((file: FileType) => 
                    file.fileCategory === 'documents' || !file.mimeType?.startsWith('image/')
                );
            }

            setAllFiles(filteredFiles);
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [acceptedTypes]);

    const handlerSelectFile = (files: FileType[]) => {
        const reOrganize = files?.map((file) => {
            return {
                ...file,
                url: file.path || file.url // For backward compatibility
            }
        });

        // Update all files with newly uploaded ones
        setAllFiles(prevFiles => [...reOrganize, ...prevFiles]);

        // Update the selected value
        onChange(files);

        // Switch to select file tab
        setActiveTab('selectFile');
    };

    const handleFileSelect = (filePath: FileType) => {
        onChange([filePath]);
        setOpen(false);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const getFileIcon = (file: FileType) => {
        if (file.fileCategory === 'images' || file.mimeType?.startsWith('image/')) {
            return (
                <Image
                    src={file.url}
                    alt={file.alt}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                />
            );
        }
        return (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                <FileText size={48} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">
                    {file.title}
                </span>
                {file.fileSize && (
                    <span className="text-xs text-gray-400 mt-1">
                        {formatBytes(file.fileSize)}
                    </span>
                )}
            </div>
        );
    };

    const getTabLabel = () => {
        switch (acceptedTypes) {
            case 'images':
                return 'Images';
            case 'documents':
                return 'Documents';
            default:
                return 'Media';
        }
    };

    return (
        <div className="relative">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <SelectFileButton 
                        value={value} 
                        onClick={() => setOpen(true)} 
                        removeFile={removeFile}
                        acceptedTypes={acceptedTypes}
                    />
                </DialogTrigger>
                <DialogContent className="min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList>
                                <TabsTrigger value="selectFile">{getTabLabel()}</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="selectFile" className="max-h-[40vh] overflow-y-auto">
                                <div className="grid grid-cols-4 gap-4 p-4">
                                    {allFiles && allFiles?.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-primary group"
                                            onClick={() => handleFileSelect(file)}
                                        >
                                            {getFileIcon(file)}
                                            
                                            {/* Overlay with file info */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                                                    <p className="text-sm font-medium mb-1">{file.title}</p>
                                                    {file.fileCategory === 'documents' && (
                                                        <Download size={20} className="mx-auto" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {allFiles.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No files found. Upload some files to get started.
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="upload">
                                <UploadFiles 
                                    onUpload={handlerSelectFile} 
                                    acceptedTypes={acceptedTypes}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileSelector;
