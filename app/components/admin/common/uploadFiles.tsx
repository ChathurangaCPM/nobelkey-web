'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image } from "lucide-react";

// Define the UploadedFile interface
interface UploadedFile {
    _id: string;
    url: string;
    alt: string;
    path: string;
    s3Key?: string;
    s3Bucket?: string;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: string;
    title: string;
    type: string;
    description: string;
    fileCategory: 'images' | 'documents';
    mimeType: string;
    fileSize: number;
}

interface UploadFilesProps {
    onUpload: (files: UploadedFile[]) => void;
    acceptedTypes?: 'images' | 'documents' | 'all';
    maxFiles?: number;
}

interface UploadResponse {
    success: boolean;
    message: string;
    files?: UploadedFile[];
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getAcceptAttribute = (acceptedTypes: 'images' | 'documents' | 'all'): string => {
    switch (acceptedTypes) {
        case 'images':
            return 'image/*';
        case 'documents':
            return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip';
        case 'all':
        default:
            return 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip';
    }
};

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
        return <Image size={20} className="text-blue-500" />;
    }
    return <FileText size={20} className="text-green-500" />;
};

const UploadFiles: React.FC<UploadFilesProps> = ({
    onUpload,
    acceptedTypes = 'all',
    maxFiles = 10
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    const validateFiles = (files: File[]): { validFiles: File[], errors: string[] } => {
        const validFiles: File[] = [];
        const errors: string[] = [];

        if (files.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed`);
            return { validFiles: [], errors };
        }

        files.forEach(file => {
            const isImage = file.type.startsWith('image/');
            const isDocument = !isImage;

            // Check file type based on accepted types
            if (acceptedTypes === 'images' && !isImage) {
                errors.push(`${file.name} is not an image file`);
                return;
            }

            if (acceptedTypes === 'documents' && isImage) {
                errors.push(`${file.name} is not a document file`);
                return;
            }

            // Check file size
            const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;
            if (file.size > maxSize) {
                const maxSizeMB = maxSize / (1024 * 1024);
                const fileType = isImage ? 'images' : 'documents';
                errors.push(`${file.name} is too large (${formatBytes(file.size)}). Maximum size is ${maxSizeMB}MB for ${fileType}`);
                return;
            }

            validFiles.push(file);
        });

        return { validFiles, errors };
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleUpload = async (fileList: FileList | null) => {
        // Clear previous states
        setUploadStatus('');
        setFileErrors([]);
        
        if (!fileList || fileList.length === 0) {
            setUploadStatus('No files selected');
            return;
        }

        const files = Array.from(fileList);
        const { validFiles, errors } = validateFiles(files);
        
        if (errors.length > 0) {
            setFileErrors(errors);
            return;
        }

        if (validFiles.length === 0) {
            setUploadStatus('No valid files to upload');
            return;
        }
        
        setIsUploading(true);
        setUploadStatus('Uploading files...');

        try {
            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage: string;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || 'Upload failed';
                } catch {
                    errorMessage = `Upload failed: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const result: UploadResponse = await response.json();
            
            if (result.success && result.files) {
                setUploadedFiles(result.files);
                onUpload(result.files);
                setUploadStatus(`Successfully uploaded ${result.files.length} file(s)!`);
            } else {
                setUploadStatus('Upload successful but no files returned');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
            setUploadStatus(`Upload failed: ${errorMessage}`);
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(e.dataTransfer.files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpload(e.target.files);
    };

    const getUploadText = () => {
        switch (acceptedTypes) {
            case 'images':
                return 'Upload Images';
            case 'documents':
                return 'Upload Documents';
            default:
                return 'Upload Files';
        }
    };

    const getDescriptionText = () => {
        switch (acceptedTypes) {
            case 'images':
                return 'Drag & drop your images here or click to browse';
            case 'documents':
                return 'Drag & drop your documents here or click to browse';
            default:
                return 'Drag & drop your files here or click to browse';
        }
    };

    const getSizeText = () => {
        if (acceptedTypes === 'images') {
            return `Maximum file size: ${formatBytes(MAX_IMAGE_SIZE)}`;
        } else if (acceptedTypes === 'documents') {
            return `Maximum file size: ${formatBytes(MAX_DOCUMENT_SIZE)}`;
        }
        return `Maximum file size: ${formatBytes(MAX_IMAGE_SIZE)} for images, ${formatBytes(MAX_DOCUMENT_SIZE)} for documents`;
    };

    return (
        <div className="w-full mx-auto">
            <div
                className={`p-10 flex flex-col items-center justify-center border-2 border-dashed rounded-lg gap-4 transition-colors ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload 
                    size={48} 
                    strokeWidth={1} 
                    className={`${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
                />
                <form encType="multipart/form-data" method="POST">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold mb-2">{getUploadText()}</h1>
                        <p className="text-gray-500 mb-1">{getDescriptionText()}</p>
                        <p className="text-gray-400 text-sm mb-2">{getSizeText()}</p>
                        <p className="text-gray-400 text-sm mb-4">Maximum {maxFiles} files allowed</p>
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept={getAcceptAttribute(acceptedTypes)}
                                className="hidden"
                                onChange={handleFileInput}
                                disabled={isUploading}
                            />
                            <span className={`px-4 py-2 ${
                                isUploading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                } text-white rounded-md transition-colors`}>
                                {isUploading ? 'Processing...' : 'Browse Files'}
                            </span>
                        </label>
                    </div>
                </form>

                {fileErrors.length > 0 && (
                    <div className="mt-4 w-full">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <h3 className="text-red-800 font-medium mb-2">Invalid Files:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {fileErrors.map((error, index) => (
                                    <li key={index} className="text-red-600 text-sm">{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {uploadStatus && (
                    <div className={`mt-4 text-center ${
                        uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'
                    }`}>
                        {uploadStatus}
                    </div>
                )}

                {uploadedFiles.length > 0 && (
                    <div className="mt-4 w-full">
                        <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
                        <div className="space-y-4">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="border rounded p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getFileIcon(file.mimeType)}
                                        <p className="font-medium">{file.title}</p>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {file.fileCategory}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 break-all mb-2">{file.url}</p>
                                    <div className="text-sm">
                                        <p className="text-gray-600">
                                            File size: {formatBytes(file.fileSize)}
                                        </p>
                                        {file.fileCategory === 'images' && (
                                            <>
                                                <p className="text-gray-600">
                                                    Original size: {formatBytes(file.originalSize)}
                                                </p>
                                                <p className="text-green-600">
                                                    Reduced by: {file.compressionRatio}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFiles;
