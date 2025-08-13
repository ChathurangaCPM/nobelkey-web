import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Component, COMPONENT_TYPES } from "@/lib/componentTypes";
import { Plus, PlusCircle } from "lucide-react";
import { useState } from "react";

interface AddNewComponentProps {
    onSelected: (component: Component) => void;
    isSheetOpen: (open: boolean) => void;
}

const AddNewComponent: React.FC<AddNewComponentProps> = ({
    onSelected,
    isSheetOpen
}) => {
    const [components, setComponents] = useState<Component[]>([]);
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

    const handleAddComponent = (type: string) => {
        const componentType = COMPONENT_TYPES.find(c => c.name === type);
        if (!componentType) return;

        const newComponent: Component = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            customName: componentType?.customName,
            props: { ...componentType.defaultProps as Record<string, string | undefined> }
        };

        setComponents([...components, newComponent]);
        onSelected(newComponent);
        isSheetOpen(true);
    };

    return (
        <div>
            <Button onClick={() => setIsOpenDialog(true)} className="flex items-center gap-2 justify-center p-7 border-[1px] border-dashed rounded-md w-full" variant="outline">
                <PlusCircle />
                Add New Component
            </Button>
            <Dialog open={isOpenDialog} onOpenChange={() => setIsOpenDialog(false)}>
                <DialogContent className="min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Add new component</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-3">Page Components</h3>
                            <div className="space-y-2">
                                {COMPONENT_TYPES.filter(type => type.category === "basic").map((type) => (
                                    <Button
                                        key={type.name}
                                        onClick={() => {
                                            setIsOpenDialog(false)
                                            handleAddComponent(type.name)
                                        }}
                                        variant="outline"
                                        className="w-full justify-start space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add {type.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-3">Home Components</h3>
                            <div className="space-y-2">
                                {COMPONENT_TYPES.filter(type => type.category === "home").map((type) => (
                                    <Button
                                        key={type.name}
                                        onClick={() => {
                                            setIsOpenDialog(false)
                                            handleAddComponent(type.name)
                                        }}
                                        variant="outline"
                                        className="w-full justify-start space-x-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add {type.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewComponent;