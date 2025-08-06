"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";

const AdminFooterWorkingHours: React.FC = () => {
    const form = useFormContext();
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "workingHours",
    });

    const handleAddNew = () => {
        if (fields.length < 4) {
            append({ 
                id: Date.now(),
                topTitle: '', 
                content: '' 
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Working Hours</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddNew}
                    disabled={fields.length >= 4}
                >
                    Add new working time
                </Button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg relative">
                        <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name={`workingHours.${index}.topTitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Monday - Friday" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`workingHours.${index}.content`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hours</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 9:00 AM - 5:00 PM" {...field} />
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
                    No working hours added. Click the button above to add your first working hours.
                </div>
            )}
        </div>
    );
};

export default AdminFooterWorkingHours;