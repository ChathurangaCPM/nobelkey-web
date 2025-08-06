"use client";
import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

// Interface for testimonial data
interface TestimonialItem {
    id: string | number;
    useName: string;
    role?: string;
    profileImageUrl?: string;
    testimonial: string;
    ratingCount?: number;
}

interface TestimonialsProps {
    items: TestimonialItem[];
    showNavigation?: boolean;
    showCounter?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export function Testimonials({
    items,
    showNavigation = true,
    showCounter = true,
    autoPlay = false,
    autoPlayInterval = 5000,
}: TestimonialsProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    // Auto-play functionality
    React.useEffect(() => {
        if (autoPlay && api) {
            const interval = setInterval(() => {
                api.scrollNext();
            }, autoPlayInterval);

            return () => clearInterval(interval);
        }
    }, [api, autoPlay, autoPlayInterval]);

    // Handle carousel state
    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    // Render stars for rating
    const renderRating = (rating: number) => {
        return (
            <div className="flex gap-0 mb-2 mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                        key={index}
                        className={`w-5 h-5 ${index < rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full">
            {items && items.length > 0 &&
                <>
                    <Carousel
                        setApi={setApi}
                        className="w-full"

                    >
                        <CarouselContent>
                            {items.map((item) => (
                                <CarouselItem key={item.id}>
                                    <Card className="rounded-none">
                                        <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                                            <div className="flex flex-col items-center md:items-start">
                                                <div className="flex flex-col md:flex-row items-start gap-5">
                                                    {item.profileImageUrl && (
                                                        <div className="relative w-20 h-20 mx-auto md:mx-0 mb-4 overflow-hidden rounded-full">
                                                            <Image
                                                                src={item.profileImageUrl}
                                                                alt={item.useName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="">
                                                            &quot;{item.testimonial}&rdquo;
                                                        </p>
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold">{item.useName}</h3>
                                                {item.role && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.role}
                                                    </p>
                                                )}
                                                {item.ratingCount && renderRating(item.ratingCount)}
                                            </div>

                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {showNavigation && (
                            <div className="flex justify-center md:justify-start">
                                <CarouselPrevious className="rounded-none border-none bg-transparent relative left-0 bottom-0 mt-5 shadow-none" />
                                <CarouselNext className="rounded-none border-none bg-transparent relative left-0 bottom-0 mt-5 shadow-none" />
                            </div>
                        )}
                    </Carousel>
                    {showCounter && (
                        <div className="py-2 text-center md:text-left text-sm text-muted-foreground">
                            Slide {current} of {count}
                        </div>
                    )}
                </>
            }

        </div>
    );
}
