'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideLayout && <NavigationBar />}
      <main className="min-h-[calc(100vh-120px)] px-4 pt-20 pb-8 max-w-4xl mx-auto">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
