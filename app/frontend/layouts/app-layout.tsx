import React from 'react';
import {Card} from '@/frontend/ui/card';
import {Sidebar} from '../components/sidebar/sidebar.component';

interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  subheader?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({children}) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />
      <div className="flex flex-col sm:gap-2 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-2 pl-0 md:gap-8">
          <Card className="relative h-[calc(100vh-1rem)] overflow-auto border-[0.5px]">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
};
