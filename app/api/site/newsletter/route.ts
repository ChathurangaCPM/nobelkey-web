import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { NewsletterSubscription } from "@/modals/ContactForm";

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const formData = await req.json();
        
        // Get client IP
        const ipAddress = req.headers.get('x-forwarded-for') || 
                         req.headers.get('x-real-ip') || 
                         'unknown';

        // Validate required fields
        if (!formData.email) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Email is required' 
                },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingSubscription = await NewsletterSubscription.findOne({ 
            email: formData.email.toLowerCase() 
        });

        if (existingSubscription) {
            if (existingSubscription.status === 'active') {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: 'Email is already subscribed' 
                    },
                    { status: 400 }
                );
            } else if (existingSubscription.status === 'unsubscribed') {
                // Reactivate subscription
                existingSubscription.status = 'pending';
                existingSubscription.confirmationToken = crypto.randomBytes(32).toString('hex');
                existingSubscription.subscriptionDate = new Date();
                await existingSubscription.save();

                return NextResponse.json({
                    success: true,
                    message: 'Subscription reactivated. Please check your email for confirmation.',
                    data: {
                        id: existingSubscription._id,
                        confirmationToken: existingSubscription.confirmationToken
                    }
                });
            }
        }

        // Generate confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        const createSubscription = await NewsletterSubscription.create({
            ...formData,
            email: formData.email.toLowerCase(),
            ipAddress,
            confirmationToken,
            source: formData.source || 'website'
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription successful! Please check your email for confirmation.',
            data: {
                id: createSubscription._id,
                confirmationToken: createSubscription.confirmationToken
            }
        }, {
            status: 201
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error subscribing to newsletter'
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Get user session for admin access
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        // Build filter
        const filter: any = {};
        if (status) filter.status = status;

        const subscriptions = await NewsletterSubscription.find(filter)
            .sort({ subscriptionDate: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await NewsletterSubscription.countDocuments(filter);

        // Get stats
        const stats = await NewsletterSubscription.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: subscriptions,
            stats: stats.reduce((acc: any, stat: any) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get newsletter subscriptions error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching subscriptions'
            },
            { status: 500 }
        );
    }
}
