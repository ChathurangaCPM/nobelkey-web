'use client';

import React from 'react';

interface ReadMoreButtonProps {
    text?: string;
    href?: string;
    className?: string;
    onClick?: () => void;
}

const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
    text = 'Read More',
    href,
    className = '',
    onClick
}) => {
    const ButtonTag = href ? 'a' : 'button';
    
    return (
        <ButtonTag
            href={href}
            onClick={onClick}
            className={`
                inline-block
                bg-orange-500
                text-white
                font-bold
                py-2
                px-5
                pr-8
                text-sm
                transform
                relative
                capitalize
                overflow-hidden
                group
                ${className}
            `}
            style={{
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
            }}
        >
            <span className="relative z-10">{text}</span>
            <div 
                className="
                    absolute 
                    top-0 
                    left-0 
                    w-full 
                    h-full 
                    bg-black
                    transform 
                    -translate-x-full 
                    group-hover:translate-x-0 
                    transition-transform 
                    duration-300 
                    ease-in-out
                "
            />
        </ButtonTag>
    );
};

export default ReadMoreButton;