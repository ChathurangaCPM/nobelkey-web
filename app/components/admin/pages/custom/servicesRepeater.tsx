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

interface ServiceRepeaterProps {
    onChange?: (services: ServiceCard[]) => void;
    value?: ServiceCard[]
}

interface FormDataProps {
    title: string;
    description: string;
    imageUrl: string;
    url: string;
}

interface ServiceCard {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
}

const ServiceRepeater: React.FC<ServiceRepeaterProps> = ({
    onChange,
    value = []
}) => {
    const [services, setServices] = useState<ServiceCard[]>([]);
    const [formData, setFormData] = useState<FormDataProps>({
        title: '',
        description: '',
        imageUrl: '',
        url: ''
    });
    const [editingCard, setEditingCard] = useState<ServiceCard | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Initialize services with value prop when component mounts or value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            // Ensure each item has an id
            const servicesWithIds = value.map(service => ({
                ...service,
                id: service.id || Date.now().toString()
            }));
            setServices(servicesWithIds);
        }
    }, [value]);

    const handleAddService = () => {
        if (services.length >= 3) {
            return;
        }

        const newService: ServiceCard = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedServices = [...services, newService];
        setServices(updatedServices);
        onChange?.(updatedServices);
        setFormData({ title: '', description: '', imageUrl: '', url: '' });
        setIsAddDialogOpen(false);
    };

    const handleRemoveService = (id: string) => {
        const updatedServices = services.filter(service => service.id !== id);
        setServices(updatedServices);
        onChange?.(updatedServices);
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
            const updatedServices = services.map(service =>
                service.id === editingCard.id ? editingCard : service
            );
            setServices(updatedServices);
            onChange?.(updatedServices);
            setEditingCard(null);
            setIsEditDialogOpen(false);
        }
    };

    const startEditing = (service: ServiceCard) => {
        setEditingCard(service);
        setIsEditDialogOpen(true);
    };

    const resetAndCloseAddDialog = () => {
        setFormData({ title: '', description: '', imageUrl: '', url: '' });
        setIsAddDialogOpen(false);
    };

    // Rest of the component remains the same
    return (
        <div className="">
            {/* Add New Service Button */}
            <div className="mb-8 flex justify-between items-center">
                {/* <h2 className="text-2xl font-bold">Service Cards</h2> */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            disabled={services.length >= 3}
                        >
                            <Plus className="h-5 w-5" />
                            Add New Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Service Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-image">Image Upload</Label>
                                <ImageSelector 
                                    value={formData?.imageUrl}
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
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter service title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter service description"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-url">Read More URL</Label>
                                <Input
                                    id="add-url"
                                    name="url"
                                    type="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    placeholder="Enter read more link URL"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" onClick={resetAndCloseAddDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddService}>
                                    Add Service
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Service Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div
                        key={service.id}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <button
                            onClick={() => handleRemoveService(service.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Delete Service"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => startEditing(service)}
                            className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Edit Service"
                        >
                            <Edit2 className="h-5 w-5" />
                        </button>
                        <Image
                            src={service.imageUrl || "/api/placeholder/400/200"}
                            alt={service.title || ''}
                            className="w-full h-48 object-cover"
                            width={50}
                            height={50}
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <a
                                href={service.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Read More →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No services added yet. Add up to 3 service cards.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Service Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Image Upload</Label>
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
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={editingCard?.title || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter service title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={editingCard?.description || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter service description"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-url">Read More URL</Label>
                            <Input
                                id="edit-url"
                                name="url"
                                type="url"
                                value={editingCard?.url || ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter read more link URL"
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

export default ServiceRepeater;