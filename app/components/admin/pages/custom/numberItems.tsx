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

interface NumberItemsProps {
    onChange?: (numberItems: NumberItems[]) => void;
    value?: NumberItems[]
}

interface FormDataProps {
    number: string;
    icon?: string;
    text?: string;
}

interface NumberItems {
    id: string;
    number?: string;
    icon?: string;
    text?: string;
}

const NumberItems: React.FC<NumberItemsProps> = ({
    onChange,
    value = []
}) => {
    const [numberItems, setNumberItems] = useState<NumberItems[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        number: '',
        icon: '',
        text: ''
    });
    const [editingCard, setEditingCard] = useState<NumberItems | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize numberItems with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const numberItemsWithIds = value.map(numberRowItem => ({
                ...numberRowItem,
                id: numberRowItem.id || Date.now().toString()
            }));
            setNumberItems(numberItemsWithIds);
        }
    }, [value]);

    const handleAddNumberRow = () => {
        if (numberItems.length >= 3) {
            return;
        }

        const newService: NumberItems = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedNumberItems = [...numberItems, newService];
        setNumberItems(updatedNumberItems);
        onChange?.(updatedNumberItems);
        setFormData({
            number: '',
            icon: '',
            text: ''
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

    const handleRemoveNumberRow = (id: string) => {
        const updatedNumberItems = numberItems.filter(numberRowItem => numberRowItem.id !== id);
        setNumberItems(updatedNumberItems);
        onChange?.(updatedNumberItems);
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedNumberItems = numberItems.map(numberRowItem =>
                numberRowItem.id === editingCard.id ? editingCard : numberRowItem
            );
            setNumberItems(updatedNumberItems);
            onChange?.(updatedNumberItems);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (numberRowItem: NumberItems) => {
        setEditingCard(numberRowItem);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            number: '',
            icon: '',
            text: ''
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
            {/* Add New NumberRow Button */}
            <div className="mb-8 flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            disabled={numberItems.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Number Row
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Number Row Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-number">Number</Label>
                                <Input
                                    id="add-number"
                                    name="number"
                                    value={formData?.number || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Number"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className='flex items-center gap-2 justify-between'>
                                    <Label htmlFor="add-icon">Icon</Label>
                                    <Link href={"https://lucide.dev/icons"} target='_blank' className='text-xs underline text-blue-600'>
                                        Explore Icons
                                    </Link>
                                </div>
                                <Input
                                    id="add-icon"
                                    name="icon"
                                    value={formData?.icon || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Icon name (e.g., Heart, Star)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="add-text">Text</Label>
                                <Input
                                    id="add-text"
                                    name="text"
                                    value={formData?.text || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Text"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddNumberRow}>
                                    Add Row
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* NumberRow Cards Display */}
            <div className="flex flex-col gap-6">
                {numberItems.map(numberRowItem => (
                    <div
                        key={numberRowItem.id}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
                    >
                        <button
                            onClick={() => handleRemoveNumberRow(numberRowItem.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Delete NumberRow"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => startEditing(numberRowItem)}
                            className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Edit NumberRow"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>

                        {/* Card Content */}
                        <div className="flex flex-col items-center text-center space-y-3 mt-4">
                            {/* Icon Display */}
                            {numberRowItem.icon && (
                                <div className="text-blue-600 text-2xl">
                                    {/* You can render Lucide icon dynamically here */}
                                    {renderIcon(numberRowItem.icon)}
                                </div>
                            )}

                            {/* Number Display */}
                            {numberRowItem.number && (
                                <div className="text-3xl font-bold text-gray-800">
                                    {numberRowItem.number}
                                </div>
                            )}

                            {/* Text Display */}
                            {numberRowItem.text && (
                                <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: numberRowItem.text }}></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {numberItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No numberItems added yet. Add up to 3 Number Row Item cards.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Number Row Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-number">Number</Label>
                            <Input
                                id="edit-number"
                                name="number"
                                value={editingCard?.number || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter Number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-icon">Icon</Label>
                            <Input
                                id="edit-icon"
                                name="icon"
                                value={editingCard?.icon || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter Icon name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-text">Text</Label>
                            <Input
                                id="edit-text"
                                name="text"
                                value={editingCard?.text || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter Text"
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

export default NumberItems;