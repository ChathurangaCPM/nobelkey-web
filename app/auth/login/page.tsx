"use client"
import { signIn } from "next-auth/react"
import { FormEvent, useState } from "react"


import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const LoginPage:React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        if (!email || !password){
            toast.error("Please fill the input", { duration: 5000, position: "top-center" });
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

            setIsLoading(false);

            if (result?.error) {
                toast.error(result.error, { duration: 5000, position: "top-center" });
            }

            toast.error("Login Successfully", { duration: 5000, position: "top-center" });
        } catch (error) {
            setIsLoading(false);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center">Login</h1>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-2 border rounded-lg"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-2 border rounded-lg"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        {isLoading && <LoaderCircle className="animate-spin mr-1" size={10}/>}
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;