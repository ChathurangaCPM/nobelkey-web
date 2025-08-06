import { Input } from '@/components/ui/input';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

interface LocationSearchProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    defaultValue?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onPlaceSelect, defaultValue }) => {
    const [inputValue, setInputValue] = useState(defaultValue || '');
    const [isEditing, setIsEditing] = useState(false);
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!isEditing) {
            setInputValue(defaultValue || '');
        }
    }, [defaultValue, isEditing]);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address || place.name) {
                setInputValue(place.formatted_address || place.name || '');
                setIsEditing(false);
            }
            onPlaceSelect(place);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEditing(true);
        setInputValue(e.target.value);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        // Small delay to allow onPlaceChanged to fire first if a place was selected
        setTimeout(() => {
            if (!autocompleteRef.current?.getPlace()) {
                setIsEditing(false);
                setInputValue(defaultValue || '');
            }
        }, 200);
    };

    if (!isLoaded) {
        return <Input type="text" placeholder="Loading..." disabled />;
    }

    return (
        <div className="relative w-full">
            <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                    fields: ["formatted_address", "geometry", "name", "place_id"]
                }}
            >
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search for a location..."
                    className="w-full"
                />
            </Autocomplete>
        </div>
    );
};

export default LocationSearch;