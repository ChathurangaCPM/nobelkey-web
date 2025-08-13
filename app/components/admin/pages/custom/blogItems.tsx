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

interface BlogItemsProps {
    onChange?: (blogRepeaterItems: BlogItems[]) => void;
    value?: BlogItems[]
}

interface FormDataProps {
    link?: string;
    title?: string;
    description?: string;
    publishData?: string;
}

interface BlogItems {
    id: string;
    link?: string;
    title?: string;
    description?: string;
    publishData?: string;
}

const BlogItems: React.FC<BlogItemsProps> = ({
    onChange,
    value = []
}) => {
    const [blogRepeaterItems, setBlogItems] = useState<BlogItems[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        link: '',
        title: '',
        description: '',
        publishData: ''
    });
    const [editingCard, setEditingCard] = useState<BlogItems | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize blogRepeaterItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const blogRepeaterItemsWithIds = value.map(linksRowItems => ({
                ...linksRowItems,
                id: linksRowItems.id || Date.now().toString()
            }));
            setBlogItems(blogRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddBlogItems = () => {
        if (blogRepeaterItems.length >= 3) {
            return;
        }

        const newProject: BlogItems = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedBlogItems = [...blogRepeaterItems, newProject];
        setBlogItems(updatedBlogItems);
        onChange?.(updatedBlogItems);
        setFormData({
            link: '',
            title: '',
            description: '',
            publishData: ''
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

    const handleRemoveBlogItems = (id: string) => {
        const updatedBlogItems = blogRepeaterItems.filter(linksRowItems => linksRowItems.id !== id);
        setBlogItems(updatedBlogItems);
        onChange?.(updatedBlogItems);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedBlogItems = blogRepeaterItems.map(linksRowItems =>
                linksRowItems.id === editingCard.id ? editingCard : linksRowItems
            );
            setBlogItems(updatedBlogItems);
            onChange?.(updatedBlogItems);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (linksRowItems: BlogItems) => {
        setEditingCard(linksRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            link: '',
            title: '',
            description: '',
            publishData: ''
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New BlogItems Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        {blogRepeaterItems && blogRepeaterItems?.length < 2 && <Button
                            className="flex items-center gap-2"
                            disabled={blogRepeaterItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Blog Items
                        </Button>}
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
                                    <Label htmlFor="add-publishData">Publish Data</Label>
                                    <Input
                                        id="add-publishData"
                                        name="publishData"
                                        value={formData?.publishData || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Publish Data Ex: Feb 10, 2025"
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
                                <Button onClick={handleAddBlogItems}>
                                    Add Card
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="gird grid-cols-1">

                {blogRepeaterItems.map((linksRowItems, index) => (
                    <div className="border-[1px] rounded-2xl overflow-hidden">
                        <div
                            key={linksRowItems.id}
                            className="relative bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            <button
                                onClick={() => handleRemoveBlogItems(linksRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete BlogItems"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(linksRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit BlogItems"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>

                            <h2 className='font-semibold text-lg'>{linksRowItems?.title}</h2>
                            <p className='text-sm'>{linksRowItems?.description}</p>
                        </div>


                    </div>
                ))}
            </div>

            {blogRepeaterItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No blog items added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Blog Items Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-0">

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
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={editingCard?.description || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Description"
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

export default BlogItems;