import {createRouter as createTanStackRouter} from '@tanstack/react-router';
import {routeTree} from 'app/routeTree.gen';
import {SessionContextType} from 'app/frontend/providers/session-provider';
import {DatabaseType} from 'zero/zero.types';

export interface RouterContext {
  db: DatabaseType;
  session: SessionContextType;
}

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'viewport',
    // It is fine to call Zero multiple times for same query, Zero dedupes the
    // queries internally.
    defaultPreloadStaleTime: 0,
    // We don't want TanStack skipping any calls to us. We want to be asked to
    // preload every link. This is fine because Zero has its own internal
    // deduping and caching.
    defaultPreloadGcTime: 0,
    context: {
      db: undefined as unknown as DatabaseType, // populated in ZeroInit,
      session: undefined as unknown as SessionContextType, // populated in SessionProvider
    } satisfies RouterContext,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
