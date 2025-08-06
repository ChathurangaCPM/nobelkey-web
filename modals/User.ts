import mongoose, { Document, Model, Schema } from "mongoose";

// Define user roles and status as const arrays for type safety
const USER_ROLES = ["user", "admin", "manager", "sales", "marketing", "inventoryManager"] as const;
const USER_STATUS = ["active", "inactive", "suspended"] as const;

// Create type from const arrays
type UserRole = typeof USER_ROLES[number];
type UserStatus = typeof USER_STATUS[number];

// Define the base interface without Document extension
interface IUserBase {
    firstName: string;
    lastName: string;
    role: UserRole;
    username: string;
    email: string;
    uniqueID?: string;
    password: string;
    avatar?: string;
    contactNumber: string;
    isEmailVerified: boolean;
    isContactVerified: boolean;
    status: UserStatus;
    capabilities: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Interface for the user document
export interface IUser extends IUserBase, Document {}

// Interface for the user model with correct typing
export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: USER_ROLES,
            default: "user",
        },
        username: {
            type: String,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
        },
        uniqueID: {
            type: String,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
        },
        contactNumber: {
            type: String,
            default: "",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isContactVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: USER_STATUS,
            default: "active",
        },
        capabilities: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

// Create the model with proper typing
const User = (mongoose.models.User as IUserModel) || 
    mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;