"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Loader2, Locate, Navigation, PenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";

interface Location {
    id: string;
    name: string;
    locationData?: google.maps.places.PlaceResult | null;
    latitude: string;
    longitude: string;
}


interface Vehicle {
    _id: string;
    image: string;
    id: string;
    vehicleName: string;
    initialCharge: number;
    perKmPrice: number;
    maxPassenger: number;
}

interface FeeMapping {
    id: string;
    locationA?: string;
    locationB?: string;
    vehicle: Vehicle;
    fee: number;
    uniqueMappingId: string;
}

interface FeeProps extends Omit<FeeMapping, 'fee'> {
    fee?: number;
}


interface State {
    data?: {
        theme?: {
            fees?: object[];
        };
    };
}

const FeesPage: React.FC = () => {
    const [feeMappings, setFeeMappings] = useState<FeeMapping[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { state, setState } = useAuthContext();
    const router = useRouter();

    // Generate initial fee mappings with current locations and vehicles
    const generateInitialFeeMappings = (locs: Location[], vehs: Vehicle[]): FeeMapping[] => {
        const mappings: FeeMapping[] = [];

        locs.forEach((locA) => {
            locs.forEach((locB) => {
                if (locA.id !== locB.id) {
                    vehs.forEach((vehicle) => {
                        const uniqueMappingId = `${locA.id}-${locB.id}-${vehicle._id}`;
                        mappings.push({
                            id: `${locA.id}-${locB.id}-${vehicle.id}`,
                            locationA: locA?.name,
                            locationB: locB?.name,
                            vehicle: {
                                _id: vehicle._id,
                                id: vehicle.id,
                                image: vehicle.image,
                                vehicleName: vehicle.vehicleName,
                                initialCharge: vehicle.initialCharge,
                                perKmPrice: vehicle.perKmPrice,
                                maxPassenger: vehicle.maxPassenger,
                            },
                            fee: 0,
                            uniqueMappingId
                        });
                    });
                }
            });
        });

        return mappings;
    };

    // Fetch locations and vehicles data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/admin/vehicles-and-location', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const { data } = await response.json();
                const { locations, vehicles } = data;

                // Generate new mappings based on current locations and vehicles
                const newMappings = generateInitialFeeMappings(locations, vehicles);

                // If there are existing fees in the theme state, merge them with new mappings
                const existingFees = state?.data?.theme?.fees;
                if (existingFees) {
                    const updatedMappings = newMappings.map(newMapping => {
                        // Find matching fee in existing state
                        const existingFee = existingFees.find((fee: FeeProps) => {
                            // Match based on locations and vehicle
                            return fee.locationA === newMapping.locationA &&
                                   fee.locationB === newMapping.locationB &&
                                   fee.vehicle._id === newMapping.vehicle._id;
                        });

                        // If matching fee found, use its fee value, otherwise keep the default
                        return existingFee ? {
                            ...newMapping,
                            fee: existingFee.fee
                        } : newMapping;
                    });

                    setFeeMappings(updatedMappings);
                } else {
                    setFeeMappings(newMappings);
                }
            } catch (err) {
                setError('Failed to load data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [state?.data?.theme?.fees]); // Update dependency to watch theme.fees

    const handleFeeChange = (uniqueMappingId: string, newFee: number) => {
        setFeeMappings(prevMappings =>
            prevMappings.map(mapping =>
                mapping.uniqueMappingId === uniqueMappingId
                    ? { ...mapping, fee: newFee }
                    : mapping
            )
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                type: 'fees',
                data: feeMappings
            };

            const response = await fetch('/api/admin/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Response not OK');
            }
            
            // Update the theme.fees in state
            setState((prevState: State) => ({
                ...prevState,
                data: {
                    ...prevState?.data,
                    theme: {
                        ...prevState?.data?.theme,
                        fees: feeMappings
                    }
                }
            }));

        } catch (err) {
            setError('Failed to update fees. Please try again.');
            console.error('Error updating fees:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Fees Mapping</h1>
                <p className="text-muted-foreground text-sm">Manage your all fees</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            ) : (
                <div className="space-y-4 w-full">
                    <div className="grid grid-cols-4 w-full gap-5 font-semibold">
                        <p>Location A</p>
                        <p>Location B</p>
                        <p>Vehicle</p>
                        <p>Fee</p>
                    </div>

                    {feeMappings.map((mapping: FeeProps) => (
                        <div key={mapping.uniqueMappingId} className="grid grid-cols-4 w-full gap-5 items-start border-b-[1px] pb-5 text-sm">
                            <div className="">
                                <p className="uppercase text-muted-foreground">From</p>
                                <div className="flex items-center space-x-2 gap-2">
                                    <div className="w-10 h-10 flex items-center justify-center"><Locate /></div>
                                    {mapping.locationA}
                                </div>
                            </div>
                            <div className="">
                                <p className="uppercase text-muted-foreground">To</p>
                                <div className="flex items-start space-x-2 gap-2">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <Navigation />
                                    </div>
                                    {mapping.locationB}
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <Image src={mapping.vehicle.image} width={140} height={140} alt={mapping.vehicle.vehicleName} />
                                <div>
                                    <h4 className="font-semibold mb-2">{mapping.vehicle.vehicleName}</h4>
                                    <p>Per KM: {mapping.vehicle.perKmPrice}</p>
                                    <p>Initial Charge: {mapping.vehicle.initialCharge}</p>
                                    <p>Max Passenger: {mapping.vehicle.maxPassenger}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-3"
                                        onClick={() => router.push(`/admin/vehicles/${mapping.vehicle._id}`)}
                                    >
                                        <PenIcon />Edit Vehicle
                                    </Button>
                                </div>
                            </div>
                            <Input
                                type="number"
                                placeholder="Fee"
                                value={mapping?.fee || ''}
                                onChange={(e) => handleFeeChange(mapping.uniqueMappingId, Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    ))}

                    <div className="flex justify-end space-x-2">
                        {/* <Button
                            variant="outline"
                            onClick={() => setFeeMappings(generateInitialFeeMappings(locations, vehicles))}
                        >
                            Reset
                        </Button> */}
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Fees'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesPage;