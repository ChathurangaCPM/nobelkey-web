import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User'; // Assuming User model has TypeScript interface

// Interface for MediaLibrary document
export interface IMediaLibrary extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  type?: string;
  title?: string;
  alt?: string;
  description?: string;
  url: string;
  access?: any[]; // You can make this more specific based on your needs
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const MediaLibrarySchema = new Schema<IMediaLibrary>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  alt: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  access: {
    type: [Schema.Types.Mixed], // You can make this more specific based on your needs
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Model definition with proper typing
const MediaLibrary = (mongoose.models.MediaLibrary as mongoose.Model<IMediaLibrary>) || 
  mongoose.model<IMediaLibrary>('MediaLibrary', MediaLibrarySchema);

export default MediaLibrary;