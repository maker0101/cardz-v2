import {useQuery} from '@rocicorp/zero/react';
import {type Schema} from 'zero/schema';
import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import {Link} from 'app/frontend/ui/link';
import {Mutators} from 'zero/mutators';
import {Zero} from 'node_modules/@rocicorp/zero/out/zero-client/src/client/zero';

const limit = 20;

const artistQuery = (z: Zero<Schema, Mutators>, q: string | undefined) => {
  let query = z.query.artist.orderBy('popularity', 'desc').limit(limit);
  if (q) {
    query = query.where('name', 'ILIKE', `%${q}%`);
  }
  return query;
};

export const Route = createFileRoute('/_layout/')({
  component: HomePage,
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: typeof search.q === 'string' ? search.q : undefined,
    } as {q?: string | undefined};
  },
  loaderDeps: ({search}) => ({q: search.q}),
  loader: async ({context, deps: {q}}) => {
    const {zero} = context;
    console.log('preloading artists', q);
    artistQuery(zero, q).preload({ttl: '5m'}).cleanup();
  },
});

function HomePage() {
  const router = useRouter();
  const {zero} = router.options.context;

  const [search, setSearch] = useState('');
  const qs = Route.useSearch();
  const searchParam = qs.q ?? '';
  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  // No need to cache the queries for each individual keystroke. Just
  // cache them when the user has paused, which we know by when the
  // QS matches because we already debounce the QS.
  const ttl = search === searchParam ? '5m' : 'none';
  const [artists, {type}] = useQuery(artistQuery(zero, search), {
    ttl,
  });

  // Safari has a limit on how fast you can change QS. Anyway it makes no sense
  // to have a history entry for each keystroke anyway so even without this we'd
  // have to have some URL entries be replace and some not. Easier to just skip
  // history entries until user pauses.
  const setSearchParam = useDebouncedCallback((text: string) => {
    router.navigate({
      to: '/',
      search: {
        q: text,
      },
    });
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchParam(e.target.value);
  };

  // If the typing has settled, use the default preload behavior.
  // Otherwise, don't preload.
  const preload = search === searchParam ? undefined : false;

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3 style={{margin: '1em 0 0.2em 0'}}>
          Search 85,000 artists from the 1990s...
        </h3>
        <input
          type="text"
          value={search}
          onChange={onSearchChange}
          style={{fontSize: '125%'}}
        />
      </div>
      <ul style={{listStyle: 'none', padding: 0}}>
        {artists.map(artist => (
          <li key={artist.id} style={{marginBottom: '0.2em'}}>
            <Link to="/artist" search={{id: artist.id}} preload={preload}>
              {artist.name}
            </Link>
          </li>
        ))}
        {type === 'unknown' && artists.length < limit && <div>Loading...</div>}
      </ul>
    </>
  );
}
