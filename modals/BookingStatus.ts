import mongoose, { Schema, Document } from 'mongoose';
import { IBookings } from './Bookings';

export interface IBookingStatus extends Document {
    description?: string;
    bookingId: mongoose.Types.ObjectId | IBookings,
    color?: string;
    isActive: boolean;
    status?: string;
    requiresComment?: boolean;
    notifyCustomer?: boolean;
}

const bookingStatusSchema = new Schema<IBookingStatus>(
    {
        description: {
            type: String,
            trim: true
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Bookings',
            required: true  // Add this if bookingId should never be null
        },
        color: {
            type: String,
            default: '#808080'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: ''
        },
        requiresComment: {
            type: Boolean,
            default: false
        },
        notifyCustomer: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// If you need any specific indexes, define them explicitly
bookingStatusSchema.index({ bookingId: 1 });

// Create and export the model
const BookingStatus = mongoose.models.BookingStatus || mongoose.model<IBookingStatus>('BookingStatus', bookingStatusSchema);

export default BookingStatus;