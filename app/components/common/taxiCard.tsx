import Image from 'next/image';
import React from 'react';

interface TaxiCardProps {
    image: string;
    background?: string;
    model: string;
    location: string;
    initialCharge: number;
    perMileKm: number;
    perStoppedTraffic: number;
    passengers: number;
    pricePerKm: number;
    className?: string;
}

const TaxiCard: React.FC<TaxiCardProps> = ({
    image,
    background,
    model,
    location,
    initialCharge,
    perMileKm,
    passengers,
    pricePerKm,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden w-full ${className} group`}>
            {/* Price Tag */}
            <div className="relative">
                {background && <Image src={background} alt="Price Tag" layout="fill" objectFit="cover" /> }
                <div
                    className="absolute right-5 top-5 bg-orange-500 text-white py-2 px-4 font-bold z-10"
                    style={{
                        clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%)'
                    }}
                >
                    ${pricePerKm.toFixed(0)}/km
                </div>

                {/* Car Image */}
                <div className='w-[90%] mx-auto pt-20 relative z-10 hover:scale-105 transition-transform duration-300'>
                    <Image
                        src={image}
                        alt={`${model} Taxi`}
                        className="w-full object-cover relative "
                        width={400}
                        height={200}
                    />
                </div>

                <div className='w-0 h-0 border-b-[150px] border-b-white border-r-[500px] border-r-transparent absolute bottom-0 left-0'></div>
            </div>

            {/* Car Details */}
            <div className="p-10">
                <h2 className="text-xl font-bold text-center mb-1">{model}</h2>
                <p className="text-gray-600 text-center uppercase text-sm mb-6">{location}</p>

                {/* Pricing Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Initial Charge:</span>
                        <span className="font-semibold">${initialCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Per Mile/KM:</span>
                        <span className="font-semibold">${perMileKm.toFixed(2)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                        <span className="text-gray-600">Per Stopped Traffic:</span>
                        <span className="font-semibold">${perStoppedTraffic.toFixed(2)}</span>
                    </div> */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Passengers:</span>
                        <span className="font-semibold">{passengers} Person</span>
                    </div>
                </div>

                {/* Book Button */}
                {/* <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded transition-colors duration-200">
                    Book Taxi Now
                </button> */}
            </div>
        </div>
    );
};

export default TaxiCard;