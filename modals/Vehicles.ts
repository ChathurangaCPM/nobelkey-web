import mongoose, { Schema, Document } from 'mongoose';

// Interface for Vehicle Document
export interface IVehicle extends Document {
    vehicleName: string;
    image: string;
    backgroundImage?: string;
    initialCharge: number;
    perKmPrice?: number;
    maxPassenger: number;
    activeMainCity?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Vehicle Schema
const vehicleSchema = new Schema<IVehicle>(
    {
        vehicleName: {
            type: String,
            required: [true, 'Vehicle name is required'],
            trim: true,
            minlength: [3, 'Vehicle name must be at least 3 characters long']
        },
        image: {
            type: String,
            required: [true, 'Vehicle image is required']
        },
        backgroundImage: {
            type: String,
            default: ''
        },
        initialCharge: {
            type: Number,
            required: [true, 'Initial charge is required'],
            min: [0, 'Initial charge cannot be negative']
        },
        perKmPrice: {
            type: Number,
            default: 0,
            min: [0, 'Price per kilometer cannot be negative']
        },
        maxPassenger: {
            type: Number,
            required: [true, 'Maximum passenger count is required'],
            min: [1, 'Maximum passengers must be at least 1']
        },
        activeMainCity: {
            type: String,
            default: '',
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Indexes for better query performance
vehicleSchema.index({ vehicleName: 1 });
vehicleSchema.index({ activeMainCity: 1 });
vehicleSchema.index({ isActive: 1 });

// Add any pre-save middleware if needed
vehicleSchema.pre('save', function(next) {
    // You can add custom validation or modification logic here
    next();
});

// Add methods if needed
vehicleSchema.methods.calculateFare = function(distance: number): number {
    return this.initialCharge + (this.perKmPrice || 0) * distance;
};

// Create and export the model
const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;