"use client";

import React, { useState, useEffect } from 'react';
import { AlignJustify, LucideIcon } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import * as LucideIcons from 'lucide-react';
import { useSiteContext } from '@/providers/site-provider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MainContent {
    id: number;
    topTitle?: string;
    content?: string;
    iconName?: string;
    link?: string;
};

const Header: React.FC = () => {
    const { siteState } = useSiteContext();
    const pathname = usePathname();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [openSheet, setOpenSheet] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const [headerData, setHeaderData] = useState(siteState?.header || {});

    const navigationItems = [
        { name: 'Home', href: '/' },
        { name: 'NobleKey', href: '/noblekey' },
        { name: 'Our Services', href: '/our-services' },
        { name: 'Our Products', href: '/our-products' },
        { name: 'Contact Us', href: '/contact-us' }
    ];

    const mobileNavigationItems = [
        { name: 'Home', href: '/' },
        { name: 'Company', href: '/company' },
        { name: 'Our Taxi', href: '/our-taxi' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' }
    ];

    const getIcon = (iconName: string) => {
        const Icon = iconName ? (LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon) : null;
        return Icon ? <Icon className="text-yellow-400" /> : null;
    }

    const isActiveLink = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    const getLinkClassName = (href: string) => {
        const baseClasses = "px-3 first:pl-0 font-normal transition-colors border-r-[1px] border-[#808285] last:border-r-0 leading-3 tracking-tighter";
        const isActive = isActiveLink(href);
        
        if (isActive) {
            return `${baseClasses} text-white font-medium relative after:content-[''] after:absolute after:bottom-[-8px] after:left-3 after:right-3 after:h-[2px] after:bg-yellow-400 after:rounded-full`;
        }
        
        return `${baseClasses} text-[#808285] hover:text-white`;
    };

    const getMobileLinkClassName = (href: string) => {
        const baseClasses = "px-2 py-2 transition-colors rounded-md";
        const isActive = isActiveLink(href);
        
        if (isActive) {
            return `${baseClasses} text-blue-900 bg-blue-50 font-medium border-l-4 border-blue-900`;
        }
        
        return `${baseClasses} text-black hover:text-blue-900 hover:bg-gray-50`;
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            // Update background state based on scroll position
            setHasScrolled(currentScrollPos > 0);

            // Always show header at top
            if (currentScrollPos === 0) {
                setVisible(true);
            }
            // If header is currently hidden and user scrolls up, show it
            else if (!visible && prevScrollPos > currentScrollPos) {
                setVisible(true);
            }
            // Hide header only when scrolling down from position 0
            else if (visible && prevScrollPos === 0 && currentScrollPos > 0) {
                setVisible(false);
            }

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos, visible]);

    useEffect(() => {
        setHeaderData(siteState.header)
    }, [siteState])

    const isHomePage = pathname === '/';

    return (
        <div className={`w-full xl:w-full fixed top-0 z-50 left-0 transition-all duration-300 ${visible ? 'translate-y-0' : ''} ${
            !isHomePage 
                ? 'bg-[#0F1A42]/95 backdrop-blur-md' 
                : hasScrolled 
                    ? 'bg-[#0F1A42]/90 backdrop-blur-sm' 
                    : 'bg-transparent'
        }`}>
            {/* Main header */}
            <div className={`w-11/12 xl:max-w-[1400px] border-b border-white/15 mx-auto flex justify-between items-center px-2 md:px-0 relative z-30 transition-all duration-300 ${!visible || !isHomePage ? 'py-1' : 'py-4'}`}>
                <div className='text-[#808285] flex-1 text-[15px]'>
                    <div className='xl:hidden'>
                        <Button variant={'ghost'} className='focus:bg-transparent focus:text-black' onClick={() => setOpenSheet(true)}>
                            <AlignJustify />
                            Menu
                        </Button>
                    </div>

                    <nav className="hidden xl:flex">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={getLinkClassName(item.href)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className='flex justify-center items-center'>
                    <Link href="/" className="w-[140px] min-h-[70px] flex justify-center items-center">
                        {headerData?.logo && <Image src={headerData?.logo} alt="Main logo" width={150} height={80} className='w-full block' />}
                    </Link>
                </div>
                <div className='flex-1 flex justify-end'>
                    <div className='flex flex-col gap-[6px] w-[40px] cursor-pointer'>
                        <span className='bg-white h-[2px] w-full'></span>
                        <span className='bg-white h-[2px] w-full'></span>
                        <span className='bg-white h-[2px] w-full'></span>
                    </div>
                </div>
            </div>

            <Sheet open={openSheet} onOpenChange={() => setOpenSheet(false)}>
                <SheetContent side={'left'}>
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <div className='flex flex-col gap-1 mt-4'>
                        {mobileNavigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={getMobileLinkClassName(item.href)}
                                onClick={() => setOpenSheet(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Header;