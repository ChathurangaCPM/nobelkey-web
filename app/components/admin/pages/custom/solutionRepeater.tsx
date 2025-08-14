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

interface SolutionsRepeaterProps {
    onChange?: (solutionsRepeaterItems: SolutionsRepeater[]) => void;
    value?: SolutionsRepeater[]
}

interface FormDataProps {
    image?: string;
    link?: string;
    title?: string;
    tagline?: string;
    description?: string;
}

interface SolutionsRepeater {
    id: string;
    image?: string;
    title?: string;
    tagline?: string;
    link?: string;
    description?: string;
}

const SolutionsRepeater: React.FC<SolutionsRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [solutionsRepeaterItems, setSolutionsRepeater] = useState<SolutionsRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        image: '',
        title: '',
        tagline: '',
        link: '',
        description: '',
    });
    const [editingCard, setEditingCard] = useState<SolutionsRepeater | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize solutionsRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const solutionsRepeaterItemsWithIds = value.map(solutionsRowItems => ({
                ...solutionsRowItems,
                id: solutionsRowItems.id || Date.now().toString()
            }));
            setSolutionsRepeater(solutionsRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddSolutionsRepeater = () => {

        const newProject: SolutionsRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedSolutionsRepeater = [...solutionsRepeaterItems, newProject];
        setSolutionsRepeater(updatedSolutionsRepeater);
        onChange?.(updatedSolutionsRepeater);
        setFormData({
            image: '',
            title: '',
            tagline: '',
            link: '',
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

    const handleRemoveSolutionsRepeater = (id: string) => {
        const updatedSolutionsRepeater = solutionsRepeaterItems.filter(solutionsRowItems => solutionsRowItems.id !== id);
        setSolutionsRepeater(updatedSolutionsRepeater);
        onChange?.(updatedSolutionsRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedSolutionsRepeater = solutionsRepeaterItems.map(solutionsRowItems =>
                solutionsRowItems.id === editingCard.id ? editingCard : solutionsRowItems
            );
            setSolutionsRepeater(updatedSolutionsRepeater);
            onChange?.(updatedSolutionsRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (solutionsRowItems: SolutionsRepeater) => {
        setEditingCard(solutionsRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            image: '',
            title: '',
            tagline: '',
            link: '',
            description: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New SolutionsRepeater Button */}
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
                                <div className="space-y-2">
                                    <Label htmlFor="add-solution-title">Title</Label>
                                    <Input
                                        id="add-solution-title"
                                        name="title"
                                        value={formData?.title || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-solution-tagline">Tagline</Label>
                                    <Input
                                        id="add-solution-tagline"
                                        name="tagline"
                                        value={formData?.tagline || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Tagline"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-solution-description">Description</Label>
                                    <Textarea
                                        id="add-solution-description"
                                        name="description"
                                        value={formData?.description || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Description"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="add-solution-link">Link</Label>
                                    <Input
                                        id="add-solution-link"
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
                                <Button onClick={handleAddSolutionsRepeater}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 border-[1px] border-black/10 border-r-0 border-b-0">
                {solutionsRepeaterItems.map((solutionsRowItems, index) => (
                    <div key={index} className="border-r-[1px] relative border-b-[1px] border-black/10 p-12 flex flex-col group gap-5 transition-all ease-in-out duration-150 hover:bg-[#3C51A3] hover:border-transparent hover:shadow-2xl hover:text-white">
                        <div
                            key={solutionsRowItems.id}
                            className="absolute top-2 right-2 z-20 p-6"
                        >
                            <button
                                onClick={() => handleRemoveSolutionsRepeater(solutionsRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete SolutionsRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(solutionsRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit SolutionsRepeater"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>


                        </div>

                        <div className="w-full flex flex-col gap-5">
                            <h4 className="font-bold">{solutionsRowItems?.title}</h4>

                            <p className="text-sm">{solutionsRowItems?.description}</p>
                        </div>
                    </div>
                ))}
            </div>


            {solutionsRepeaterItems.length === 0 && (
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
                                <Label htmlFor="edit-faq-tagline">Tagline</Label>
                                <Input
                                    id="edit-faq-tagline"
                                    name="tagline"
                                    value={editingCard?.tagline || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter Tagline"
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

                            <div className="space-y-2">
                                <Label htmlFor="edit-faq-link">Link</Label>
                                <Input
                                    id="edit-faq-link"
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

export default SolutionsRepeater;