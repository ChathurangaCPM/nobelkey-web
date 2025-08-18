"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, Navigation } from "lucide-react";

const AdminHeaderNavigationLinks: React.FC = () => {
    const form = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "navigationLinks",
    });

    const handleAddNew = () => {
        if (fields.length < 8) {
            append({
                id: Date.now(),
                title: '',
                url: ''
            });
        }
    };

    return (
        <div className="space-y-4 border-[1px] rounded-2xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Main Navigation Links</h3>
                </div>
            </div>

            <p className="text-sm text-muted-foreground">
                Add navigation links that will appear in your website's main header menu.
            </p>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex justify-between gap-4 items-start p-4 border rounded-lg relative bg-gray-50/50">
                        <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name={`navigationLinks.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Menu Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Home, About, Services, Contact" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`navigationLinks.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL / Page Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., /, /about, /services, /contact" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <div className="text-center p-6 border border-dashed rounded-lg text-muted-foreground bg-gray-50/30">
                    <Navigation className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No navigation links added yet.</p>
                    <p className="text-xs">Click the button below to add your first navigation link.</p>
                </div>
            )}
            
            <Button
                type="button"
                variant="outline"
                onClick={handleAddNew}
                disabled={fields.length >= 8}
                className="w-full"
            >
                <Navigation className="h-4 w-4 mr-2" />
                Add Navigation Link {fields.length > 0 && `(${fields.length}/8)`}
            </Button>
        </div>
    );
};

export default AdminHeaderNavigationLinks;
