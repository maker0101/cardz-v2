import {createFileRoute, Outlet} from '@tanstack/react-router';
import {SessionProvider} from '@/frontend/providers/session-provider';
import {ZeroProvider} from '@/frontend/providers/zero-provider';
import {createServerFn} from '@tanstack/react-start';
import {CookiesProvider} from '@/frontend/providers/cookies-provider';
import {KeyboardShortcutsProvider} from '@/frontend/providers/keyboard-shortcuts-provider';
import {Toaster} from '@/frontend/ui/sonner';
import {AppLayout} from '@/frontend/layouts/app-layout';
import {ThemeProvider} from '@/frontend/providers/theme-provider';

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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AppLayout>
                <Outlet />
                <Toaster />
              </AppLayout>
            </ThemeProvider>
          </KeyboardShortcutsProvider>
        </ZeroProvider>
      </SessionProvider>
    </CookiesProvider>
  );
}
