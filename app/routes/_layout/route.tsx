import {createFileRoute, Outlet, useRouter} from '@tanstack/react-router';
import {SessionProvider} from '@/frontend/providers/session-provider';
import {ZeroProvider} from '@/frontend/providers/zero-provider';
import {createServerFn} from '@tanstack/react-start';
import {CookiesProvider} from '@/frontend/providers/cookies-provider';
import {KeyboardShortcutsProvider} from '@/frontend/providers/keyboard-shortcuts-provider';
import {Toaster} from '@/frontend/ui/sonner';
import {AppLayout} from '@/frontend/layouts/app-layout';
import {ThemeProvider} from '@/frontend/providers/theme-provider';
import {DialogsProvider} from '@/frontend/providers/dialogs-provider';

export const getAuthFromHeaders = createServerFn().handler(async () => {});

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
  staleTime: Infinity,
});

function RouteComponent() {
  const {zero} = useRouter().options.context;
  return (
    <CookiesProvider>
      <SessionProvider>
        <ZeroProvider>
          <KeyboardShortcutsProvider z={zero}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AppLayout>
                <Outlet />
                <Toaster />
                <DialogsProvider />
              </AppLayout>
            </ThemeProvider>
          </KeyboardShortcutsProvider>
        </ZeroProvider>
      </SessionProvider>
    </CookiesProvider>
  );
}
