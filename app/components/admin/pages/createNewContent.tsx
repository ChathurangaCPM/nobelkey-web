"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import AddNewComponent from "./addNewComponent";
import { Component, COMPONENT_TYPES, ComponentProp } from "@/lib/componentTypes";

// Define the possible prop value types based on your component system
type ComponentPropValue = string | number | unknown[] | undefined;
import ImageSelector from "../imageSelector";
import { Textarea } from "@/components/ui/textarea";
import ServiceRepeater from "./custom/servicesRepeater";
import WelcomeSection from "./preview/welcomeSection";
import WhatWeDo from "./preview/whatWeDo";

import TestimonialsRepeater from "./custom/testimonialsRepeater";
import TestimonialsRightRepeater from "./custom/testimonialsRightRepeater";
import TestimonialsPreview from "./preview/testimonialsView";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import CallUsNowPreview from "./preview/callUsNow";
import MainBanner from "./preview/mainBanner";
import BookYourRide from "./preview/bookYourRide";
import ChooseYourRide from "./preview/chooseYourRide";

interface CreateNewContentProps {
  data?: string[];
  editData?: string[];
  onChange?: (data: Component[]) => void;
}

interface ImageType {
  url: string;
  alt: string;
}

const CreateNewContent: React.FC<CreateNewContentProps> = ({ onChange, editData }) => {
  const [components, setComponents] = useState<Component[]>(editData?.map(item => JSON.parse(item)) || []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [shouldDelete, setShouldDelete] = useState<string>("");

  // Updated to handle ComponentPropValue types
  const handleUpdateComponent = (id: string, props: Record<string, ComponentPropValue>) => {
    // Convert all prop values to string to match ComponentPropsType
    const stringifiedProps: Record<string, string> = Object.fromEntries(
      Object.entries(props).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
    );
    const updatedComponents = components.map(component =>
      component.id === id ? { ...component, props: stringifiedProps } : component
    );
    setComponents(updatedComponents);

    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, props: stringifiedProps });
    }
  };

  const handleDeleteComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComponents(components.filter(component => component.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
      setIsSheetOpen(false);
    }
  };

  const renderComponentPreview = (component: Component) => {
    switch (component.customName) {
      case "mainBanner":
        return  <MainBanner propsData={component.props}/>;
      case "welcomeSection":
        return <WelcomeSection propsData={component.props} />;
      case "whatWeOffer":
        return <WhatWeDo propsData={component.props} />;
      case "bookYourRide":
        return <BookYourRide propsData={component.props} />;
      case "chooseYourRide":
        return <ChooseYourRide propsData={component.props} />;
      case "testimonials":
        return <TestimonialsPreview propsData={component.props} />;
      case "callUsNow":
        return <CallUsNowPreview propsData={component.props} />;
      default:
        return null;
    }
  };

  const renderPropInput = (
    key: string,
    value: ComponentPropValue, // Use our defined union type
    propDef: ComponentProp | undefined,
    onChange: (value: ComponentPropValue) => void // Use our defined union type
  ) => {

    if (!propDef) {
      return (
        <Input
          id={key}
          value={typeof value === 'string' ? value : value?.toString() || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    switch (propDef.type) {
      case 'textarea':
        return (
          <Textarea
            id={key}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            id={key}
            value={typeof value === 'string' ? value : ''}
            className="w-full p-2 border rounded-md"
            onChange={(e) => onChange(e.target.value)}
          >
            {propDef.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="color"
              id={key}
              value={typeof value === 'string' ? value : '#000000'}
              className="w-16 h-8"
              onChange={(e) => onChange(e.target.value)}
            />
            <Input
              type="text"
              value={typeof value === 'string' ? value : ''}
              className="flex-1"
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
      case 'groupTitle':
        return <h2 className="text-xl font-semibold capitalize">{propDef?.displayName}</h2>;
      case 'serviceRepeater':
        return <ServiceRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)} // Pass the array directly instead of stringifying
        />;
      case 'testimonials':
        return <TestimonialsRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)} // Pass the array directly instead of stringifying
        />;
      case 'testimonialsRightRepeater':
        return <TestimonialsRightRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)} // Pass the array directly instead of stringifying
        />;
      case 'number':
        return (
          <Input
            type="number"
            id={key}
            value={typeof value === 'string' || typeof value === 'number' ? value.toString() : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'image':
      case 'mainImage':
        return (
          <ImageSelector
            value={typeof value === 'string' ? value : ''}
            onChange={(images: ImageType[]) => {
              if (images.length > 0) {
                onChange(images[0].url);
              }
            }}
            removeImage={(shouldRemove: boolean) => {
              if (shouldRemove) {
                onChange('');
              }
            }}
          />
        );
      default:
        return (
          <Input
            id={key}
            value={typeof value === 'string' ? value : value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  // Effect to update parent component when components change
  useEffect(() => {
    if (onChange) {
      onChange(components);
    }
  }, [components, onChange]);

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Components</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {components.map((component, i) => (
          <Card
            key={component.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center" >
                  <div className="grid place-items-center px-3 text-sx py-2 bg-slate-100 rounded-full border-[1px] w-[45px] h-[45px]">
                    {i + 1 < 9 ? `0${i + 1}` : i + 1}
                  </div>
                  <h3 className="text-[20px] font-semibold">{component.type}</h3>
                </div>
                <div className="flex gap-4">
                  <div className="w-full hover:bg-black/25 transition-all ease-in-out" onClick={() => {
                    setSelectedComponent(component);
                    setIsSheetOpen(true);
                  }}>
                    {renderComponentPreview(component)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => {
                      setShowConfirmDelete(true);
                      setShouldDelete(component.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showConfirmDelete} onOpenChange={() => setShowConfirmDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => handleDeleteComponent(shouldDelete, e)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddNewComponent
        isSheetOpen={setIsSheetOpen}
        onSelected={(component: Component) => {
          setSelectedComponent(component);
          setComponents([...components, component]);
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="min-w-[40vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit {selectedComponent?.type}</SheetTitle>
          </SheetHeader>
          {selectedComponent && (
            <div className="mt-4 space-y-4">
              {Object.entries(selectedComponent.props).map(([key, value]) => {
                const componentType = COMPONENT_TYPES.find(
                  t => t.name === selectedComponent.type
                );
                const propDefinition = componentType?.propDefinitions?.find(
                  p => p.name === key
                );

                return (
                  <div key={key} className="space-y-2">
                    {propDefinition?.type !== "groupTitle" && <Label htmlFor={key}>{propDefinition?.displayName}</Label>}
                    {renderPropInput(
                      key,
                      value, // No longer need to stringify/parse here
                      propDefinition,
                      (newValue) => {
                        const newProps = {
                          ...selectedComponent.props,
                          [key]: newValue,
                        };
                        handleUpdateComponent(selectedComponent.id, newProps);
                      }
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateNewContent;