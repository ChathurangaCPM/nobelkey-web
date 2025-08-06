"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

interface AnimatedBeamDemoProps {
    dropLocation?: string;
    pickupLocation?: string;
    tripType?: string;
}
const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center border-2 bg-white p-3 ",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamDemo({
    dropLocation,
    pickupLocation,
    tripType
}: AnimatedBeamDemoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    
    return (
        <div
            className="relative flex w-full items-center justify-center overflow-hidden"
            ref={containerRef}
        >
            <div className="flex size-full flex-col items-stretch justify-between gap-10">
                <div className="flex flex-row justify-between">
                    <div className="z-30">
                        <Circle ref={div1Ref}>
                            A
                        </Circle>
                        <div className="max-w-[200px] line-clamp-1 ">{pickupLocation}</div>
                    </div>
                    <div className="z-30 justify-end flex flex-col items-end">
                        <Circle ref={div2Ref}>
                            B
                        </Circle>
                        <div className="max-w-[200px] line-clamp-1 ">{dropLocation}</div>

                    </div>
                </div>
            </div>

            <AnimatedBeam
                duration={2}
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                curvature={tripType === "round-trip" ? -30 : 0}
            />

            {tripType === "round-trip" && <AnimatedBeam
                duration={2}
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                startYOffset={-10}
                endYOffset={-10}
                curvature={30}
                reverse
            />}
        </div>
    );
}

