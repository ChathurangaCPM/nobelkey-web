"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TopTagline from './common/topTagline';
import { useSiteContext } from '@/providers/site-provider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import BookingDetailsView from './bookingDetailsView';

// Keep existing interfaces...
interface Vehicle {
  _id: string;
  image: string;
  vehicleName: string;
  initialCharge: number;
  perKmPrice: number;
  maxPassenger: number;
}

interface Fee {
  id: string;
  locationA: string;
  locationB: string;
  vehicle: Vehicle;
  fee: number;
  uniqueMappingId: string;
}

interface Location {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  locationData: object;
}

interface BookingWidgetProps {
  version?: number;
  className?: string;
  isPreview?: boolean;
  customTagline?: string;
  customTitle?: string;
}

const BookingWidget = ({ version, className, isPreview, customTagline, customTitle }: BookingWidgetProps) => {
  const [tripType, setTripType] = useState('one-way');
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const { siteState } = useSiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [baseFee, setBaseFee] = useState<number>(0);
  const [currentFee, setCurrentFee] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropLocation, setDropLocation] = useState<string>('');

  const [isOpenBookingDialog, setIsOpenBookingDialog] = useState<boolean>(false);

  // Calculate total passengers
  const totalPassengers = children + passengers;

  // Update available vehicles and fees when locations change
  useEffect(() => {
    if (pickupLocation && dropLocation) {
      const relevantFees = fees.filter(fee =>
      (fee.locationA === locations.find(l => l.id === pickupLocation)?.name &&
        fee.locationB === locations.find(l => l.id === dropLocation)?.name)
      );

      const vehicles = relevantFees.map(fee => ({
        ...fee.vehicle,
        fee: fee.fee
      }));

      setAvailableVehicles(vehicles);
      setSelectedVehicle('');
      setBaseFee(0);
      setCurrentFee(0);
      setErrorMessage('');
    } else {
      setAvailableVehicles([]);
      setSelectedVehicle('');
      setBaseFee(0);
      setCurrentFee(0);
      setErrorMessage('');
    }
  }, [pickupLocation, dropLocation, fees, locations]);

  useEffect(() => {
    if (siteState && Object.keys(siteState).length !== 0) {
      setLocations(siteState.locations);
      setFees(siteState.fees);
    }
  }, [siteState]);

  // Calculate fee based on passengers, vehicle capacity, and trip type
  const calculateFee = (vehicle: Vehicle, baseFeeAmount: number) => {
    if (totalPassengers > vehicle.maxPassenger) {
      return 0; // Return 0 to indicate invalid selection
    }

    // Calculate total fee including initial charge
    let totalFee = baseFeeAmount + vehicle.initialCharge;

    // Double the fee for round trips
    if (tripType === 'round-trip') {
      totalFee *= 2;
    }

    return totalFee;
  };

  // Update fee when vehicle is selected, passenger count changes, or trip type changes
  useEffect(() => {
    if (selectedVehicle && pickupLocation && dropLocation) {
      const relevantFee = fees.find(fee =>
        fee.vehicle._id === selectedVehicle &&
        fee.locationA === locations.find(l => l.id === pickupLocation)?.name &&
        fee.locationB === locations.find(l => l.id === dropLocation)?.name
      );

      if (relevantFee) {
        const selectedVehicleDetails = relevantFee.vehicle;
        if (totalPassengers > selectedVehicleDetails.maxPassenger) {
          setErrorMessage(`Total passengers (${totalPassengers}) exceed vehicle capacity (${selectedVehicleDetails.maxPassenger})`);
          setBaseFee(0);
          setCurrentFee(0);
        } else {
          setErrorMessage('');
          setBaseFee(relevantFee.fee + selectedVehicleDetails.initialCharge);
          const calculatedFee = calculateFee(selectedVehicleDetails, relevantFee.fee);
          setCurrentFee(calculatedFee);
        }
      }
    }
  }, [selectedVehicle, pickupLocation, dropLocation, passengers, children, tripType, fees, locations]);

  // Handle trip type change
  const handleTripTypeChange = (type: 'one-way' | 'round-trip') => {
    setTripType(type);
    // Recalculate fee based on new trip type
    if (selectedVehicle && baseFee > 0) {
      const selectedVehicleDetails = availableVehicles.find(v => v._id === selectedVehicle);
      if (selectedVehicleDetails) {
        const relevantFee = fees.find(fee =>
          fee.vehicle._id === selectedVehicle &&
          fee.locationA === locations.find(l => l.id === pickupLocation)?.name &&
          fee.locationB === locations.find(l => l.id === dropLocation)?.name
        );
        if (relevantFee) {
          const newFee = calculateFee(selectedVehicleDetails, relevantFee.fee);
          setCurrentFee(newFee);
        }
      }
    }
  };

  // Handle passenger count changes
  const handlePassengerChange = (type: 'adult' | 'children', increment: boolean) => {
    const selectedVehicleDetails = availableVehicles.find(v => v._id === selectedVehicle);
    const maxPassengers = selectedVehicleDetails?.maxPassenger || 1;

    if (type === 'adult') {
      const newPassengers = increment ? passengers + 1 : Math.max(1, passengers - 1);
      if (newPassengers + children <= maxPassengers) {
        setPassengers(newPassengers);
        setErrorMessage('');
      } else {
        setErrorMessage(`Cannot exceed maximum capacity of ${maxPassengers} passengers`);
      }
    } else {
      const newChildren = increment ? children + 1 : Math.max(0, children - 1);
      if (passengers + newChildren <= maxPassengers) {
        setChildren(newChildren);
        setErrorMessage('');
      } else {
        setErrorMessage(`Cannot exceed maximum capacity of ${maxPassengers} passengers`);
      }
    }
  };


  // Rest of the JSX remains the same until the trip type buttons...
  return (
    <div className={`relative z-20 w-full ${version === 2 ? 'full' : ''} ${className}`}>
      <TopTagline title={customTagline || "Online Booking"} className={`${version === 2 ? 'text-white' : ''}`} />
      <h1 className={`text-4xl font-bold mb-6`}>{customTitle || "Book Your Taxi Ride"}</h1>

      <Card className={`bg-transparent border-transparent ${version === 2 ? 'shadow-none' : ''} ${isPreview ? 'pointer-events-none' : ''}`}>
        {isPreview && <div className='absolute z-10 bg-black/30 w-full h-full flex items-center justify-center text-white backdrop-blur-sm'>
          <p className='pb-[100px]'>Booking widget will display here</p>
        </div>}

        {/* Trip Type Toggle */}
        <div className="flex mb-6 bg-gray-800 p-1">
          <Button
            variant={tripType === 'one-way' ? 'default' : 'ghost'}
            className={`flex-1 h-[50px] text-white rounded-none ${tripType === 'one-way' ? 'bg-gray-950' : 'hover:bg-white'}`}
            onClick={() => handleTripTypeChange('one-way')}
          >
            One way
          </Button>
          <Button
            variant={tripType === 'round-trip' ? 'default' : 'ghost'}
            className={`flex-1 h-[50px] text-white rounded-none ${tripType === 'round-trip' ? 'bg-gray-950' : 'hover:bg-white'}`}
            onClick={() => handleTripTypeChange('round-trip')}
          >
            Round Trip
          </Button>
        </div>

        {/* Rest of the existing JSX... */}
        {/* Location Selectors */}
        <div className={`${version === 2 ? 'flex items-start gap-5 w-full' : 'space-y-4'}`}>
          <div className={`${version === 2 ? 'space-y-0 flex-1' : 'space-y-2'}`}>
            <label className="text-sm text-white">Pickup From</label>
            <Select value={pickupLocation} onValueChange={setPickupLocation}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white rounded-none h-[50px]">
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {locations.map((location) => (
                  <SelectItem
                    key={location.id}
                    value={location.id}
                    disabled={location.id === dropLocation}
                    className={location.id === dropLocation ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {location.name}
                    {location.id === dropLocation && ' (Selected as Drop-off)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`${version === 2 ? 'space-y-0 flex-1' : 'space-y-2'}`}>
            <label className="text-sm text-white">Drop To</label>
            <Select value={dropLocation} onValueChange={setDropLocation}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white rounded-none h-[50px]">
                <SelectValue placeholder="Select drop location" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {locations.map((location) => (
                  <SelectItem
                    key={location.id}
                    value={location.id}
                    disabled={location.id === pickupLocation}
                    className={location.id === pickupLocation ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {location.name}
                    {location.id === pickupLocation && ' (Selected as Pickup)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vehicle Selection */}
        {availableVehicles.length > 0 && (
          <div className="mt-4">
            <label className="text-sm text-white">Select Vehicle</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white rounded-none h-[50px]">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {availableVehicles.map((vehicle) => (
                  <SelectItem
                    key={vehicle._id}
                    value={vehicle._id}
                  >
                    <div className="flex items-center justify-between">
                      <span>{vehicle.vehicleName}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        (Max {vehicle.maxPassenger} passengers, Initial charge: €{vehicle.initialCharge})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Passenger Counter Section */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-white">Children</label>
            <div className="flex items-center bg-gray-800 rounded-none">
              <Button
                variant="ghost"
                className="text-2xl rounded-none text-white h-[50px]"
                onClick={() => handlePassengerChange('children', false)}
              >
                -
              </Button>
              <span className="flex-1 text-center text-white">{children}</span>
              <Button
                variant="ghost"
                className="text-2xl rounded-none text-white h-[50px]"
                onClick={() => handlePassengerChange('children', true)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white">Adults</label>
            <div className="flex items-center bg-gray-800">
              <Button
                variant="ghost"
                className="text-2xl text-white rounded-none h-[50px]"
                onClick={() => handlePassengerChange('adult', false)}
              >
                -
              </Button>
              <span className="flex-1 text-center text-white">{passengers}</span>
              <Button
                variant="ghost"
                className="text-2xl text-white rounded-none h-[50px]"
                onClick={() => handlePassengerChange('adult', true)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Total Passengers Info */}
        {/* <div className="mt-4 text-sm text-white">
          Total Passengers: {totalPassengers}
          {selectedVehicle && ` / ${availableVehicles.find(v => v._id === selectedVehicle)?.maxPassenger || 0} max`}
        </div> */}

        {/* Price and Search Section */}
        {currentFee !== 0 && <div className="flex items-center gap-4 mt-6">
          <div className="flex-1 bg-gray-800 p-2 h-[50px] flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">{siteState?.mainConfigurations?.mainCurrency} {currentFee}</span>
              {tripType === 'round-trip' && (
                <span className="text-sm text-gray-400 ml-2">(Round trip)</span>
              )}</div>
            {selectedVehicle && (
              <div className="text-sm text-gray-400">
                Base: {siteState?.mainConfigurations?.mainCurrency} {baseFee}
                {tripType === 'round-trip' && ' x 2'}
              </div>
            )}
          </div>
        </div>}


        {/* Book Now Button */}
        <Button
          className="w-full h-[50px] mt-4 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 rounded-none"
          disabled={!selectedVehicle || !pickupLocation || !dropLocation || currentFee === 0 || !!errorMessage}
          onClick={() => setIsOpenBookingDialog(true)}
        >
          Book Now
        </Button>

        
      </Card>


      <Dialog open={isOpenBookingDialog} onOpenChange={() => setIsOpenBookingDialog(false)}>
        <DialogContent className='lg:min-w-[800px] p-0 overflow-auto rounded-none max-h-[90vh]'>
          <DialogTitle className='hidden'></DialogTitle>

          <BookingDetailsView
            selectedVehicle={selectedVehicle}
            availableVehicles={availableVehicles}
            tripType={tripType}
            totalPassengers={totalPassengers}
            childrenCount={children}
            adults={passengers}
            pickupLocation={locations.find(l => l.id === pickupLocation)?.name || '' }
            dropLocation={locations.find(l => l.id === dropLocation)?.name || ''}
            baseFee={baseFee}
          />

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default BookingWidget;