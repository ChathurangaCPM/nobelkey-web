import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Type for the icon entry
type IconComponent = React.ElementType;
type IconEntry = [string, IconComponent];

interface IconsPopupProps {
  itemsPerPage?: number;
  onIconSelect?: (iconName: string, Icon: IconComponent) => void;
  selectedIcon?: string;
}

const IconsPopup: React.FC<IconsPopupProps> = ({ 
  itemsPerPage = 48,
  onIconSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [displayedItems, setDisplayedItems] = useState<number>(itemsPerPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Filter out non-icon exports and convert to array
  const iconList = Object.entries(LucideIcons).filter(([name]) => 
    name !== 'createLucideIcon' && name !== 'default'
  ) as IconEntry[];
  
  // Filter icons based on search term
  const filteredIcons = iconList.filter(([name]) => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setDisplayedItems((prev) => {
              const next = prev + itemsPerPage;
              return Math.min(next, filteredIcons.length);
            });
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [filteredIcons.length, isLoading, itemsPerPage]);

  // Reset displayed items when search term changes
  useEffect(() => {
    setDisplayedItems(itemsPerPage);
  }, [searchTerm, itemsPerPage]);

  const handleIconClick = (name: string, Icon: IconComponent) => {
    if (onIconSelect) {
      onIconSelect(name, Icon);
      setOpenPopup(false)
    }
  };

  return (
    <Dialog open={openPopup} onOpenChange={() => setOpenPopup(false)}>
      <Button variant="outline" onClick={(e) => {
        e.preventDefault();
        setOpenPopup(true)
      }}>Select a Icon</Button>

      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Lucide Icons ({filteredIcons.length} icons)</DialogTitle>
        </DialogHeader>
        
        <div className="sticky top-0 bg-white dark:bg-gray-950 py-4 z-10">
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-10rem)]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredIcons.slice(0, displayedItems).map(([name, Icon]) => (
              <div
                key={name}
                className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleIconClick(name, Icon)}
                title={`Click to select ${name}`}
              >
                {/* Here we explicitly render the Icon component */}
                <Icon className="w-8 h-8 mb-2" />
                <p className="text-xs text-center truncate w-full">{name}</p>
              </div>
            ))}
          </div>
          
          {displayedItems < filteredIcons.length && (
            <div
              ref={observerTarget}
              className="flex justify-center items-center p-4"
            >
              {isLoading ? (
                <LucideIcons.Loader2 className="animate-spin h-8 w-8" />
              ) : (
                <span className="text-sm text-gray-500">Scroll for more</span>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconsPopup;