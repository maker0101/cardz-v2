import React from 'react';
import {CardHeader, CardContent} from '@/frontend/ui/card';

interface AppPageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  subheader?: React.ReactNode;
}

export const AppPageLayout: React.FC<AppPageLayoutProps> = ({
  children,
  header,
  subheader,
}) => {
  return (
    <div className="flex h-full flex-col">
      <CardHeader className="sticky top-0 z-10 h-[45px] w-full flex-row items-center justify-between space-y-0 border-b-[0.5px] bg-card pl-9 pr-6">
        {header}
      </CardHeader>
      {subheader && (
        <div className="sticky top-[45px] z-10 h-[45px] min-h-[45px] w-full flex-row items-center border-b-[0.5px] bg-card py-2 pl-[28px] pr-9 shadow-sm">
          {subheader}
        </div>
      )}
      <CardContent className="flex-grow overflow-auto px-0 pb-1">
        {children}
      </CardContent>
    </div>
  );
};
