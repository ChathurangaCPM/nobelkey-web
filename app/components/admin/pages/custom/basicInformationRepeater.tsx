import React, { useEffect, useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
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

interface BasicInformationRepeaterProps {
    onChange?: (basicInformationRepeaterItems: BasicInformationRepeater[]) => void;
    value?: BasicInformationRepeater[]
}

interface FormDataProps {
    title?: string;
    content?: string;
}

interface BasicInformationRepeater {
    id: string;
    title?: string;
    content?: string;
}

const BasicInformationRepeater: React.FC<BasicInformationRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [basicInformationRepeaterItems, setBasicInformationRepeater] = useState<BasicInformationRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        content: '',
    });
    const [editingCard, setEditingCard] = useState<BasicInformationRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize basicInformationRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const basicInformationRepeaterItemsWithIds = value.map(basicInformationRowItems => ({
                ...basicInformationRowItems,
                id: basicInformationRowItems.id || Date.now().toString()
            }));
            setBasicInformationRepeater(basicInformationRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddBasicInformationRepeater = () => {

        const newProject: BasicInformationRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedBasicInformationRepeater = [...basicInformationRepeaterItems, newProject];
        setBasicInformationRepeater(updatedBasicInformationRepeater);
        onChange?.(updatedBasicInformationRepeater);
        setFormData({
            title: '',
            content: '',
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

    const handleRemoveBasicInformationRepeater = (id: string) => {
        const updatedBasicInformationRepeater = basicInformationRepeaterItems.filter(basicInformationRowItems => basicInformationRowItems.id !== id);
        setBasicInformationRepeater(updatedBasicInformationRepeater);
        onChange?.(updatedBasicInformationRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedBasicInformationRepeater = basicInformationRepeaterItems.map(basicInformationRowItems =>
                basicInformationRowItems.id === editingCard.id ? editingCard : basicInformationRowItems
            );
            setBasicInformationRepeater(updatedBasicInformationRepeater);
            onChange?.(updatedBasicInformationRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (basicInformationRowItems: BasicInformationRepeater) => {
        setEditingCard(basicInformationRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            content: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            <div className="flex flex-col gap-1 mb-5">
                {basicInformationRepeaterItems.map((basicInformationRowItems, index) => (
                    <div key={index} className="relative">
                        <div
                            key={basicInformationRowItems.id}
                            className="absolute top-0 right-0 z-20 p-0"
                        >
                            <button
                                onClick={() => handleRemoveBasicInformationRepeater(basicInformationRowItems.id)}
                                className="absolute top-0 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete BasicInformationRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(basicInformationRowItems)}
                                className="absolute top-0 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit BasicInformationRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <div className='grid grid-cols-2 gap-1 text-sm'>
                            <p className='p-2 bg-blue-200'>{basicInformationRowItems?.title}</p>
                            <p className='p-2 bg-blue-100'>{basicInformationRowItems?.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Add New BasicInformationRepeater Button */}
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
                                    <Label htmlFor="add-title">Title</Label>
                                    <Input
                                        id="add-title"
                                        name="title"
                                        value={formData?.title || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-content">Content</Label>
                                    <Input
                                        id="add-content"
                                        name="content"
                                        value={formData?.content || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Content"
                                    />
                                </div>


                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddBasicInformationRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>




            {basicInformationRepeaterItems.length === 0 && (
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
                                <Label htmlFor="add-title">Title</Label>
                                <Input
                                    id="add-title"
                                    name="title"
                                    value={editingCard?.title || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-content">Content</Label>
                                <Input
                                    id="add-content"
                                    name="content"
                                    value={editingCard?.content || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Content"
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

export default BasicInformationRepeater;