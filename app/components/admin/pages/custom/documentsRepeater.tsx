import React, { useEffect, useState } from 'react';
import { Plus, X, Edit2, FileText, Download } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import DocumentSelector from '../../documentSelector';

interface DocumentsRepeaterProps {
    onChange?: (documentsRepeaterItems: DocumentsRepeater[]) => void;
    value?: DocumentsRepeater[]
}

interface FormDataProps {
    fileUrl?: string;
    fileName?: string;
}

interface DocumentsRepeater {
    id: string;
    fileUrl?: string;
    fileName?: string;
}

const DocumentsRepeater: React.FC<DocumentsRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [documentsRepeaterItems, setDocumentsRepeater] = useState<DocumentsRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        fileUrl: '',
        fileName: '',
    });
    const [editingCard, setEditingCard] = useState<DocumentsRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize documentsRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const documentsRepeaterItemsWithIds = value.map(documentsRowItems => ({
                ...documentsRowItems,
                id: documentsRowItems.id || Date.now().toString()
            }));
            setDocumentsRepeater(documentsRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddDocumentsRepeater = () => {

        const newProject: DocumentsRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedDocumentsRepeater = [...documentsRepeaterItems, newProject];
        setDocumentsRepeater(updatedDocumentsRepeater);
        onChange?.(updatedDocumentsRepeater);
        setFormData({
            fileUrl: '',
            fileName: '',
        });
        setIsAddDialogOpen(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (editingCard) {
            setEditingCard({
                ...editingCard,
                [name]: value
            });
        }
    };

    const handleRemoveDocumentsRepeater = (id: string) => {
        const updatedDocumentsRepeater = documentsRepeaterItems.filter(documentsRowItems => documentsRowItems.id !== id);
        setDocumentsRepeater(updatedDocumentsRepeater);
        onChange?.(updatedDocumentsRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedDocumentsRepeater = documentsRepeaterItems.map(documentsRowItems =>
                documentsRowItems.id === editingCard.id ? editingCard : documentsRowItems
            );
            setDocumentsRepeater(updatedDocumentsRepeater);
            onChange?.(updatedDocumentsRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (documentsRowItems: DocumentsRepeater) => {
        setEditingCard(documentsRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            fileUrl: '',
            fileName: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New DocumentsRepeater Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Row Items
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0'>
                        <DialogHeader className='p-5'>
                            <DialogTitle>Add New Row Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-5 pb-3">
                                
                                <div className="space-y-2">
                                    <Label>Document File</Label>
                                    <DocumentSelector
                                        value={formData?.fileUrl || ''}
                                        onChange={(files) => {
                                            const file = files[0];
                                            if (file) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    fileUrl: file.url,
                                                    fileName: file.title
                                                }));
                                            }
                                        }}
                                        removeDocument={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fileUrl: '',
                                                fileName: ''
                                            }));
                                        }}
                                    />
                                </div>


                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddDocumentsRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2">
                {documentsRepeaterItems.map((documentsRowItems, index) => (
                    <div key={index} className="relative">
                        <div
                            key={documentsRowItems.id}
                            className="absolute top-2 right-2 z-20 p-6"
                        >
                            <button
                                onClick={() => handleRemoveDocumentsRepeater(documentsRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete DocumentsRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(documentsRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit DocumentsRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <div className="border rounded-lg p-2 bg-white shadow-sm">
                            
                            {documentsRowItems?.fileUrl && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                                    <FileText size={20} className="text-green-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">
                                            {documentsRowItems?.fileName || 'Document'}
                                        </p>
                                        <p className="text-xs text-gray-500">Attached file</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(documentsRowItems.fileUrl, '_blank')}
                                        className="flex items-center gap-1"
                                    >
                                        <Download size={14} />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {documentsRepeaterItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No link Items added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Link Items Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-0">
                            
                            <div className="space-y-2">
                                <Label>Document File</Label>
                                <DocumentSelector
                                    value={editingCard?.fileUrl || ''}
                                    onChange={(files) => {
                                        const file = files[0];
                                        if (file && editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                fileUrl: file.url,
                                                fileName: file.title
                                            });
                                        }
                                    }}
                                    removeDocument={() => {
                                        if (editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                fileUrl: '',
                                                fileName: ''
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>


                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditSubmit}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DocumentsRepeater;
