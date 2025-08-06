import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/modals/User";

// Interface for the registration form data
interface RegistrationFormData {
    email: string;
    password: string;
    capabilities: string[];
    role: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDB();
        const formData = await request.json() as RegistrationFormData;

        if (formData?.email && formData?.capabilities && formData?.password) {
            const findExists = await User.findOne({
                $or: [{ email: formData.email }]
            });

            if (findExists && findExists.email === formData.email) {
                return NextResponse.json(
                    { message: 'Email address already exists, please use another one' },
                    { status: 500 }
                );
            }

            const hashedPassword = await bcrypt.hash(formData.password, 10);

            await User.create({
                email: formData.email,
                password: hashedPassword,
                role: formData.role,
                capabilities: formData.capabilities,
            });


            return NextResponse.json(
                { message: 'Registration success' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: 'Invalid form data' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error in API endpoint:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}