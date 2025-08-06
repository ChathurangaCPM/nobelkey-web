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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageSelector from '../../imageSelector';
import Image from 'next/image';

interface TestimonialsRightRepeaterProps {
    onChange?: (testimonialsRight: TestimonialsRightCard[]) => void;
    value?: TestimonialsRightCard[]
}

interface FormDataProps {
    iconUrl: string;
    title: string;
    description: string;
}

interface TestimonialsRightCard {
    id: string;
    iconUrl: string;
    title: string;
    description: string;
}

const TestimonialsRightRepeater: React.FC<TestimonialsRightRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [testimonialsRight, setTestimonials] = useState<TestimonialsRightCard[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        iconUrl: "",
        title: "",
        description: ""
    });
    const [editingCard, setEditingCard] = useState<TestimonialsRightCard | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize testimonialsRight with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const testimonialsRightWithIds = value.map(testimonial => ({
                ...testimonial,
                id: testimonial.id || Date.now().toString()
            }));
            setTestimonials(testimonialsRightWithIds);
        }
    }, [value]);

    const handleAddTestimonial = () => {

        const newTestimonial: TestimonialsRightCard = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedTestimonials = [...testimonialsRight, newTestimonial];

        setTestimonials(updatedTestimonials);
        onChange?.(updatedTestimonials);
        setFormData({
            iconUrl: "",
            title: "",
            description: ""
        });
        setIsAddDialogOpen(false);
    };

    const handleRemoveTestimonial = (id: string) => {
        const updatedTestimonials = testimonialsRight.filter(testimonial => testimonial.id !== id);
        setTestimonials(updatedTestimonials);
        onChange?.(updatedTestimonials);
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

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedTestimonials = testimonialsRight.map(testimonial =>
                testimonial.id === editingCard.id ? editingCard : testimonial
            );
            setTestimonials(updatedTestimonials);
            onChange?.(updatedTestimonials);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (testimonial: TestimonialsRightCard) => {
        setEditingCard(testimonial);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            iconUrl: "",
            title: "",
            description: ""
        });
        setIsAddDialogOpen(false);
    };

    // Rest of the component remains the same
    return (
        <div className="">
            {/* Add New Testimonial Button */}
            <div className="mb-8 flex justify-between items-center">
                {/* <h2 className="text-2xl font-bold">Testimonial Cards</h2> */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Testimonial Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-image">Icon</Label>
                                <ImageSelector
                                    value={formData?.iconUrl}
                                    onChange={(file) => {
                                        if (file) {
                                            setFormData(prev => ({
                                                ...prev,
                                                iconUrl: file[0]?.url
                                            }));
                                        }
                                    }}
                                    removeImage={() => setFormData(prev => ({
                                        ...prev,
                                        iconUrl: ""
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter user name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={formData?.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddTestimonial}>
                                    Add Testimonial
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Testimonial Cards Display */}
            <div className="flex flex-col gap-2">
                {testimonialsRight.map(testimonial => (
                    <div
                        key={testimonial.id}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5"
                    >

                        <div className='flex flex-col gap-3'>
                            <div className='w-20 h-20 relative'>
                                <Image
                                    src={testimonial?.iconUrl || "/api/placeholder/400/200"}
                                    alt={testimonial.title}
                                    className="w-full h-20 object-cover"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-semibold mb-2">{testimonial.title}</h3>
                                <p className="text-gray-600 mb-4">{testimonial.description}</p>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={() => handleRemoveTestimonial(testimonial.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Delete Testimonial"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => startEditing(testimonial)}
                                className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                                title="Edit Testimonial"
                            >
                                <Edit2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {testimonialsRight.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No testimonialsRight added yet.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Testimonial Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Image Upload</Label>
                            <ImageSelector
                                value={editingCard?.iconUrl || ''}
                                onChange={(file) => {
                                    if (file && editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            iconUrl: file[0]?.url
                                        });
                                    }
                                }}
                                removeImage={() => {
                                    if (editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            iconUrl: ""
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={editingCard?.title || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={editingCard?.description || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter description"
                                rows={3}
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

export default TestimonialsRightRepeater;