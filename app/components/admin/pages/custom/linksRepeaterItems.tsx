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

interface LinksRepeaterProps {
    onChange?: (linksRepeaterItems: LinksRepeater[]) => void;
    value?: LinksRepeater[]
}

interface FormDataProps {
    link?: string;
    imageUrl?: string;
}

interface LinksRepeater {
    id: string;
    link?: string;
    imageUrl?: string;
}

const LinksRepeater: React.FC<LinksRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [linksRepeaterItems, setLinksRepeater] = useState<LinksRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        link: '',
        imageUrl: '',
    });
    const [editingCard, setEditingCard] = useState<LinksRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize linksRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const linksRepeaterItemsWithIds = value.map(linksRowItems => ({
                ...linksRowItems,
                id: linksRowItems.id || Date.now().toString()
            }));
            setLinksRepeater(linksRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddLinksRepeater = () => {
        if (linksRepeaterItems.length >= 3) {
            return;
        }

        const newProject: LinksRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedLinksRepeater = [...linksRepeaterItems, newProject];
        setLinksRepeater(updatedLinksRepeater);
        onChange?.(updatedLinksRepeater);
        setFormData({
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

    const handleRemoveLinksRepeater = (id: string) => {
        const updatedLinksRepeater = linksRepeaterItems.filter(linksRowItems => linksRowItems.id !== id);
        setLinksRepeater(updatedLinksRepeater);
        onChange?.(updatedLinksRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedLinksRepeater = linksRepeaterItems.map(linksRowItems =>
                linksRowItems.id === editingCard.id ? editingCard : linksRowItems
            );
            setLinksRepeater(updatedLinksRepeater);
            onChange?.(updatedLinksRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (linksRowItems: LinksRepeater) => {
        setEditingCard(linksRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            link: '',
            imageUrl: ''
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New LinksRepeater Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        {linksRepeaterItems && linksRepeaterItems?.length < 2 && <Button
                            className="flex items-center gap-2"
                            disabled={linksRepeaterItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Link Items
                        </Button>}
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
                                <Button onClick={handleAddLinksRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="gird grid-cols-2">

                {linksRepeaterItems.map((linksRowItems, index) => (
                    <div className="">
                        <div
                            key={linksRowItems.id}
                            className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            <button
                                onClick={() => handleRemoveLinksRepeater(linksRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete LinksRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(linksRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit LinksRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <div className="lg:p-10 flex-1 flex items-center flex-col justify-center gap-5 lg:border-r-[1px] lg:border-black/10 group">
                            <Image src={linksRowItems?.imageUrl || 'https://dummyimage.com/600x250/ddd/fff'} alt={''} className="w-full" width={300} height={200} />
                            <LucideIcons.ArrowUpRight strokeWidth={2} size={30} className="text-[#3C51A3] transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                    </div>
                ))}
            </div>

            {linksRepeaterItems.length === 0 && (
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
                                <Label htmlFor="add-link">Link</Label>
                                <Input
                                    id="add-link"
                                    name="link"
                                    value={editingCard?.link || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Title"
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

export default LinksRepeater;