import React, { useState, useCallback, useEffect, memo } from 'react';
import { FormControl, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import IconsPopup from '../common/iconPopup';
import { Control } from "react-hook-form";

// Form values interface to match your zod schema
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

interface ContentItem {
    topTitle: string;
    content: string;
    iconName?: string;
    link?: string;
}

interface ContentItemWithId extends ContentItem {
    id: number;
}

const initialItem: ContentItem = {
    topTitle: '',
    content: '',
    iconName: '',
    link: '',
};

interface ItemProps {
    row: ContentItemWithId;
    onRemove: (id: number) => void;
    onInputChange: (id: number, field: keyof ContentItem, value: string) => void;
}

interface MultiContentFormProps {
    control?: Control<FormValues>; // Updated to use react-hook-form Control type
    onChange?: (items: ContentItemWithId[]) => void;
    data?: {
        items?: ContentItemWithId[];
    };
    max?: number;
}

const ContentItem = memo(({ row, onRemove, onInputChange }: ItemProps) => {
    const handleIconSelect = (iconName: string) => {
        onInputChange(row.id, 'iconName', iconName);
    };

    const SelectedIcon = row.iconName ? (LucideIcons[row.iconName as keyof typeof LucideIcons] as LucideIcon) : null;

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormItem>
                    <FormLabel className="font-semibold">Icon</FormLabel>
                    <FormControl>
                        <>
                            {SelectedIcon && (
                                <div className="p-2">
                                    <SelectedIcon className="w-10 h-10" strokeWidth={1}/>
                                </div>
                            )}
                            <IconsPopup
                                onIconSelect={handleIconSelect}
                                selectedIcon={row.iconName}
                            />
                        </>
                    </FormControl>
                    {!row.iconName && (
                        <FormDescription className="text-xs">
                            Select an icon from the popup
                        </FormDescription>
                    )}
                </FormItem>
            </div>

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <FormItem>
                        <FormLabel className="font-semibold">Top Title</FormLabel>
                        <FormControl>
                            <Input
                                value={row.topTitle}
                                onChange={(e) => onInputChange(row.id, 'topTitle', e.target.value)}
                                placeholder="Enter top title"
                            />
                        </FormControl>
                    </FormItem>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(row.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <FormItem>
                <FormLabel className="font-semibold">Content</FormLabel>
                <FormControl>
                    <Input
                        value={row.content}
                        onChange={(e) => onInputChange(row.id, 'content', e.target.value)}
                        placeholder="Enter content"
                    />
                </FormControl>
            </FormItem>

            <FormItem>
                <FormLabel className="font-semibold">Link</FormLabel>
                <FormControl>
                    <Input
                        type="text"
                        value={row.link || ''}
                        onChange={(e) => onInputChange(row.id, 'link', e.target.value)}
                        placeholder="Enter link"
                    />
                </FormControl>
            </FormItem>
        </div>
    );
});

ContentItem.displayName = 'ContentItem';

const AddButton = memo(({ onClick }: { onClick: () => void }) => (
    <div
        onClick={onClick}
        className="flex flex-col gap-3 p-5 border border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer"
    >
        <PlusCircle className="w-10 h-10 text-muted-foreground" strokeWidth={0.8} />
        <span>Add New Item</span>
    </div>
));

AddButton.displayName = 'AddButton';

const MultiContentForm: React.FC<MultiContentFormProps> = ({
    onChange,
    data,
    max = 3
}) => {
    const [items, setItems] = useState<ContentItemWithId[]>([{ id: 1, ...initialItem }]);

    const handleRemoveRow = useCallback((id: number) => {
        setItems(prevItems =>
            prevItems
                .filter(row => row.id !== id)
                .map((row, index) => ({ ...row, id: index + 1 }))
        );
    }, []);

    const handleInputChange = useCallback((id: number, field: keyof ContentItem, value: string) => {
        setItems(prevItems =>
            prevItems.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    }, []);

    const handleAddRow = useCallback(() => {
        if (items.length < max) {
            const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
            setItems(prevItems => [...prevItems, { id: newId, ...initialItem }]);
        }
    }, [items, max]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChange?.(items);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [items, onChange]);

    useEffect(() => {
        if (data?.items) {
            setItems(data.items);
        }
    }, [data]);

    return (
        <div className="space-y-4">
            {items.map((row) => (
                <ContentItem
                    key={row.id}
                    row={row}
                    onRemove={handleRemoveRow}
                    onInputChange={handleInputChange}
                />
            ))}
            {items && items?.length < max && <AddButton onClick={handleAddRow} />}
        </div>
    );
};

export default memo(MultiContentForm);