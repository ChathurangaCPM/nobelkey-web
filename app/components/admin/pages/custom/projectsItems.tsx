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

interface ProjectItemsProps {
    onChange?: (projectItems: ProjectItems[]) => void;
    value?: ProjectItems[]
}

interface FormDataProps {
    title?: string;
    location?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

interface ProjectItems {
    id: string;
    title?: string;
    location?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

const ProjectItems: React.FC<ProjectItemsProps> = ({
    onChange,
    value = []
}) => {
    const [projectItems, setProjectItems] = useState<ProjectItems[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        location: '',
        description: '',
        link: '',
        imageUrl: '',
    });
    const [editingCard, setEditingCard] = useState<ProjectItems | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize projectItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const projectItemsWithIds = value.map(projectRowItems => ({
                ...projectRowItems,
                id: projectRowItems.id || Date.now().toString()
            }));
            setProjectItems(projectItemsWithIds);
        }
    }, [value]);

    const handleAddProjectItems = () => {
        if (projectItems.length >= 3) {
            return;
        }

        const newProject: ProjectItems = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedProjectItems = [...projectItems, newProject];
        setProjectItems(updatedProjectItems);
        onChange?.(updatedProjectItems);
        setFormData({
            title: '',
            location: '',
            description: '',
            link: '',
            imageUrl: '',
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

    const handleRemoveProjectItems = (id: string) => {
        const updatedProjectItems = projectItems.filter(projectRowItems => projectRowItems.id !== id);
        setProjectItems(updatedProjectItems);
        onChange?.(updatedProjectItems);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedProjectItems = projectItems.map(projectRowItems =>
                projectRowItems.id === editingCard.id ? editingCard : projectRowItems
            );
            setProjectItems(updatedProjectItems);
            onChange?.(updatedProjectItems);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (projectRowItems: ProjectItems) => {
        setEditingCard(projectRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            location: '',
            description: '',
            link: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New ProjectItems Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            disabled={projectItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Project Items
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0'>
                        <DialogHeader className='p-5'>
                            <DialogTitle>Add New Project Item</DialogTitle>
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
                                        placeholder="Enter Description"
                                        rows={5}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="add-location">Location</Label>
                                    <Input
                                        id="add-location"
                                        name="location"
                                        value={formData?.location || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location Name"
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="add-link">Link</Label>
                                    <Input
                                        id="add-link"
                                        name="link"
                                        value={formData?.link || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Link"
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
                                <Button onClick={handleAddProjectItems}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ProjectItems Cards Display */}
            <div className="border-t-[1px] border-black/10 px-0 pt-5 xl:pt-0 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full container mx-auto"
                >
                    <CarouselContent>
                        {projectItems.map((projectRowItems, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 ">
                                <div
                                    key={projectRowItems.id}
                                    className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                                >
                                    <button
                                        onClick={() => handleRemoveProjectItems(projectRowItems.id)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                        title="Delete ProjectItems"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => startEditing(projectRowItems)}
                                        className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                        title="Edit ProjectItems"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>


                                </div>
                                <div className="border-[1px] border-black/10 rounded-lg overflow-hidden shadow-xl shadow-black/5 bg-white block group">
                                    <div className="p-8 flex flex-col gap-5">
                                        <h3 className="font-headingFontExtraBold font-bold text-[15px]">{projectRowItems?.title || 'Title'}</h3>
                                        <p className="text-sm">{projectRowItems?.description}</p>
                                        <div className="font-bold text-sm">{projectRowItems?.location}</div>

                                        <LucideIcons.ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <Image src={projectRowItems?.imageUrl || 'https://dummyimage.com/600x350/ddd/fff'} className="w-full" width={600} height={350} alt="slider 1" />
                                    </div>

                                </div>

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden xl:flex" />
                    <CarouselNext className="hidden xl:flex" />
                </Carousel>
            </div>

            {projectItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No project items added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Project Items Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-0">
                            <div className="space-y-2">
                                <Label htmlFor="add-image">Image Upload</Label>

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
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={editingCard?.description || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Description"
                                    rows={5}
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

export default ProjectItems;