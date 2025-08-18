'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  label: string;
  path: string;
}

interface ThemeSettingsLayoutProps {
  children: ReactNode;
}

const menuItems: MenuItem[] = [
  { label: 'General', path: '/admin/theme-settings' },
  { label: 'Header', path: '/admin/theme-settings/header' },
  { label: 'Footer', path: '/admin/theme-settings/footer' },
  { label: 'Home Page', path: '/admin/theme-settings/home-page' },
  { label: 'Email Settings', path: '/admin/theme-settings/email' },
];

export default function ThemeSettingsLayout({ children }: ThemeSettingsLayoutProps) {
  const pathname = usePathname();

  return(
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background">
        <nav className="p-4">
          <h2 className="mb-4 text-xl font-semibold">Theme Settings</h2>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}