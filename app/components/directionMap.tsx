'use client';

import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Libraries
} from '@react-google-maps/api';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DirectionsMapProps {
  originLat: number | string;
  originLng: number | string;
  destinationLat: number | string;
  destinationLng: number | string;
  apiKey: string;
}

interface MapStyles {
  width: string;
  height: string;
}

const containerStyle: MapStyles = {
  width: '100%',
  height: '400px'
};

const DirectionsMap: React.FC<DirectionsMapProps> = ({
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  apiKey
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const origin: Coordinates = {
    lat: typeof originLat === 'string' ? parseFloat(originLat) : originLat,
    lng: typeof originLng === 'string' ? parseFloat(originLng) : originLng
  };

  const destination: Coordinates = {
    lat: typeof destinationLat === 'string' ? parseFloat(destinationLat) : destinationLat,
    lng: typeof destinationLng === 'string' ? parseFloat(destinationLng) : destinationLng
  };

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ): void => {
    if (response !== null && status === 'OK') {
      setDirections(response);
      // Extract distance information
      const route = response.routes[0];
      if (route && route.legs && route.legs[0] && route.legs[0].distance) {
        setDistance(route.legs[0].distance.text);
      }
    } else {
      setError('Could not calculate directions');
    }
  };

  // Libraries needed for the map
  const libraries: Libraries = ['places'];

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={origin}
          zoom={12}
        >
          {origin && destination && (
            <DirectionsService
              options={{
                destination,
                origin,
                travelMode: 'DRIVING' as google.maps.TravelMode
              }}
              callback={directionsCallback}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      {distance && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-medium">Distance: {distance}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default DirectionsMap;