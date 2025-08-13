"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthContext } from '@/providers/auth-provider';

interface ThemeData {
    header?: {
        logo?: string;
        topLeftText?: string;
        mainContent?: Array<{
            id: number;
            topTitle: string;
            content: string;
        }>;
    };
    selectedHomePage?: string;
}

interface State {
    data?: {
        theme?: ThemeData;
    };
}

interface Page {
    _id: string;
    title: string;
}

const HomePageSettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState("");
    const [error, setError] = useState("");
    const { state, setState } = useAuthContext();

    const getAllPages = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/page', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data } = await response.json();
            console.log("data==", data);

            setPages(data);

            if (state?.data?.theme?.selectedHomePage) {
                setSelectedPage(state.data.theme.selectedHomePage);
            }
        } catch (error) {
            console.log("error", error);

            setError("Failed to load pages. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPage) {
            setError("Please select a page");
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                type: 'selectedHomePage',
                data: selectedPage
            }

            const response = await fetch('/api/admin/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                toast.error("Something went wrong!", {
                    position: 'top-center'
                });
                throw new Error('Response not OK');
            }

            setState((prevState: State) => ({
                ...prevState,
                data: {
                    ...prevState?.data,
                    theme: {
                        ...prevState?.data?.theme,
                        selectedHomePage: selectedPage,
                    }
                }
            }));

            toast.success("Settings saved successfully!", {
                position: 'top-center',
                richColors: true,
            });
        } catch (error) {
            console.log("error", error);

            setError("Failed to save settings. Please try again.");
            toast.error("Failed to save settings. Please try again.", {
                position: 'top-center'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllPages();
    }, []);


    return (
        <div className="w-full max-w-md p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label>Select a Home page</Label>
                    <Select
                        value={selectedPage}
                        onValueChange={(value) => {
                            setSelectedPage(value);
                            setError('');
                        }}
                    >
                        <SelectTrigger className="w-full">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Loading...</span>
                                </div>
                            ) : (
                                <SelectValue placeholder="Select Page" />
                            )}
                        </SelectTrigger>
                        <SelectContent>
                            {pages.map((page: Page, index: React.Key) => (
                                <SelectItem key={index} value={page._id}>
                                    {page.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Save'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default HomePageSettings;