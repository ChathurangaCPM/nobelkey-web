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

interface ProductItemRepeaterProps {
    onChange?: (productRepeaterItems: ProductItemRepeater[]) => void;
    value?: ProductItemRepeater[]
}

interface FormDataProps {
    title?: string;
    description?: string;
}

interface ProductItemRepeater {
    id: string;
    title?: string;
    description?: string;
}

const ProductItemRepeater: React.FC<ProductItemRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [productRepeaterItems, setProductItemRepeater] = useState<ProductItemRepeater[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: ''
    });
    const [editingCard, setEditingCard] = useState<ProductItemRepeater | null>(null);
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
            setProductItemRepeater(productRepeaterItemsWithIds);
        }
    }, [value]);

    const handleAddProductItemRepeater = () => {
        if (productRepeaterItems.length >= 3) {
            return;
        }

        const newProject: ProductItemRepeater = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedProductItemRepeater = [...productRepeaterItems, newProject];
        setProductItemRepeater(updatedProductItemRepeater);
        onChange?.(updatedProductItemRepeater);
        setFormData({
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

    const handleRemoveProductItemRepeater = (id: string) => {
        const updatedProductItemRepeater = productRepeaterItems.filter(productRowItems => productRowItems.id !== id);
        setProductItemRepeater(updatedProductItemRepeater);
        onChange?.(updatedProductItemRepeater);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedProductItemRepeater = productRepeaterItems.map(productRowItems =>
                productRowItems.id === editingCard.id ? editingCard : productRowItems
            );
            setProductItemRepeater(updatedProductItemRepeater);
            onChange?.(updatedProductItemRepeater);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (productRowItems: ProductItemRepeater) => {
        setEditingCard(productRowItems);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            title: '',
            description: '',
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="">
            {/* Add New ProductItemRepeater Button */}
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
                                
                            </div>

                            <div className="flex justify-end gap-4 py-4 px-5">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddProductItemRepeater}>
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
                                onClick={() => handleRemoveProductItemRepeater(productRowItems.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete ProductItemRepeater"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => startEditing(productRowItems)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit ProductItemRepeater"
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

export default ProductItemRepeater;