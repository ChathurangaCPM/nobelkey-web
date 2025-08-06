import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IPages } from './Pages';

// Interface for Theme document
export interface ITheme extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    selectedHomePage: mongoose.Types.ObjectId | IPages;
    mainConfigurations?: object;
    header?: object;
    locations?: object[];
    fees?: object[];
    footer?: object;// You can make this more specific based on your needs
    createdAt: Date;
    updatedAt: Date;
}

// Schema definition
const ThemeSchema = new Schema<ITheme>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mainConfigurations: {
        type: Object,
        default: {}
    },
    header: {
        type: Object,
        default: {}
    },
    footer: {
        type: Object,
        default: {}
    },

    locations:{
        type: Array,
    },
    fees:{
        type: Array,
    },
    selectedHomePage:{
        type: Schema.Types.ObjectId,
        ref: 'Pages',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Model definition with proper typing
const Theme = (mongoose.models.Theme as mongoose.Model<ITheme>) ||
    mongoose.model<ITheme>('Theme', ThemeSchema);

export default Theme;