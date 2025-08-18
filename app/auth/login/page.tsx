"use client"
import { signIn } from "next-auth/react"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderCircle, Lock, Mail, Shield, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields", { 
                duration: 4000, 
                position: "top-center" 
            });
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address", { 
                duration: 4000, 
                position: "top-center" 
            });
            return false;
        }

        try {
            setIsLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/admin"
            });

            if (result?.error) {
                toast.error(result.error, { 
                    duration: 4000, 
                    position: "top-center" 
                });
            } else {
                toast.success("Login successful! Redirecting...", { 
                    duration: 2000, 
                    position: "top-center" 
                });
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred. Please try again.", { 
                duration: 4000, 
                position: "top-center" 
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your admin dashboard</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
                            Admin Login
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Enter your credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start space-x-2">
                                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-blue-800">
                                    <p className="font-medium mb-1">Secure Login</p>
                                    <p>Your connection is encrypted and secure. Only authorized personnel should access this area.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2024 Admin Dashboard. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
