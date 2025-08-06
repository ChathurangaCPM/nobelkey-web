import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomCardProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'bordered' | 'elevated' | 'flat';
    backgroundColor?: string;
    padding?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
    title = "Card Title",
    description = "Card Description",
    variant = "default",
    backgroundColor = "#ffffff",
    padding = "4"
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'bordered':
                return 'border-2 border-primary';
            case 'elevated':
                return 'shadow-lg';
            case 'flat':
                return 'border-0 shadow-none';
            default:
                return 'border shadow-sm';
        }
    };

    return (
        <Card 
            className={`${getVariantStyles()} transition-all`}
            style={{ 
                backgroundColor,
                padding: `${padding}px`
            }}
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
};

export default CustomCard;