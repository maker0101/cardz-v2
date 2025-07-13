'use client';

import {SidebarLinkType} from './sidebar.types';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/frontend/ui/tooltip';
import {cn} from '@/frontend/lib/utils';
import {Link} from '@tanstack/react-router';
import {useLocation} from '@tanstack/react-router';

interface SidebarLinkProps {
  link: SidebarLinkType;
}

export const SidebarLink = (props: SidebarLinkProps) => {
  const {link} = props;
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname.includes(href);
  };

  return (
    <Tooltip key={link.name}>
      <TooltipTrigger asChild>
        <Link
          to={link.href}
          className={cn(
            isActive(link.href)
              ? 'text-accent-foreground'
              : 'text-muted-foreground',
            'flex h-9 w-9 cursor-default items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
          )}
        >
          {link.icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{link.name}</TooltipContent>
    </Tooltip>
  );
};
