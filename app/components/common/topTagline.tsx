import React from 'react';

interface TopTaglineProps {
    title: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    textColor?: string;
}

const TopTagline: React.FC<TopTaglineProps> = ({ title, align, className, textColor}) => {
    return (
        <div className={`flex items-center gap-2 md:mb-3 ${align ? `text-${align} justify-${align}` : 'text-left'} ${className}`}>
            <div className="flex items-center gap-1">
                <span className={`w-1 h-4 bg-${textColor ? textColor : 'yellow-400'} -skew-x-12 opacity-30`}></span>
                <span className={`w-1 h-4 bg-${textColor ? textColor : 'yellow-400'} -skew-x-12 opacity-50`}></span>
                <span className={`w-1 h-4 bg-${textColor ? textColor : 'yellow-400'} -skew-x-12`}></span>
            </div>
            <span className={`uppercase text-${textColor ? textColor : 'yellow-500'}  font-bold`}>{title}</span>
        </div>
    );  
};

export default TopTagline;