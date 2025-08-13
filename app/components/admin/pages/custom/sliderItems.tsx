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
import ImageSelector from '../../imageSelector';
import Image from 'next/image';

interface SliderItemsProps {
    onChange?: (sliderItems: SliderItems[]) => void;
    value?: SliderItems[]
}

interface FormDataProps {
    imageUrl: string;
}

interface SliderItems {
    id: string;
    imageUrl: string;
}

const SliderItems: React.FC<SliderItemsProps> = ({
    onChange,
    value = []
}) => {
    const [sliderItems, setSliderItems] = useState<SliderItems[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        imageUrl: '',
    });
    const [editingCard, setEditingCard] = useState<SliderItems | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize sliderItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const sliderItemsWithIds = value.map(sliderItem => ({
                ...sliderItem,
                id: sliderItem.id || Date.now().toString()
            }));
            setSliderItems(sliderItemsWithIds);
        }
    }, [value]);

    const handleAddSlider = () => {
        if (sliderItems.length >= 3) {
            return;
        }

        const newService: SliderItems = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedSliderItems = [...sliderItems, newService];
        setSliderItems(updatedSliderItems);
        onChange?.(updatedSliderItems);
        setFormData({ imageUrl: '' });
        setIsAddDialogOpen(false);
    };

    const handleRemoveSlider = (id: string) => {
        const updatedSliderItems = sliderItems.filter(sliderItem => sliderItem.id !== id);
        setSliderItems(updatedSliderItems);
        onChange?.(updatedSliderItems);
    };

   
    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedSliderItems = sliderItems.map(sliderItem =>
                sliderItem.id === editingCard.id ? editingCard : sliderItem
            );
            setSliderItems(updatedSliderItems);
            onChange?.(updatedSliderItems);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (sliderItem: SliderItems) => {
        setEditingCard(sliderItem);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({ imageUrl: ''});
        setIsAddDialogOpen(false);
    };

    // Rest of the component remains the same
    return (
        <div className="">
            {/* Add New Slider Button */}
            <div className="mb-8 flex justify-between items-center">
                {/* <h2 className="text-2xl font-bold">Slider Cards</h2> */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            disabled={sliderItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Slider
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Slider Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-image">Image Upload</Label>
                                <ImageSelector 
                                    value={formData?.imageUrl}
                                    onChange={(file) => {                                        
                                        if (file) {
                                            setFormData(prev => ({
                                                ...prev,
                                                imageUrl: file[0]?.url
                                            }));
                                        }
                                    }}
                                    removeImage={() => setFormData(prev => ({
                                        ...prev,
                                        imageUrl: ""
                                    }))}
                                />
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddSlider}>
                                    Add Image
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Slider Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sliderItems.map(sliderItem => (
                    <div
                        key={sliderItem.id}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <button
                            onClick={() => handleRemoveSlider(sliderItem.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Delete Slider"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => startEditing(sliderItem)}
                            className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Edit Slider"
                        >
                            <Edit2 className="h-5 w-5" />
                        </button>
                        <Image
                            src={sliderItem.imageUrl || "/api/placeholder/400/200"}
                            alt={''}
                            className="w-full h-48 object-cover"
                            width={250}
                            height={250}
                        />
                    </div>
                ))}
            </div>

            {sliderItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No sliderItems added yet. Add up to 3 sliderItem cards.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Slider Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Image Upload</Label>
                            <ImageSelector 
                                value={editingCard?.imageUrl || ''}
                                onChange={(file) => {
                                    if (file && editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            imageUrl: file[0]?.url
                                        });
                                    }
                                }}
                                removeImage={() => {
                                    if (editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            imageUrl: ""
                                        });
                                    }
                                }}
                            />
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

export default SliderItems;