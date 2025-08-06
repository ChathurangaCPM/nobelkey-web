import bcrypt from "bcrypt";
import connectDB from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, Session, User as AuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import User from "@/modals/User";

interface CustomUser extends AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    username: string;
    email: string;
    contactNumber: string;
    isEmailVerified: boolean;
    isContactVerified: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    customUserId: string;
    capabilities: string[];
    password?: string;
}

interface CustomSession extends Session {
    user: {
        id: string;
        accessToken?: string;
        firstName: string;
        lastName: string;
        role: string;
        username: string;
        email: string;
        contactNumber: string;
        isEmailVerified: boolean;
        isContactVerified: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customUserId: string;
        capabilities: string[];
        newVal?: string;
    }
}


export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<CustomUser | null> {
                try {
                    if (!credentials) {
                        throw new Error('No credentials provided');
                    }
                    
                    await connectDB(); // Ensure database connection is established
                    const user = await User.findOne({ email: credentials.email });
                    
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );
                        
                        if (isPasswordCorrect) {
                            return user as unknown as CustomUser;
                        } else {
                            throw new Error('Password did not match');
                        }
                    } else {
                        throw new Error('User not found');
                    }
                } catch (error) {
                    console.error('Error during authentication:', error);
                    throw new Error('Authentication failed');
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/admin',
        signOut: '/shop',
    },

    callbacks: {
        async session({ session, token }): Promise<CustomSession> {
            const customSession = session as CustomSession;
            customSession.user = {
                ...customSession.user,
                id: token.id as string,
                accessToken: token.accessToken as string,
                firstName: token.firstName as string,
                lastName: token.lastName as string,
                role: token.role as string,
                username: token.username as string,
                email: token.email as string,
                contactNumber: token.contactNumber as string,
                isEmailVerified: token.isEmailVerified as boolean,
                isContactVerified: token.isContactVerified as boolean,
                status: token.status as string,
                createdAt: token.createdAt as Date,
                updatedAt: token.updatedAt as Date,
                customUserId: token.customUserId as string,
                capabilities: token.capabilities as string[],
                newVal: token.newVal as string,
            };
            return customSession;
        },
        async jwt({ token, user, trigger, session }): Promise<JWT> {
            if (user) {
                const customUser = user as CustomUser;
                token.id = customUser.id;
                token.firstName = customUser.firstName;
                token.lastName = customUser.lastName;
                token.role = customUser.role;
                token.username = customUser.username;
                token.email = customUser.email;
                token.contactNumber = customUser.contactNumber;
                token.isEmailVerified = customUser.isEmailVerified;
                token.isContactVerified = customUser.isContactVerified;
                token.status = customUser.status;
                token.createdAt = customUser.createdAt;
                token.updatedAt = customUser.updatedAt;
                token.customUserId = customUser.customUserId;
                token.capabilities = customUser.capabilities;
            }

            if (trigger === "update" && session) {
                token = {
                    ...token,
                    ...session.user
                };
            }
            return token;
        },
        // async redirect({ url, baseUrl, account, profile }) {
        //     // const role = profile?.role || 'user';
        //     // if (role === 'admin') {
        //     //     return '/admin';
        //     // }
        // }
    },
};