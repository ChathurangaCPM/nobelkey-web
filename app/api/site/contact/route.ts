import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import { ContactForm } from "@/modals/ContactForm";
import Theme from "@/modals/Theme";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

// @ts-ignore
import { SendMailClient } from 'zeptomail';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }


        // Fetch theme data with explicit conditions and error handling
        const themeData = await Theme.find().lean().exec();

        const formData = await req.json();

        // Get client IP and User Agent
        const ipAddress = req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Validate required fields
        if (!formData.firstName || !formData.email || !formData.message) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Name, email, and message are required fields'
                },
                { status: 400 }
            );
        }


        // Basic spam detection
        const isSpam = formData.message.toLowerCase().includes('viagra') ||
            formData.message.toLowerCase().includes('casino') ||
            formData.message.length < 10;

        const createContact = await ContactForm.create({
            ...formData,
            ipAddress,
            userAgent,
            isSpam,
            source: formData.source || 'website'
        });

         if (themeData && themeData[0]?.emailSettings) {
            type EmailSetting = {
                zepto_token: any;
                zepto_from_address: any;
                zepto_from_name: any;
                type: string;
                host?: string;
                port?: number;
                email?: string;
                password?: string;
                // add other properties as needed
            };

            const emailSettings = themeData[0]?.emailSettings as EmailSetting[];

            const html = `First Name: ${formData?.firstName} <br/>Last Name: ${formData?.lastName}<br/>Mobile: ${formData?.mobileNumber}<br/>Message: ${formData?.message}`


            if (emailSettings && emailSettings.length > 0) {
                const getEmailSettings = emailSettings[0];

                if (getEmailSettings?.type === "smtp") {
                    // node mailer configurations
                    const transporter = nodemailer.createTransport({
                        host: getEmailSettings?.host,
                        port: Number(getEmailSettings?.port),
                        secure: true,
                        auth: {
                            user: getEmailSettings?.email,
                            pass: getEmailSettings?.password,
                        },
                    });

                    (async () => {
                        const info = await transporter.sendMail({
                            from: formData?.email,
                            to: formData?.toEmail || 'mail.aurorasolutions@gmail.com',
                            subject: "Nobelkey Contact Form",
                            html: html, // HTML body
                        });

                        console.log("Message sent:", info.messageId);
                    })();


                } else {
                    const getEmailSettings = emailSettings[0];

                    const url = "api.zeptomail.com/";
                    const token = getEmailSettings?.zepto_token;

                    let client = new SendMailClient({ url, token });

                    

                    const emailIsSend = await client.sendMail({
                        "from":
                        {
                            "address": formData.email,
                            "name": ""
                        },
                        "to":
                            [
                                {
                                    "email_address":
                                    {
                                        "address": formData?.toEmail || 'mail.aurorasolutions@gmail.com',
                                        "name": getEmailSettings?.zepto_from_name || "Nobelkey"
                                    }
                                }
                            ],
                        "subject": "Nobelkey Contact Form",
                        "htmlbody": html,
                    });

                    if (emailIsSend && emailIsSend?.message === "OK") {
                        
                    }


                }
            }

        }

        return NextResponse.json({
            success: true,
            message: 'Contact form submitted successfully',
            data: {
                id: createContact._id,
                status: createContact.status
            }
        }, {
            status: 201
        });

        

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error submitting contact form'
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
        const service = searchParams.get('service');

        // Build filter
        const filter: any = {};
        if (status) filter.status = status;
        if (service) filter.service = service;

        const contacts = await ContactForm.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await ContactForm.countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching contacts'
            },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
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

        const formData = await req.json();

        if (formData) {
            const { id, ...rest } = formData;

            // Add repliedAt timestamp when status changes to replied
            if (rest.status === 'replied') {
                rest.repliedAt = new Date();
            }

            const update = await ContactForm.findByIdAndUpdate(
                { _id: id },
                rest,
                { new: true }
            );

            if (!update) {
                return NextResponse.json(
                    { success: false, message: 'Contact not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Contact updated successfully',
                data: update
            }, {
                status: 200
            });
        }

    } catch (error) {
        console.error('Update contact error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error updating contact'
            },
            { status: 500 }
        );
    }
}
