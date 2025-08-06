"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserData {
    id?: string;
    [key: string]: any;
}

interface AuthContextType {
    state: UserContextData;
    setState: (state: UserContextData) => void;
    isLoadingAuthData: boolean;
}

interface UserContextData {
    [key: string]: any;
}

interface AuthUserProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthUserProvider({ children }: AuthUserProviderProps) {
    const session = useSession();
    const [state, setState] = useState<UserContextData>({});
    const [isLoadingAuthData, setIsLoadingAuthData] = useState<boolean>(true);
    const router = useRouter();

    const getCurrentUserMeta = async (uData: UserData) => {
        try {
            if (uData && uData?.id) {
                const res = await fetch('/api/admin/state', {
                    method: "GET",
                });

                if (res && res.status === 200) {
                    const data = await res.json();

                    // Combine session data, user data, and the received state data
                    const payload: UserContextData = {
                        ...session,
                        ...uData,
                        ...data // Add all received data from the API
                    };

                    // Clean up any _id fields in nested objects if needed
                    if (payload.business) {
                        payload.business.id = payload.business._id;
                        delete payload.business._id;
                    }

                    setState(payload);
                    setIsLoadingAuthData(false);
                }
            }
        } catch (e) {
            console.error("Error fetching state:", e);
            // Fall back to session data if state fetch fails
            setState({ ...session, ...uData });
            setIsLoadingAuthData(false);
        }
    };

    useEffect(() => {
        if (session?.status === "authenticated" && session?.data?.user?.id) {
            getCurrentUserMeta(session.data.user);
        } else if (session?.status === "unauthenticated") {
            // Reset state when session is unauthenticated
            setState({});
            setIsLoadingAuthData(false);
        }
    }, [session]);

    return (
        <AuthContext.Provider value={{ state, setState, isLoadingAuthData }}>
            {isLoadingAuthData ? <div className="flex items-center justify-center h-[100vh] w-screen">
                <h3 className="font-semibold">Please wait...</h3>
            </div> : children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthUserProvider');
    }
    return context;
}