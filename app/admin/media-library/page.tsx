'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Eye, Image, FileText } from "lucide-react";
import ImageSelector from "@/app/components/admin/imageSelector";
import DocumentSelector from "@/app/components/admin/documentSelector";
import FileSelector from "@/app/components/admin/fileSelector";
import UploadFiles from "@/app/components/admin/common/uploadFiles";

interface MediaFile {
    _id: string;
    url: string;
    title: string;
    alt: string;
    fileCategory: 'images' | 'documents';
    mimeType: string;
    fileSize?: number;
    s3Key?: string;
    s3Bucket?: string;
    createdAt: string;
}

const MediaLibraryPage = () => {
    const [allFiles, setAllFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [selectedFile, setSelectedFile] = useState('');

    // Load all files
    const loadFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/media');
            const { files } = await response.json();
            setAllFiles(files);
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleDelete = async (fileId: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`/api/admin/media/delete?id=${fileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAllFiles(prev => prev.filter(file => file._id !== fileId));
            } else {
                alert('Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const getFileIcon = (file: MediaFile) => {
        if (file.fileCategory === 'images') {
            return <Image size={16} className="text-blue-500" />;
        }
        return <FileText size={16} className="text-green-500" />;
    };

    const handleUploadComplete = (files: any[]) => {
        // Refresh the file list
        loadFiles();
    };

    const images = allFiles.filter(file => file.fileCategory === 'images');
    const documents = allFiles.filter(file => file.fileCategory === 'documents');

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Media Library</h1>
                    <p className="text-gray-600">Manage your images and documents stored in AWS S3</p>
                </div>
                <Badge variant="outline" className="text-sm">
                    Total Files: {allFiles.length}
                </Badge>
            </div>

            <Tabs defaultValue="library" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="library">Library</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="selectors">Selectors Demo</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="space-y-4">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All Files ({allFiles.length})</TabsTrigger>
                            <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
                            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {allFiles.map((file) => (
                                    <Card key={file._id} className="overflow-hidden">
                                        <div className="aspect-square relative bg-gray-100">
                                            {file.fileCategory === 'images' ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <FileText size={48} className="text-gray-400 mb-2" />
                                                    <span className="text-xs text-gray-500 text-center px-2">
                                                        {file.title}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getFileIcon(file)}
                                                <h3 className="font-medium text-sm truncate">{file.title}</h3>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {file.fileCategory}
                                                </Badge>
                                                {file.fileSize && (
                                                    <span>{formatBytes(file.fileSize)}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => window.open(file.url, '_blank')}
                                                >
                                                    <Eye size={12} className="mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = file.url;
                                                        link.download = file.title;
                                                        link.click();
                                                    }}
                                                >
                                                    <Download size={12} className="mr-1" />
                                                    Download
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(file._id)}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="images">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {images.map((file) => (
                                    <Card key={file._id} className="overflow-hidden">
                                        <div className="aspect-square relative">
                                            <img
                                                src={file.url}
                                                alt={file.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-3">
                                            <h3 className="font-medium text-sm truncate mb-2">{file.title}</h3>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => window.open(file.url, '_blank')}
                                                >
                                                    <Eye size={12} className="mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(file._id)}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {documents.map((file) => (
                                    <Card key={file._id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <FileText size={24} className="text-green-500" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">{file.title}</h3>
                                                    <p className="text-xs text-gray-500">{file.mimeType}</p>
                                                </div>
                                            </div>
                                            {file.fileSize && (
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Size: {formatBytes(file.fileSize)}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => window.open(file.url, '_blank')}
                                                >
                                                    <Eye size={12} className="mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = file.url;
                                                        link.download = file.title;
                                                        link.click();
                                                    }}
                                                >
                                                    <Download size={12} className="mr-1" />
                                                    Download
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(file._id)}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Images</CardTitle>
                                <CardDescription>Upload images (max 5MB each)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UploadFiles 
                                    acceptedTypes="images" 
                                    onUpload={handleUploadComplete}
                                    maxFiles={5}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Documents</CardTitle>
                                <CardDescription>Upload documents (max 10MB each)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UploadFiles 
                                    acceptedTypes="documents" 
                                    onUpload={handleUploadComplete}
                                    maxFiles={5}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Any Files</CardTitle>
                                <CardDescription>Upload both images and documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UploadFiles 
                                    acceptedTypes="all" 
                                    onUpload={handleUploadComplete}
                                    maxFiles={10}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="selectors" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Selector</CardTitle>
                                <CardDescription>Select images from library</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageSelector
                                    value={selectedImage}
                                    onChange={(files) => setSelectedImage(files[0]?.url || '')}
                                    removeImage={() => setSelectedImage('')}
                                />
                                {selectedImage && (
                                    <p className="text-xs text-gray-500 mt-2 break-all">
                                        Selected: {selectedImage}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Document Selector</CardTitle>
                                <CardDescription>Select documents from library</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DocumentSelector
                                    value={selectedDocument}
                                    onChange={(files) => setSelectedDocument(files[0]?.url || '')}
                                    removeDocument={() => setSelectedDocument('')}
                                />
                                {selectedDocument && (
                                    <p className="text-xs text-gray-500 mt-2 break-all">
                                        Selected: {selectedDocument}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Universal File Selector</CardTitle>
                                <CardDescription>Select any file type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileSelector
                                    value={selectedFile}
                                    onChange={(files) => setSelectedFile(files[0]?.url || '')}
                                    removeFile={() => setSelectedFile('')}
                                    acceptedTypes="all"
                                />
                                {selectedFile && (
                                    <p className="text-xs text-gray-500 mt-2 break-all">
                                        Selected: {selectedFile}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="stats">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{allFiles.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{images.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{documents.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatBytes(allFiles.reduce((total, file) => total + (file.fileSize || 0), 0))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Storage Information</CardTitle>
                            <CardDescription>Files are stored securely in AWS S3</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p><strong>Bucket:</strong> {process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'noblekey'}</p>
                                <p><strong>Region:</strong> {process.env.NEXT_PUBLIC_S3_REGION || 'ap-south-1'}</p>
                                <p><strong>Image Optimization:</strong> Enabled (JPEG/PNG compression)</p>
                                <p><strong>Max Image Size:</strong> 5MB</p>
                                <p><strong>Max Document Size:</strong> 10MB</p>
                                <p><strong>Supported Formats:</strong> Images (JPEG, PNG, GIF, WebP, SVG), Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP)</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MediaLibraryPage;
