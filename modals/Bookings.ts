import mongoose, { Schema, Document } from 'mongoose';
import { IBookingStatus } from './BookingStatus';
import { IVehicle } from './Vehicles';

// Interface for Counter Document
interface ICounter extends Document {
    _id: string;
    seq: number;
}

// Counter Schema
const counterSchema = new Schema<ICounter>({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', counterSchema);

export interface IBookings extends Document {
    bookingId?: string;
    bookingData: object;
    selectedVehicle?: mongoose.Types.ObjectId | IVehicle;
    routeData: object;
    mainCurrency?: string;
    image: string;
    isComplete?: boolean;
    emailSend?: boolean;
    currentStatus?: string;
    status?: mongoose.Types.ObjectId | IBookingStatus;
}

const bookingSchema = new Schema<IBookings>(
    {
        bookingId: {
            type: String,
            unique: true,
            sparse: true
        },
        bookingData: {
            type: Object,
            default: {}
        },
        selectedVehicle: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle'
        },
        mainCurrency: {
            type: String,
            default: ''
        },
        routeData: {
            type: Object,
            default: {}
        },
        currentStatus: {
            type: 'string',
            default: 'pending'
        },
        isComplete: {
            type: Boolean,
            default: false
        },
        emailSend: {
            type: Boolean,
            default: false
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'BookingStatus'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Post-save middleware to generate booking ID
bookingSchema.post('save', async function(doc) {
    if (!doc.bookingId) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'bookingId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        
        const bookingId = `CCF${counter.seq.toString().padStart(4, '0')}`;
        
        await Booking.findByIdAndUpdate(doc._id, { bookingId });
    }
});

const Booking = mongoose.models.Booking || mongoose.model<IBookings>('Booking', bookingSchema);

export default Booking;