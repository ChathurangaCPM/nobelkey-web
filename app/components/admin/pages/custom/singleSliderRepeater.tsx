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

interface SingleSliderRepeaterProps {
    onChange?: (singleSliderRepeaterItems: SingleSliderRepeater[]) => void;
    value?: SingleSliderRepeater[]
}

interface FormDataProps {
    image?: string;
}

interface SingleSliderRepeater {
    id: string;
    image?: string;
}

const SingleSliderRepeater: React.FC<SingleSliderRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [singleSliderRepeaterItems, setSingleSliderRepeater] = useState<SingleSliderRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        image: '',
    });
    const [editingCard, setEditingCard] = useState<SingleSliderRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize singleSliderRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const singleSliderRepeaterItemsWithIds = value.map(singleSliderRowItems => ({
                ...singleSliderRowItems,
                id: singleSliderRowItems.id || Date.now().toString()
            }));
            setSingleSliderRepeater(singleSliderRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddSingleSliderRepeater = () => {

        const newProject: SingleSliderRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedSingleSliderRepeater = [...singleSliderRepeaterItems, newProject];
        
        setSingleSliderRepeater(updatedSingleSliderRepeater);
        onChange?.(updatedSingleSliderRepeater);
        setFormData({
            image: '',
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

    const handleRemoveSingleSliderRepeater = (id: string) => {
        const updatedSingleSliderRepeater = singleSliderRepeaterItems.filter(singleSliderRowItems => singleSliderRowItems.id !== id);
        setSingleSliderRepeater(updatedSingleSliderRepeater);
        onChange?.(updatedSingleSliderRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedSingleSliderRepeater = singleSliderRepeaterItems.map(singleSliderRowItems =>
                singleSliderRowItems.id === editingCard.id ? editingCard : singleSliderRowItems
            );
            setSingleSliderRepeater(updatedSingleSliderRepeater);
            onChange?.(updatedSingleSliderRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (singleSliderRowItems: SingleSliderRepeater) => {
        setEditingCard(singleSliderRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            image: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New SingleSliderRepeater Button */}
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
                                    <Label htmlFor="add-image">Image Upload</Label>
                                    <ImageSelector
                                        value={formData?.image || ''}
                                        onChange={(file) => {
                                            if (file) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    image: file[0]?.url
                                                }));
                                            }
                                        }}
                                        removeImage={() => setFormData(prev => ({
                                            ...prev,
                                            image: ""
                                        }))}
                                    />
                                </div>
                                

                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddSingleSliderRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2">
                {singleSliderRepeaterItems.map((singleSliderRowItems, index) => (
                    <div key={index} className="relative">
                        <div
                            key={singleSliderRowItems.id}
                            className="absolute top-2 right-2 z-20 p-6"
                        >
                            <button
                                onClick={() => handleRemoveSingleSliderRepeater(singleSliderRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete SingleSliderRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(singleSliderRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit SingleSliderRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <Image src={singleSliderRowItems?.image || ''} alt={singleSliderRowItems?.id || ''} width={1200} height={500} className='w-full'/>
                    </div>
                ))}
            </div>


            {singleSliderRepeaterItems.length === 0 && (
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
                                <Label htmlFor="add-image">Image Upload</Label>
                                <ImageSelector
                                    value={editingCard?.image || ''}
                                    onChange={(file) => {
                                        if (file) {
                                            setFormData(prev => ({
                                                ...prev,
                                                image: file[0]?.url
                                            }));
                                        }
                                    }}
                                    removeImage={() => setFormData(prev => ({
                                        ...prev,
                                        image: ""
                                    }))}
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

export default SingleSliderRepeater;