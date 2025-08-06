'use client';

import { useSiteContext } from '@/providers/site-provider';
import { ReactNode } from 'react';


interface ClientWrapperProps {
  children: (siteState: object) => ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { siteState } = useSiteContext();
  return <>{children(siteState)}</>;
}