import {LibraryBigIcon, LineChart, PlayIcon} from 'lucide-react';
import {SidebarLinkType} from './sidebar.types';
import {PAGE_ROUTES} from 'shared/routes';

export const SIDEBAR_LINKS_MAIN: SidebarLinkType[] = [
  {
    name: 'Study',
    href: PAGE_ROUTES.Study,
    icon: <PlayIcon className="h-5 w-5" />,
  },
  {
    name: 'Cards',
    href: PAGE_ROUTES.Cards,
    icon: <LibraryBigIcon className="h-5 w-5" />,
  },
  {
    name: 'Progress',
    href: PAGE_ROUTES.Progress,
    icon: <LineChart className="h-5 w-5" />,
  },
];

export const SIDEBAR_LINKS_BOTTOM: SidebarLinkType[] = [];
