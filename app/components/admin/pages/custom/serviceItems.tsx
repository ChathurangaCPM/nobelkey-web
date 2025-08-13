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

interface ServiceItemsProps {
    onChange?: (serviceItems: ServiceItems[]) => void;
    value?: ServiceItems[]
}

interface FormDataProps {
    title?: string;
    tagline?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

interface ServiceItems {
    id: string;
    title?: string;
    tagline?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

const ServiceItems: React.FC<ServiceItemsProps> = ({
    onChange,
    value = []
}) => {
    const [serviceItems, setServiceItems] = useState<ServiceItems[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        tagline: '',
        description: '',
        link: '',
        imageUrl: '',
    });
    const [editingCard, setEditingCard] = useState<ServiceItems | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize serviceItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const serviceItemsWithIds = value.map(serviceRowItems => ({
                ...serviceRowItems,
                id: serviceRowItems.id || Date.now().toString()
            }));
            setServiceItems(serviceItemsWithIds);
        }
    }, [value]);

    const handleAddServiceItems = () => {
        if (serviceItems.length >= 3) {
            return;
        }

        const newService: ServiceItems = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedServiceItems = [...serviceItems, newService];
        setServiceItems(updatedServiceItems);
        onChange?.(updatedServiceItems);
        setFormData({
            title: '',
            tagline: '',
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

    const handleRemoveServiceItems = (id: string) => {
        const updatedServiceItems = serviceItems.filter(serviceRowItems => serviceRowItems.id !== id);
        setServiceItems(updatedServiceItems);
        onChange?.(updatedServiceItems);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedServiceItems = serviceItems.map(serviceRowItems =>
                serviceRowItems.id === editingCard.id ? editingCard : serviceRowItems
            );
            setServiceItems(updatedServiceItems);
            onChange?.(updatedServiceItems);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (serviceRowItems: ServiceItems) => {
        setEditingCard(serviceRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            tagline: '',
            description: '',
            link: '',
        });
        setIsAddDialogOpen(false);
    };

    // Function to dynamically render Lucide icons
    const renderIcon = (iconName: string) => {
        if (!iconName) return null;

        // Convert icon name to PascalCase if needed
        const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

        // Get the icon component from Lucide
        const IconComponent = (LucideIcons as any)[formattedIconName];

        if (!IconComponent) {
            // Fallback if icon not found
            return <span className="text-xs text-gray-400">Icon not found</span>;
        }

        return <IconComponent className="h-8 w-8" />;
    };


    return (
        <div className="">
            {/* Add New ServiceItems Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            disabled={serviceItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Service Items
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0'>
                        <DialogHeader className='p-5'>
                            <DialogTitle>Add New Service Items Card</DialogTitle>
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
                                    <Label htmlFor="add-tagline">Tagline</Label>
                                    <Input
                                        id="add-tagline"
                                        name="tagline"
                                        value={formData?.tagline || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Tagline"
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
                                    <Label htmlFor="add-link">Link</Label>
                                    <Input
                                        id="add-link"
                                        name="link"
                                        value={formData?.link || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Link"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddServiceItems}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ServiceItems Cards Display */}
            <div className="border-t-[1px] border-black/10 px-0 pt-5 xl:pt-0 md:w-11/12 xl:px-0 xl:max-w-[1400px] mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full container mx-auto"
                >
                    <CarouselContent>
                        {serviceItems.map((serviceRowItems, index) => (
                            <CarouselItem key={index}
                                className="md:basis-1/2 xl:border-r-[1px] border-black/10 [&:nth-child(3n)]:border-r-0">
                                <div
                                    key={serviceRowItems.id}
                                    className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                                >
                                    <button
                                        onClick={() => handleRemoveServiceItems(serviceRowItems.id)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                        title="Delete ServiceItems"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => startEditing(serviceRowItems)}
                                        className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                        title="Edit ServiceItems"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>


                                </div>
                                <div className="p-2">
                                    <div className="transition-all group pb-10 ease-in-out duration-100 border-b-[4px] border-b-transparent hover:border-b-[#3C51A3]">
                                        <div className="overflow-hidden rounded-lg relative">
                                            <Image src={serviceRowItems?.imageUrl || 'https://dummyimage.com/600x750/ddd/fff'} className="" width={600} height={750} alt={serviceRowItems?.title || ''} />
                                            <div className="absolute bottom-0 w-full px-10 py-5 text-white z-10">
                                                <h4 className="font-semibold text-[22px] leading-[20px]">{serviceRowItems?.title}</h4>
                                                <span className="text-xs font-medium">{serviceRowItems?.tagline}</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-[30%] z-0 bg-gradient-to-b from-transparent to-black opacity-85 scale-125 blur-md"></div>
                                        </div>

                                        <div className="p-5 px-10 text-sm flex flex-col gap-5">
                                            <p>{serviceRowItems?.description}</p>
                                            <LucideIcons.ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] opacity-0 group-hover:opacity-100 duration-100 " />
                                        </div>
                                    </div>
                                </div>

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden xl:flex" />
                    <CarouselNext className="hidden xl:flex" />
                </Carousel>
            </div>

            {serviceItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No service items added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Service Items Card</DialogTitle>
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
                                    onChange={handleInputChange}
                                    placeholder="Enter Title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="add-tagline">Tagline</Label>
                                <Input
                                    id="add-tagline"
                                    name="tagline"
                                    value={editingCard?.tagline || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Tagline"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={editingCard?.description || ''}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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

export default ServiceItems;