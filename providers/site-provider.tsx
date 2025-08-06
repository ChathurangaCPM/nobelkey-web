"use client";
import Placeholder from "@/app/components/placeholder";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";


interface SiteContextType {
    siteState: UserContextData;
    setSiteState: (siteState: UserContextData) => void;
    isLoadingSiteData: boolean;
}

interface UserContextData {
    [key: string]: any;
}

interface SiteProviderProps {
    children: ReactNode;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: SiteProviderProps) {
    const [siteState, setSiteState] = useState<UserContextData>({});
    const [isLoadingSiteData, setIsLoadingSiteData] = useState<boolean>(true);

    const getCurrentUserMeta = async () => {
        try {
            const res = await fetch('/api/site/theme', {
                method: "GET",
            });

            if (res && res.status === 200) {
                const { data } = await res.json();

                setSiteState(data);
                setIsLoadingSiteData(false);
            }
        } catch (e) {
            console.error("Error fetching state:", e);
            // Fall back to session data if state fetch fails
            setSiteState({});
            setIsLoadingSiteData(false);
        }
    };

    useEffect(() => {
        getCurrentUserMeta();
    }, []);

    return (
        <SiteContext.Provider value={{ siteState, setSiteState, isLoadingSiteData }}>
            {isLoadingSiteData ? <Placeholder /> : <div className="transition-all ease-in-out">{children}</div>}
        </SiteContext.Provider>
    );
}

export function useSiteContext(): SiteContextType {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSiteContext must be used within an SiteProvider');
    }
    return context;
}