'use client';

import { Button } from '@/frontend/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/frontend/ui/tooltip';

interface SidebarActionProps {
  name: string;
  icon: React.JSX.Element;
  onClick: () => void;
}

export const SidebarAction = (props: SidebarActionProps) => {
  const { name, icon, onClick } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          onClick={onClick}
          className='w-fit p-2 text-muted-foreground'
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>{name}</TooltipContent>
    </Tooltip>
  );
};
