import React, { useEffect, useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import ImageSelector from '../../imageSelector';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

interface FaqRepeaterProps {
    onChange?: (faqRepeaterItems: FaqRepeater[]) => void;
    value?: FaqRepeater[]
}

interface FormDataProps {
    title?: string;
    description?: string;
}

interface FaqRepeater {
    id: string;
    title?: string;
    description?: string;
}

const FaqRepeater: React.FC<FaqRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [faqRepeaterItems, setFaqRepeater] = useState<FaqRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
    });
    const [editingCard, setEditingCard] = useState<FaqRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize faqRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const faqRepeaterItemsWithIds = value.map(chooseRowItems => ({
                ...chooseRowItems,
                id: chooseRowItems.id || Date.now().toString()
            }));
            setFaqRepeater(faqRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddFaqRepeater = () => {

        const newProject: FaqRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedFaqRepeater = [...faqRepeaterItems, newProject];
        setFaqRepeater(updatedFaqRepeater);
        onChange?.(updatedFaqRepeater);
        setFormData({
            title: '',
            description: '',
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

    const handleRemoveFaqRepeater = (id: string) => {
        const updatedFaqRepeater = faqRepeaterItems.filter(chooseRowItems => chooseRowItems.id !== id);
        setFaqRepeater(updatedFaqRepeater);
        onChange?.(updatedFaqRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedFaqRepeater = faqRepeaterItems.map(chooseRowItems =>
                chooseRowItems.id === editingCard.id ? editingCard : chooseRowItems
            );
            setFaqRepeater(updatedFaqRepeater);
            onChange?.(updatedFaqRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (chooseRowItems: FaqRepeater) => {
        setEditingCard(chooseRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            description: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New FaqRepeater Button */}
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
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-5">
                                
                                <div className="space-y-2">
                                    <Label htmlFor="add-faq-title">Title</Label>
                                    <Input
                                        id="add-faq-title"
                                        name="title"
                                        value={formData?.title || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-faq-description">Description</Label>
                                    <Textarea
                                        id="add-faq-description"
                                        name="description"
                                        value={formData?.description || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Description"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddFaqRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 border-[1px] border-black/10 border-r-0 border-b-0">
                {faqRepeaterItems.map((chooseRowItems, index) => (
                    <div key={index} className="border-r-[1px] relative border-b-[1px] border-black/10 p-12 flex flex-col group gap-5 transition-all ease-in-out duration-150 hover:bg-[#3C51A3] hover:border-transparent hover:shadow-2xl hover:text-white">
                        <div
                            key={chooseRowItems.id}
                            className="absolute top-2 right-2 z-20 p-6"
                        >
                            <button
                                onClick={() => handleRemoveFaqRepeater(chooseRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete FaqRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(chooseRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit FaqRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <div className="w-full flex flex-col gap-5">
                            <h4 className="font-bold">{chooseRowItems?.title}</h4>

                            <p className="text-sm">{chooseRowItems?.description}</p>
                        </div>
                    </div>
                ))}
            </div>


            {faqRepeaterItems.length === 0 && (
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
                                <Label htmlFor="edit-faq-title">Title</Label>
                                <Input
                                    id="edit-faq-title"
                                    name="title"
                                    value={editingCard?.title || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-faq-description">Description</Label>
                                <Textarea
                                    id="edit-faq-description"
                                    name="description"
                                    value={editingCard?.description || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Description"
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

export default FaqRepeater;