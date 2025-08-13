"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";

const AdminFooterPrivacyLinks: React.FC = () => {
    const form = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "privacyLinks",
    });

    const handleAddNew = () => {
        if (fields.length < 10) {
            append({
                id: Date.now(),
                title: '',
                url: ''
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Privacy Links</h3>

            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex justify-between gap-4 items-start p-4 border rounded-lg relative">
                        <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name={`privacyLinks.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., About Us" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`privacyLinks.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., /about-us" {...field} />
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
                <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
                    No privacy links added. Click the button above to add your first link.
                </div>
            )}
            <Button
                type="button"
                variant="outline"
                onClick={handleAddNew}
                disabled={fields.length >= 10}
            >
                Add new link
            </Button>
        </div>
    );
};

export default AdminFooterPrivacyLinks;