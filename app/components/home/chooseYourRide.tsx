"use client";

import { useEffect, useState } from "react";
import TaxiCard from "../common/taxiCard";
import TopTagline from "../common/topTagline";
import { toast } from "sonner";

interface Vehicle {
    _id: string;
    vehicleName: string;
    activeMainCity?: string;
    initialCharge: number;
    perKmPrice: number;
    maxPassenger: number;
    image?: string;
    backgroundImage?: string;
}
interface ChooseYourRideProps {
    topTagline?: string;
    title?: string;
    descriptions?: string;
}

const ChooseYourRide: React.FC<ChooseYourRideProps> = ({
    topTagline,
    title,
    descriptions
}) => {


    const [vehicles, setVehicles] = useState<Vehicle[]>([]);


    const getVehicles = async () => {
        try {
            const response = await fetch('/api/site/vehicle', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                toast.error("Error getting vehicle data")
            }

            const { data } = await response.json()

            setVehicles(data);


        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        getVehicles()
    }, []);


    return vehicles && vehicles?.length > 0 ? (
        <div className="container mx-auto md:py-10 text-center space-y-10 mb-20">
            <div>
                <TopTagline title={topTagline || "Lets Go With Us"} align="center" />
                <h2 className="text-4xl font-bold mb-6 capitalize">{title}</h2>
                <p className="mt-5 max-w-[90%] md:max-w-[40%] mx-auto font-semibold">{descriptions}</p>
            </div>

            <div className="grid px-5 md:px-0 md:grid-cols-3 gap-5 mt-20">
                {vehicles?.map((vehicle: Vehicle, index) => <TaxiCard
                    key={`${vehicle?._id}-${index}`}
                    image={vehicle?.image || "/images/car-2.png"}
                    background={vehicle?.backgroundImage || "/images/post-1.jpg"}
                    model={vehicle?.vehicleName || ''}
                    location={vehicle?.activeMainCity || ''}
                    initialCharge={vehicle?.initialCharge || 0}
                    perMileKm={vehicle?.perKmPrice || 0}
                    perStoppedTraffic={0}
                    passengers={vehicle?.maxPassenger || 0}
                    pricePerKm={vehicle?.perKmPrice || 0}
                />)}
            </div>
        </div>
    ) : null
}

export default ChooseYourRide;