import {PAGE_ROUTES} from 'shared/routes';

export interface SidebarLinkType {
  name: string;
  href: (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];
  icon: React.JSX.Element;
}
