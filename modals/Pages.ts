import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
// Remove this import as we don't need Zod's boolean type
// import { boolean } from 'zod';

// Interface remains the same
export interface IPages extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  content?: string;
  title?: string;
  components?: object[];
  seoData?: object;
  slug?: string;
  hideFromSite?: boolean;
  type?: string;
  delete?: boolean;
  url: string;
  access?: any[];
  parent?: mongoose.Types.ObjectId | IPages;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition with corrected boolean types
const PagesSchema = new Schema<IPages>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  components: {
    type: Array,
    default: []
  },
  seoData: {
    type: Object,
    default: {}
  },
  type: {
    type: String,
  },
  slug: {
    type: String,
  },
  delete: {
    type: Boolean, // Changed from boolean to Boolean
    default: false
  },
  hideFromSite: {
    type: Boolean, // Changed from boolean to Boolean
    default: false
  },
  url: {
    type: String,
  },
  access: {
    type: [Schema.Types.Mixed],
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Pages',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Pages = (mongoose.models.Pages as mongoose.Model<IPages>) || 
  mongoose.model<IPages>('Pages', PagesSchema);

export default Pages;
