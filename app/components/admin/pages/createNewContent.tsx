"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


import SliderItems from "./custom/sliderItems";
import NumberResults from "./preview/numberResults";
import NumberItems from "./custom/numberItems";
import FeaturedServices from "./preview/featuredServices";
import ServiceItems from "./custom/serviceItems";
import RecentProjects from "../../home/recentProjects";
import ProjectItems from "./custom/projectsItems";
import OurBrandRow from "../../home/ourBrandRow";
import LinksRepeater from "./custom/linksRepeaterItems";
import BlogSection from "../../home/blogSection";
import BlogItems from "./custom/blogItems";
import GetQuote from "../../home/getQuote";
import MainBanner from "../../mainBanner";
import InnerBanner from "../../innerPages/innerBanner";
import GeneralContent from "../../innerPages/generalContent";

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
  
  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over index if we're leaving the component area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newComponents = [...components];
    const draggedComponent = newComponents[draggedIndex];
    
    // Remove the dragged component from its original position
    newComponents.splice(draggedIndex, 1);
    
    // Insert the dragged component at the new position
    // Adjust the drop index if we removed an item before it
    const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newComponents.splice(adjustedDropIndex, 0, draggedComponent);
    
    setComponents(newComponents);
    setDragOverIndex(null);
  };

  const renderComponentPreview = (component: Component) => {
    switch (component.customName) {
      case "mainBanner":
        return  <MainBanner {...component.props}/>;
      case "welcomeSection":
        return <WelcomeSection propsData={component.props} />;
      case "numberResults":
        return <NumberResults {...component.props} />;
      case "featuredServices":
        return <FeaturedServices serviceItems={[]} {...component.props} />;
      case "recentProjects":
        return <RecentProjects projects={[]} isAdmin {...component.props} />;
      case "ourBrandRow":
        return <OurBrandRow linkCards={[]} isAdmin {...component.props} />;
      case "blogSection":
        return <BlogSection {...component.props}  />;
      case "getQuote":
        return <GetQuote {...component.props} isAdmin/>;
      // inner page components
      case "innerBanner":
        return <InnerBanner {...component.props} isAdmin/>;
      case "generalContent":
        return <GeneralContent {...component.props}/>;
      default:
        return null;
    }
  };

  const renderPropInput = (
    key: string,
    value: ComponentPropValue,
    propDef: ComponentProp | undefined,
    onChange: (value: ComponentPropValue) => void
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
            rows={5}
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
      case 'email':
        return (
          <div className="w-full">
            <Input
              type="email"
              id={key}
              value={typeof value === 'string' ? value : ''}
              className="w-full"
              placeholder="Email Address"
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
      case 'groupTitle':
        return <h2 className="text-xl font-semibold capitalize">{propDef?.displayName}</h2>;
      case 'serviceRepeater':
        return <ServiceRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'sliderItems':
        return <SliderItems
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'numberItems':
        return <NumberItems
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'serviceItems':
        return <ServiceItems
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'projectsRepeater':
        return <ProjectItems
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'linksRepeater':
        return <LinksRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'blogItems':
        return <BlogItems
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'testimonials':
        return <TestimonialsRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
        />;
      case 'testimonialsRightRepeater':
        return <TestimonialsRightRepeater
          value={Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])}
          onChange={(e) => onChange(e)}
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
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, i)}
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
              draggedIndex === i ? 'opacity-40 scale-105' : ''
            } ${
              dragOverIndex === i ? 'border-blue-500 border-2 bg-blue-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <div className="grid place-items-center px-3 text-sx py-2 bg-slate-100 rounded-full border-[1px] w-[45px] h-[45px]">
                    {i + 1 < 9 ? `0${i + 1}` : i + 1}
                  </div>
                  <h3 className="text-[20px] font-semibold flex-1">{component.type}</h3>
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmDelete(true);
                        setShouldDelete(component.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  className="w-full hover:bg-black/25 transition-all ease-in-out" 
                  onClick={(e) => {
                    // Prevent opening sheet when dragging
                    if (draggedIndex === null) {
                      setSelectedComponent(component);
                      setIsSheetOpen(true);
                    }
                  }}
                >
                  {renderComponentPreview(component)}
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
                      value,
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