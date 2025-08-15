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
  s3Key?: string; // S3 object key for deletion
  s3Bucket?: string; // S3 bucket name
  fileSize?: number; // File size in bytes
  originalSize?: number; // Original file size before optimization
  optimizedSize?: number; // Optimized file size after processing
  compressionRatio?: string; // Compression ratio percentage
  fileCategory?: 'images' | 'documents'; // File category
  mimeType?: string; // MIME type of the file
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
  s3Key: {
    type: String,
  },
  s3Bucket: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  originalSize: {
    type: Number,
  },
  optimizedSize: {
    type: Number,
  },
  compressionRatio: {
    type: String,
  },
  fileCategory: {
    type: String,
    enum: ['images', 'documents'],
  },
  mimeType: {
    type: String,
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
