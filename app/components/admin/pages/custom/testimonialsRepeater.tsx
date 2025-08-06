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

interface TestimonialsRepeaterProps {
    onChange?: (testimonials: TestimonialCard[]) => void;
    value?: TestimonialCard[]
}

interface FormDataProps {
    useName: string;
    testimonial: string;
    profileImageUrl: string;
    role: string;
    ratingCount: number
}

interface TestimonialCard {
    id: string;
    useName: string;
    testimonial: string;
    profileImageUrl: string;
    role: string;
    ratingCount: number
}

const TestimonialsRepeater: React.FC<TestimonialsRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [testimonials, setTestimonials] = useState<TestimonialCard[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        useName: "",
        testimonial: "",
        profileImageUrl: "",
        role: "",
        ratingCount: 1
    });
    const [editingCard, setEditingCard] = useState<TestimonialCard | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize testimonials with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const testimonialsWithIds = value.map(testimonial => ({
                ...testimonial,
                id: testimonial.id || Date.now().toString()
            }));
            setTestimonials(testimonialsWithIds);
        }
    }, [value]);

    const handleAddTestimonial = () => {

        const newTestimonial: TestimonialCard = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedTestimonials = [...testimonials, newTestimonial];

        setTestimonials(updatedTestimonials);
        onChange?.(updatedTestimonials);
        setFormData({
            useName: "",
            testimonial: "",
            profileImageUrl: "",
            role: "",
            ratingCount: 1
        });
        setIsAddDialogOpen(false);
    };

    const handleRemoveTestimonial = (id: string) => {
        const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
        setTestimonials(updatedTestimonials);
        onChange?.(updatedTestimonials);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name === 'user-name' ? 'useName' : 
             name === 'description' ? 'testimonial' : 
             name === 'star-counter' ? 'ratingCount' : name]: 
             name === 'star-counter' ? Math.min(Math.max(1, Number(value)), 5) : value
        }));
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (editingCard) {
            setEditingCard({
                ...editingCard,
                [name === 'user-name' ? 'useName' : 
                 name === 'description' ? 'testimonial' : 
                 name === 'rating-count' ? 'ratingCount' : name]: 
                 name === 'rating-count' ? Math.min(Math.max(1, Number(value)), 5) : value
            });
        }
    };

    const handleEditSubmit = () => {
        if (editingCard) {
            const updatedTestimonials = testimonials.map(testimonial =>
                testimonial.id === editingCard.id ? editingCard : testimonial
            );
            setTestimonials(updatedTestimonials);
            onChange?.(updatedTestimonials);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (testimonial: TestimonialCard) => {
        setEditingCard(testimonial);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({
            useName: "",
            testimonial: "",
            profileImageUrl: "",
            role: "",
            ratingCount: 1
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
                                <Label htmlFor="add-image">Image Upload</Label>
                                <ImageSelector
                                    value={formData?.profileImageUrl}
                                    onChange={(file) => {
                                        if (file) {
                                            setFormData(prev => ({
                                                ...prev,
                                                profileImageUrl: file[0]?.url
                                            }));
                                        }
                                    }}
                                    removeImage={() => setFormData(prev => ({
                                        ...prev,
                                        profileImageUrl: ""
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-user-name">User Name</Label>
                                <Input
                                    id="add-user-name"
                                    name="user-name"
                                    value={formData.useName}
                                    onChange={handleInputChange}
                                    placeholder="Enter user name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-role">User Role</Label>
                                <Input
                                    id="add-role"
                                    name="role"
                                    value={formData?.role}
                                    onChange={handleInputChange}
                                    placeholder="Enter user role"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-description">Testimonial</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={formData?.testimonial}
                                    onChange={handleInputChange}
                                    placeholder="Enter testimonial description"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-star-counter">Star Counter</Label>
                                <Input
                                    id="add-star-counter"
                                    name="star-counter"
                                    type="number"
                                    max={5}
                                    value={formData?.ratingCount}
                                    onChange={handleInputChange}
                                    placeholder="Enter Star Count"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(testimonial => (
                    <div
                        key={testimonial.id}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
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
                        <Image
                            src={testimonial?.profileImageUrl || "/api/placeholder/400/200"}
                            alt={testimonial.useName || ''}
                            className="w-full h-48 object-cover"
                            width={50}
                            height={50}
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{testimonial.useName}</h3>
                            <p className="text-gray-600 mb-4">{testimonial.role}</p>
                            <p className="text-gray-600 mb-4">{testimonial.testimonial}</p>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No testimonials added yet.
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
                                value={editingCard?.profileImageUrl || ''}
                                onChange={(file) => {
                                    if (file && editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            profileImageUrl: file[0]?.url
                                        });
                                    }
                                }}
                                removeImage={() => {
                                    if (editingCard) {
                                        setEditingCard({
                                            ...editingCard,
                                            profileImageUrl: ""
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-user-name">User name</Label>
                            <Input
                                id="edit-user-name"
                                name="user-name"
                                value={editingCard?.useName || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter user name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-user-role">User role</Label>
                            <Input
                                id="edit-user-role"
                                name="user-role"
                                value={editingCard?.role || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter user role"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={editingCard?.testimonial || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter testimonial description"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-rating-count">Rating count</Label>
                            <Input
                                id="edit-rating-count"
                                name="rating-count"
                                max={5}
                                value={editingCard?.ratingCount || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter rating count"
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

export default TestimonialsRepeater;