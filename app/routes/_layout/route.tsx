import {createFileRoute, Outlet} from '@tanstack/react-router';
import {SessionProvider} from 'app/frontend/providers/session-provider';
import {ZeroProvider} from 'app/frontend/providers/zero-provider';
import {createServerFn} from '@tanstack/react-start';
import {SiteLayout} from 'app/frontend/layouts/site-layout';
import {CookiesProvider} from 'app/frontend/providers/cookies-provider';

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
          <SiteLayout>
            <Outlet />
          </SiteLayout>
        </ZeroProvider>
      </SessionProvider>
    </CookiesProvider>
  );
}
