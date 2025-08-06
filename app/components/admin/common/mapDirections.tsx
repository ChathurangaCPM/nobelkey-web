'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    DirectionsService,
    DirectionsRenderer,
    Marker,
    Libraries
} from '@react-google-maps/api';

interface LatLng {
    lat: number;
    lng: number;
}

interface MapDirectionsProps {
    origin?: LatLng;
    destination?: LatLng;
    className?: string;
    mapHeight?: string;
    originIconUrl?: string;
    destinationIconUrl?: string;
}

interface RouteInfo {
    distance: string;
    duration: string;
}

const defaultOrigin: LatLng = { lat: 6.9271, lng: 79.8612 };
const defaultDestination: LatLng = { lat: 6.0535, lng: 80.2210 };

// Default custom icons - Replace these URLs with your actual icon URLs
const DEFAULT_ORIGIN_ICON = '/images/pickup.png';
const DEFAULT_DESTINATION_ICON = '/images/dropoff.png';

const libraries: Libraries = ['places'];

// Custom map style with yellow-friendly theme
const mapStyles = [
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#F5F5DC" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#E6F3F7" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#FFDEAD" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#EEE8AA" }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#FFE4B5" }]
    }
];

const MapDirections: React.FC<MapDirectionsProps> = ({
    origin = defaultOrigin,
    destination = defaultDestination,
    className = '',
    mapHeight = '400px',
    originIconUrl = DEFAULT_ORIGIN_ICON,
    destinationIconUrl = DEFAULT_DESTINATION_ICON
}) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [shouldFetchDirections, setShouldFetchDirections] = useState(true);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);


    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const mapContainerStyle = {
        width: '100%',
        height: mapHeight,
    };

    const center: LatLng = {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2
    };

    const mapOptions: google.maps.MapOptions = {
        // Disable all controls and interactions
        disableDefaultUI: true,
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        gestureHandling: 'none',
        keyboardShortcuts: false,
        styles: mapStyles,
        backgroundColor: '#F5F5DC',
        clickableIcons: false
    };

    const directionsCallback = useCallback((
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
    ): void => {
        if (status === 'OK' && result) {
            setDirections(result);
            setError(null);

            const route = result.routes[0].legs[0];
            setRouteInfo({
                distance: route.distance?.text || 'N/A',
                duration: route.duration?.text || 'N/A'
            });
        } else {
            setError(`Error fetching directions: ${status}`);
            setDirections(null);
            setRouteInfo(null);
        }
        setShouldFetchDirections(false);
    }, []);

    useEffect(() => {
        setDirections(null);
        setRouteInfo(null);
        setShouldFetchDirections(true);
    }, [origin.lat, origin.lng, destination.lat, destination.lng]);

    if (loadError) {
        return (
            <div className="p-4 text-red-500">
                Error loading maps: {loadError.message}
            </div>
        );
    }

    if (!isLoaded) {
        return <div className="p-4">Loading maps...</div>;
    }

    const originIcon = {
        url: originIconUrl,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
        labelOrigin: new google.maps.Point(16, -8)
    };

    const destinationIcon = {
        url: destinationIconUrl,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
        labelOrigin: new google.maps.Point(16, -8)
    };

    return (
        <div className={`w-full ${className}`}>
            {error ? (
                <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">
                    {error}
                </div>
            ) : <div>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                    options={mapOptions}
                >
                    {!directions && (
                        <>
                            <Marker
                                position={origin}
                                icon={originIcon}
                            />
                            <Marker
                                position={destination}
                                icon={destinationIcon}
                            />
                        </>
                    )}

                    {shouldFetchDirections && (
                        <DirectionsService
                            options={{
                                destination,
                                origin,
                                travelMode: google.maps.TravelMode.DRIVING
                            }}
                            callback={directionsCallback}
                        />
                    )}

                    {directions && (
                        <>
                            <DirectionsRenderer
                                options={{
                                    directions,
                                    suppressMarkers: true,
                                    polylineOptions: {
                                        strokeColor: '#000000',
                                        strokeWeight: 3,
                                        strokeOpacity: 0.8
                                    }
                                }}
                            />
                            <Marker
                                position={origin}
                                icon={originIcon}
                            />
                            <Marker
                                position={destination}
                                icon={destinationIcon}
                            />
                        </>
                    )}
                </GoogleMap>
                {routeInfo && (
                    <div className="p-4 bg-yellow-400">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-8">
                                <div>
                                    <span className="text-amber-800 font-medium">Distance: </span>
                                    <span className="text-amber-900">{routeInfo.distance}</span>
                                </div>
                                <div>
                                    <span className="text-amber-800 font-medium">Duration: </span>
                                    <span className="text-amber-900">{routeInfo.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>}




        </div>
    );
};

export default MapDirections;