"use client";

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useAuthContext } from '@/providers/auth-provider';
import LocationSearch from '@/app/components/admin/common/googlePlaceSearch';

interface ThemeData {
    header?: {
        logo?: string;
        topLeftText?: string;
        mainContent?: Array<{
            id: number;
            topTitle: string;
            content: string;
        }>;
    };
    selectedHomePage?: string;
    locations?: Location[];
}

interface State {
    data?: {
        theme?: ThemeData;
    };
}

interface Location {
    id: string;
    name: string;
    locationData?: google.maps.places.PlaceResult | null;
    latitude: string;
    longitude: string;
}

const ManageLocationRoutes: React.FC = () => {
    const { state, setState } = useAuthContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [locations, setLocations] = useState<Location[]>([
        { id: '1', name: '', latitude: '', longitude: '' }
    ]);

    const addLocation = () => {
        const newLocation: Location = {
            id: crypto.randomUUID(),
            name: '',
            locationData: null,
            latitude: '',
            longitude: ''
        };
        setLocations([...locations, newLocation]);
    };

    const deleteLocation = (id: string) => {
        if (locations.length === 1) return; // Keep at least one row
        setLocations(locations.filter(loc => loc.id !== id));
    };

    const handleLocationSelect = (id: string, place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat().toString();
            const lng = place.geometry.location.lng().toString();
            const name = place.formatted_address || place.name || '';
            
            setLocations(locations.map(loc =>
                loc.id === id ? {
                    ...loc,
                    name: name,
                    locationData: place,
                    latitude: lat,
                    longitude: lng
                } : loc
            ));
        }
    };

    const updateLocation = (id: string, field: keyof Location, value: string) => {
        setLocations(locations.map(loc =>
            loc.id === id ? { ...loc, [field]: value } : loc
        ));
    };

    const saveLocations = async () => {
        try {
            setIsLoading(true);
            const payload = {
                type: 'locations',
                data: locations
            };

            const response = await fetch('/api/admin/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                toast.error("Something went wrong!", {
                    position: 'top-center'
                });
                throw new Error('Response not OK');
            }

            const { data } = await response.json();

            setState((prevState: State) => ({
                ...prevState,
                data: {
                    ...prevState?.data,
                    theme: {
                        ...prevState?.data?.theme,
                        locations: data?.locations,
                    }
                }
            }));

            toast.success("Successfully updated!", {
                position: 'top-center'
            });
        } catch (error) {
            console.log("error", error);
            
            toast.error("Failed to save settings. Please try again.", {
                position: 'top-center'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (state?.data?.theme?.locations) {
            setLocations(state.data.theme.locations);
        }
    }, [state?.data?.theme?.locations]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Locations</h1>
                <p className="text-muted-foreground text-sm">Manage your all supported locations</p>
            </div>

            <div className="space-y-4">
                {locations.map((location) => (
                    <div key={location.id} className="flex items-center gap-4">
                        <div className="flex-1">
                            <LocationSearch 
                                onPlaceSelect={(place) => handleLocationSelect(location.id, place)}
                                defaultValue={location.name}
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Latitude"
                                value={location.latitude}
                                onChange={(e) => updateLocation(location.id, 'latitude', e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Longitude"
                                value={location.longitude}
                                onChange={(e) => updateLocation(location.id, 'longitude', e.target.value)}
                                readOnly
                            />
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="p-2"
                                    disabled={locations.length === 1}
                                    variant="outline"
                                >
                                    <Trash2 size={20} className="text-red-500" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will permanently delete this location.
                                        {location.name && ` Location: ${location.name}`}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteLocation(location.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}

                <div className="flex justify-end gap-4">
                    <Button 
                        onClick={addLocation} 
                        variant="outline"
                        disabled={isLoading}
                    >
                        Add New Location
                    </Button>
                    <Button 
                        onClick={saveLocations}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Location'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ManageLocationRoutes;