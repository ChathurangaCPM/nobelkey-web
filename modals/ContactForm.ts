import mongoose, { Document, Schema } from 'mongoose';

// Contact Form Interface
export interface IContactForm extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  subject?: string;
  message: string;
  company?: string;
  service?: string; // web development, software development, IoT development
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  source?: string; // where the contact came from
  ipAddress?: string;
  userAgent?: string;
  isSpam: boolean;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Subscription Interface
export interface INewsletterSubscription extends Document {
  email?: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  subscriptionDate: Date;
  unsubscribeDate?: Date;
  preferences?: {
    webDevelopment: boolean;
    softwareDevelopment: boolean;
    iotDevelopment: boolean;
    generalUpdates: boolean;
  };
  source?: string; // contact form, website popup, etc.
  ipAddress?: string;
  confirmationToken?: string;
  isConfirmed: boolean;
  lastEmailSent?: Date;
  emailsSent: number;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Form Schema
const ContactFormSchema = new Schema<IContactForm>({
  firstName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobileNumber: {
    type: String,
    trim: true,
    maxlength: 20
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  service: {
    type: String,
    enum: ['web-development', 'software-development', 'iot-development', 'consultation', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date
  }
}, { 
  timestamps: true,
  collection: 'contactforms'
});

// Newsletter Subscription Schema
const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced', 'pending'],
    default: 'pending'
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  unsubscribeDate: {
    type: Date
  },
  preferences: {
    webDevelopment: {
      type: Boolean,
      default: true
    },
    softwareDevelopment: {
      type: Boolean,
      default: true
    },
    iotDevelopment: {
      type: Boolean,
      default: true
    },
    generalUpdates: {
      type: Boolean,
      default: true
    }
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  confirmationToken: {
    type: String
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  lastEmailSent: {
    type: Date
  },
  emailsSent: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  collection: 'newslettersubscriptions'
});

// Indexes for better performance
ContactFormSchema.index({ email: 1 });
ContactFormSchema.index({ status: 1 });
ContactFormSchema.index({ createdAt: -1 });
ContactFormSchema.index({ service: 1 });

// Note: email index is automatically created by unique: true, so we don't need to add it explicitly
NewsletterSubscriptionSchema.index({ status: 1 });
NewsletterSubscriptionSchema.index({ subscriptionDate: -1 });
NewsletterSubscriptionSchema.index({ confirmationToken: 1 });

// Models
const ContactForm = (mongoose.models.ContactForm as mongoose.Model<IContactForm>) || 
  mongoose.model<IContactForm>('ContactForm', ContactFormSchema);

const NewsletterSubscription = (mongoose.models.NewsletterSubscription as mongoose.Model<INewsletterSubscription>) || 
  mongoose.model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema);

export { ContactForm, NewsletterSubscription };
