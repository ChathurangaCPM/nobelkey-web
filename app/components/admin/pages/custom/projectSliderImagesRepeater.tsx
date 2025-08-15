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

interface ProjectSliderImagesRepeaterProps {
    onChange?: (projectImagesItems: ProjectSliderImagesRepeater[]) => void;
    value?: ProjectSliderImagesRepeater[]
}

interface FormDataProps {
    imageUrl?: string;
}

interface ProjectSliderImagesRepeater {
    id: string;
    imageUrl?: string;
}

const ProjectSliderImagesRepeater: React.FC<ProjectSliderImagesRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [projectImagesItems, setProjectImagesRepeater] = useState<ProjectSliderImagesRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        imageUrl: ''
    });
    const [editingCard, setEditingCard] = useState<ProjectSliderImagesRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize projectImagesItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const projectImagesItemsWithIds = value.map(productRowItems => ({
                ...productRowItems,
                id: productRowItems.id || Date.now().toString()
            }));
            setProjectImagesRepeater(projectImagesItemsWithIds);
        }
    }, [value]);

    const handleAddProjectSliderImagesRepeater = () => {
        if (projectImagesItems.length >= 3) {
            return;
        }

        const newProject: ProjectSliderImagesRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedProjectSliderImagesRepeater = [...projectImagesItems, newProject];
        setProjectImagesRepeater(updatedProjectSliderImagesRepeater);
        onChange?.(updatedProjectSliderImagesRepeater);
        setFormData({
            imageUrl: ''
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

    const handleRemoveProjectSliderImagesRepeater = (id: string) => {
        const updatedProjectSliderImagesRepeater = projectImagesItems.filter(productRowItems => productRowItems.id !== id);
        setProjectImagesRepeater(updatedProjectSliderImagesRepeater);
        onChange?.(updatedProjectSliderImagesRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedProjectSliderImagesRepeater = projectImagesItems.map(productRowItems =>
                productRowItems.id === editingCard.id ? editingCard : productRowItems
            );
            setProjectImagesRepeater(updatedProjectSliderImagesRepeater);
            onChange?.(updatedProjectSliderImagesRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (productRowItems: ProjectSliderImagesRepeater) => {
        setEditingCard(productRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            imageUrl: ''
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New ProjectSliderImagesRepeater Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Items
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0'>
                        <DialogHeader className='p-5'>
                            <DialogTitle>Add New Link Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-5">


                                <div className="space-y-2">
                                    <Label htmlFor="add-image">Image Upload</Label>
                                    <ImageSelector
                                        value={formData?.imageUrl || ''}
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

                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddProjectSliderImagesRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-3">

                {projectImagesItems.map((productRowItems, index) => (
                    <div className="border-[1px] rounded-2xl overflow-hidden">
                        <div
                            key={productRowItems.id}
                            className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            <button
                                onClick={() => handleRemoveProjectSliderImagesRepeater(productRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete ProjectSliderImagesRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(productRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit ProjectSliderImagesRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>

                            <Image src={productRowItems?.imageUrl || ''} alt="" width={400} height={400} />
                        </div>


                    </div>
                ))}
            </div>

            {projectImagesItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No items added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Items Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-0">
                            <div className="space-y-2">
                                <Label htmlFor="add-image">Image Upload</Label>
                                <ImageSelector
                                    value={editingCard?.imageUrl || ''}
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

export default ProjectSliderImagesRepeater;