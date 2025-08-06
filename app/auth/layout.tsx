import React from 'react';

export default function AdminAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <div className="">
                {children}
            </div>
        </div>
    );
}