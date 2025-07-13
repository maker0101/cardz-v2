'use client';

import {Link} from '@tanstack/react-router';
import {Button} from '@/frontend/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/frontend/ui/dropdown-menu';
import {Separator} from '@/frontend/ui/separator';
import {SIDEBAR_LINKS_BOTTOM, SIDEBAR_LINKS_MAIN} from './sidebar.core';
import {SidebarAction} from './sidebar-action.component';
import {SidebarLink} from './sidebar-link.component';
import {SparklesIcon} from 'lucide-react';
import {useDialog} from '@/frontend/hooks/use-dialog';
import {useRouter} from '@tanstack/react-router';

export const Sidebar = () => {
  const {session} = useRouter().options.context;
  const {openDialog, closeDialog} = useDialog();

  const openCommandDialog = () => {
    openDialog('CommandDialog', {
      props: {
        onClose: closeDialog,
      },
    });
  };

  const handleAuthClick = () => {
    if (session.data) {
      session.logout();
    } else {
      session.login();
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="overflow-hidden rounded-lg"
            >
              <img
                src="/placeholder-user.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-lg"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {session.data && (
              <>
                <DropdownMenuItem>{session.data?.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link to={'/settings'}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAuthClick}>
              {session.data ? 'Logout' : 'Login'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col items-center gap-2">
          <SidebarAction
            name="Ask AI"
            icon={<SparklesIcon className="h-5 w-5" />}
            onClick={openCommandDialog}
          />
        </div>
        <Separator className="h-[0.5px]" />
        {SIDEBAR_LINKS_MAIN.map(link => (
          <SidebarLink key={link.name} link={link} />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {SIDEBAR_LINKS_BOTTOM.map(link => (
          <SidebarLink key={link.name} link={link} />
        ))}
      </nav>
    </aside>
  );
};
