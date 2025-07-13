import {createFileRoute, Outlet} from '@tanstack/react-router';
import {SessionProvider} from '@/frontend/providers/session-provider';
import {ZeroProvider} from '@/frontend/providers/zero-provider';
import {createServerFn} from '@tanstack/react-start';
import {SiteLayout} from '@/frontend/layouts/site-layout';
import {CookiesProvider} from '@/frontend/providers/cookies-provider';
import {KeyboardShortcutsProvider} from '@/frontend/providers/keyboard-shortcuts-provider';
import {Toaster} from '@/frontend/ui/sonner';

export const getAuthFromHeaders = createServerFn().handler(async () => {});

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
  staleTime: Infinity,
});

function RouteComponent() {
  return (
    <CookiesProvider>
      <SessionProvider>
        <ZeroProvider>
          <KeyboardShortcutsProvider>
            <SiteLayout>
              <Outlet />
              <Toaster />
            </SiteLayout>
          </KeyboardShortcutsProvider>
        </ZeroProvider>
      </SessionProvider>
    </CookiesProvider>
  );
}
