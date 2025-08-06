'use client';

import React, { useState, useCallback } from 'react';
import { Upload } from "lucide-react";

// Define the UploadedFile interface first since it's used in other interfaces
interface UploadedFile {
    url: string;
    alt: string;
    path: string;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: string;
}

// Fix the onUpload type to properly specify an array of UploadedFile
interface UploadImagesProps {
    onUpload: (files: UploadedFile[]) => void;
}

interface UploadResponse {
    success: boolean;
    message: string;
    files?: UploadedFile[];
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const UploadImages: React.FC<UploadImagesProps> = ({
    onUpload
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    const validateFiles = (files: File[]): { validFiles: File[], errors: string[] } => {
        const validFiles: File[] = [];
        const errors: string[] = [];

        files.forEach(file => {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                errors.push(`${file.name} is not an image file`);
                return;
            }

            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} is too large (${formatBytes(file.size)}). Maximum size is ${formatBytes(MAX_FILE_SIZE)}`);
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
        setUploadStatus('Uploading and optimizing images...');

        try {
            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('images', file);
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
                setUploadStatus(`Successfully uploaded and optimized ${result.files.length} file(s)!`);
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
                        <h1 className="text-xl font-semibold mb-2">Upload Images</h1>
                        <p className="text-gray-500 mb-1">Drag & drop your images here or click to browse</p>
                        <p className="text-gray-400 text-sm mb-4">Maximum file size: {formatBytes(MAX_FILE_SIZE)}</p>
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
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
                                    <p className="text-sm text-gray-600 break-all">{file.path}</p>
                                    <div className="mt-2 text-sm">
                                        <p className="text-gray-600">
                                            Original size: {formatBytes(file.originalSize)}
                                        </p>
                                        <p className="text-gray-600">
                                            Optimized size: {formatBytes(file.optimizedSize)}
                                        </p>
                                        <p className="text-green-600">
                                            Reduced by: {file.compressionRatio}
                                        </p>
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

export default UploadImages;