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

interface ChooseItemsRepeaterProps {
    onChange?: (chooseItemsRepeaterItems: ChooseItemsRepeater[]) => void;
    value?: ChooseItemsRepeater[]
}

interface FormDataProps {
    icon?: string;
    hoverIcon?: string;
    title?: string;
    description?: string;
}

interface ChooseItemsRepeater {
    id: string;
    icon?: string;
    hoverIcon?: string;
    title?: string;
    description?: string;
}

const ChooseItemsRepeater: React.FC<ChooseItemsRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [chooseItemsRepeaterItems, setChooseItemsRepeater] = useState<ChooseItemsRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        icon: '',
        hoverIcon: '',
        title: '',
        description: '',
    });
    const [editingCard, setEditingCard] = useState<ChooseItemsRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize chooseItemsRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const chooseItemsRepeaterItemsWithIds = value.map(chooseRowItems => ({
                ...chooseRowItems,
                id: chooseRowItems.id || Date.now().toString()
            }));
            setChooseItemsRepeater(chooseItemsRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddChooseItemsRepeater = () => {
        // if (chooseItemsRepeaterItems.length >= 3) {
        //     return;
        // }

        const newProject: ChooseItemsRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedChooseItemsRepeater = [...chooseItemsRepeaterItems, newProject];
        setChooseItemsRepeater(updatedChooseItemsRepeater);
        onChange?.(updatedChooseItemsRepeater);
        setFormData({
            icon: '',
            hoverIcon: '',
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

    const handleRemoveChooseItemsRepeater = (id: string) => {
        const updatedChooseItemsRepeater = chooseItemsRepeaterItems.filter(chooseRowItems => chooseRowItems.id !== id);
        setChooseItemsRepeater(updatedChooseItemsRepeater);
        onChange?.(updatedChooseItemsRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedChooseItemsRepeater = chooseItemsRepeaterItems.map(chooseRowItems =>
                chooseRowItems.id === editingCard.id ? editingCard : chooseRowItems
            );
            setChooseItemsRepeater(updatedChooseItemsRepeater);
            onChange?.(updatedChooseItemsRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (chooseRowItems: ChooseItemsRepeater) => {
        setEditingCard(chooseRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            icon: '',
            hoverIcon: '',
            title: '',
            description: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New ChooseItemsRepeater Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Card Items
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0'>
                        <DialogHeader className='p-5'>
                            <DialogTitle>Add New Card Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-5">
                                <div className='flex flex-col gap-5'>
                                    <div className="space-y-2">
                                        <Label htmlFor="add-nbk-icon">Upload Icon</Label>
                                        <ImageSelector
                                            value={formData?.icon || ''}
                                            onChange={(file) => {
                                                if (file) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        icon: file[0]?.url
                                                    }));
                                                }
                                            }}
                                            removeImage={() => setFormData(prev => ({
                                                ...prev,
                                                icon: ""
                                            }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="add-nbk-hoverIcon">Hover Icon</Label>
                                        <ImageSelector
                                            value={formData?.hoverIcon || ''}
                                            onChange={(file) => {
                                                if (file) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hoverIcon: file[0]?.url
                                                    }));
                                                }
                                            }}
                                            removeImage={() => setFormData(prev => ({
                                                ...prev,
                                                hoverIcon: ""
                                            }))}
                                        />
                                    </div>

                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-nbk-title">Title</Label>
                                    <Input
                                        id="add-nbk-title"
                                        name="title"
                                        value={formData?.title || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-nbk-description">Description</Label>
                                    <Textarea
                                        id="add-nbk-description"
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
                                <Button onClick={handleAddChooseItemsRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 border-[1px] border-black/10 border-r-0 border-b-0">
                {chooseItemsRepeaterItems.map((chooseRowItems, index) => (
                    <div key={index} className="border-r-[1px] relative border-b-[1px] border-black/10 p-12 flex flex-col group gap-5 transition-all ease-in-out duration-150 hover:bg-[#3C51A3] hover:border-transparent hover:shadow-2xl hover:text-white">
                        <div
                            key={chooseRowItems.id}
                            className="absolute top-2 right-2 z-20 p-6"
                        >
                            <button
                                onClick={() => handleRemoveChooseItemsRepeater(chooseRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete ChooseItemsRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(chooseRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit ChooseItemsRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>
                        <div className="mb-5">
                            <Image src={chooseRowItems?.icon || 'https://dummyimage.com/100x100/ddd/fff'} alt="" width={80} height={80} className="group-hover:hidden" />
                            <Image src={chooseRowItems?.hoverIcon || 'https://dummyimage.com/100x100/000/fff'} alt="" width={80} height={80} className="hidden group-hover:flex" />
                        </div>

                        <div className="w-full flex flex-col gap-5">
                            <h4 className="font-bold">{chooseRowItems?.title}</h4>

                            <p className="text-sm">{chooseRowItems?.description}</p>
                        </div>
                    </div>
                ))}
            </div>


            {chooseItemsRepeaterItems.length === 0 && (
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
                                <Label htmlFor="add-nbk-image">Image Upload</Label>

                                <ImageSelector
                                    value={editingCard?.icon || ''}
                                    onChange={(file) => {
                                        if (file && editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                icon: file[0]?.url
                                            });
                                        }
                                    }}
                                    removeImage={() => {
                                        if (editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                icon: ""
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-nbk-image">Hover Icon</Label>

                                <ImageSelector
                                    value={editingCard?.hoverIcon || ''}
                                    onChange={(file) => {
                                        if (file && editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                hoverIcon: file[0]?.url
                                            });
                                        }
                                    }}
                                    removeImage={() => {
                                        if (editingCard) {
                                            setEditingCard({
                                                ...editingCard,
                                                hoverIcon: ""
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-nbk-title">Title</Label>
                                <Input
                                    id="add-nbk-title"
                                    name="title"
                                    value={editingCard?.title || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-nbk-description">Description</Label>
                                <Textarea
                                    id="add-nbk-description"
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

export default ChooseItemsRepeater;