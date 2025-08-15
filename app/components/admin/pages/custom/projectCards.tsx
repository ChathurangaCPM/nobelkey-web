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

interface ProjectsItemsRepeaterProps {
    onChange?: (productRepeaterItems: ProjectsItemsRepeater[]) => void;
    value?: ProjectsItemsRepeater[]
}

interface FormDataProps {
    title?: string;
    description?: string;
    location?: string;
    link?: string;
    imageUrl?: string;
}

interface ProjectsItemsRepeater {
    id: string;
    title?: string;
    description?: string;
    location?: string;
    link?: string;
    imageUrl?: string;
}

const ProjectsItemsRepeater: React.FC<ProjectsItemsRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [productRepeaterItems, setProjectsItemsRepeater] = useState<ProjectsItemsRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
        location: '',
        link: '',
        imageUrl: ''
    });
    const [editingCard, setEditingCard] = useState<ProjectsItemsRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize productRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const productRepeaterItemsWithIds = value.map(productRowItems => ({
                ...productRowItems,
                id: productRowItems.id || Date.now().toString()
            }));
            setProjectsItemsRepeater(productRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddProjectsItemsRepeater = () => {
        if (productRepeaterItems.length >= 3) {
            return;
        }

        const newProject: ProjectsItemsRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedProjectsItemsRepeater = [...productRepeaterItems, newProject];
        setProjectsItemsRepeater(updatedProjectsItemsRepeater);
        onChange?.(updatedProjectsItemsRepeater);
        setFormData({
            title: '',
            description: '',
            location: '',
            link: '',
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

    const handleRemoveProjectsItemsRepeater = (id: string) => {
        const updatedProjectsItemsRepeater = productRepeaterItems.filter(productRowItems => productRowItems.id !== id);
        setProjectsItemsRepeater(updatedProjectsItemsRepeater);
        onChange?.(updatedProjectsItemsRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedProjectsItemsRepeater = productRepeaterItems.map(productRowItems =>
                productRowItems.id === editingCard.id ? editingCard : productRowItems
            );
            setProjectsItemsRepeater(updatedProjectsItemsRepeater);
            onChange?.(updatedProjectsItemsRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (productRowItems: ProjectsItemsRepeater) => {
        setEditingCard(productRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            link: '',
            imageUrl: ''
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New ProjectsItemsRepeater Button */}
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
                                    <Label htmlFor="add-description">Description</Label>
                                    <Textarea
                                        id="add-description"
                                        name="description"
                                        value={formData?.description || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter description"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-location">Location</Label>
                                    <Input
                                        id="add-location"
                                        name="location"
                                        value={formData?.location || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter location"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-link">Link</Label>
                                    <Input
                                        id="add-link"
                                        name="link"
                                        value={formData?.link || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter link"
                                    />
                                </div>

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
                                <Button onClick={handleAddProjectsItemsRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-3">

                {productRepeaterItems.map((productRowItems, index) => (
                    <div className="border-[1px] rounded-2xl overflow-hidden">
                        <div
                            key={productRowItems.id}
                            className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            <button
                                onClick={() => handleRemoveProjectsItemsRepeater(productRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete ProjectsItemsRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(productRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit ProjectsItemsRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>

                            <h2 className='font-semibold text-lg'>{productRowItems?.title}</h2>
                            <p className='text-sm'>{productRowItems?.description}</p>
                        </div>


                    </div>
                ))}
            </div>

            {productRepeaterItems.length === 0 && (
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
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={editingCard?.description || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-location">Location</Label>
                                <Input
                                    id="add-location"
                                    name="location"
                                    value={editingCard?.location || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Location"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-link">Link</Label>
                                <Input
                                    id="add-link"
                                    name="link"
                                    value={editingCard?.link || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Link"
                                />
                            </div>

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

export default ProjectsItemsRepeater;