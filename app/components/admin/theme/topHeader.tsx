import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FacebookIcon, InstagramIcon, LinkedinIcon, Twitter } from "lucide-react";
import { Control } from "react-hook-form";

// Update the interface to match the zod schema
interface FormValues {
    logo: string;
    topLeftText?: string;
    fb?: string;
    twt?: string;
    insta?: string;
    linkend?: string;
    mainContent?: Array<{
        id: number;
        topTitle: string;
        content: string;
        iconName?: string;
        link?: string;
    }>;
}

interface TopHeaderProps {
    control: Control<FormValues>;
}

const TopHeader: React.FC<TopHeaderProps> = ({
    control
}) => {
    return (
        <div className="space-y-4">
            <div>Top header</div>

            <FormField
                control={control}
                name="topLeftText"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold">Left top text</FormLabel>
                        <FormControl>
                            <Input value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                        <FacebookIcon size={15} />
                    </div>
                    <FormField
                        control={control}
                        name="fb"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input value={field.value || ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                        <Twitter size={15} />
                    </div>
                    <FormField
                        control={control}
                        name="twt"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input value={field.value || ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                        <InstagramIcon size={15} />
                    </div>
                    <FormField
                        control={control}
                        name="insta"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input value={field.value || ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border">
                        <LinkedinIcon size={15} />
                    </div>
                    <FormField
                        control={control}
                        name="linkend"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input value={field.value || ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopHeader;