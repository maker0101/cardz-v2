import {useQuery} from '@rocicorp/zero/react';
import {Zero} from '@rocicorp/zero';
import {createFileRoute, useRouter} from '@tanstack/react-router';
import {Schema} from 'zero/schema';
import {Mutators} from 'zero/mutators';
import {CustomButton} from '@/frontend/ui/custom-button';

const artistQuery = (
  zero: Zero<Schema, Mutators>,
  artistID: string | undefined,
) => {
  return zero.query.artist
    .where('id', artistID ?? '')
    .related('albums', album => album.related('cartItems'))
    .one();
};

const useArtist = (
  zero: Zero<Schema, Mutators>,
  artistID: string | undefined,
) => {
  const [artist, {type}] = useQuery(artistQuery(zero, artistID), {
    ttl: '5m',
    enabled: !!artistID,
  });
  return {artist, type};
};

export const Route = createFileRoute('/_layout/artist')({
  component: ArtistPage,
  ssr: false,
  loaderDeps: ({search}) => ({artistId: search.id}),
  loader: async ({context, deps: {artistId}}) => {
    const {zero} = context;
    console.log('preloading artist', artistId);
    artistQuery(zero, artistId).preload({ttl: '5m'}).cleanup();
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: typeof search.id === 'string' ? search.id : undefined,
    } as {id: string | undefined};
  },
});

function ArtistPage() {
  const {zero, session} = useRouter().options.context;
  const {id} = Route.useSearch();
  const {artist, type} = useArtist(zero, id);

  const handlePress = (albumId: string, isInCart: boolean) => {
    if (isInCart) zero.mutate.cart.remove(albumId);
    else zero.mutate.cart.add({albumID: albumId, addedAt: Date.now()});
  };

  if (!artist && type === 'complete') return <div>Artist not found</div>;
  if (!artist) return null;
  if (!id) return <div>Missing required search parameter id</div>;

  return (
    <>
      <h1 className="text-2xl font-bold text-blue-700">{artist.name}</h1>
      <ul>
        {artist.albums.map(album => (
          <li key={album.id}>
            {album.title} ({album.year}){' '}
            <CartButton
              isInCart={album.cartItems.length > 0}
              isDisabled={!session.data}
              onPress={() => handlePress(album.id, album.cartItems.length > 0)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

const CartButton = ({
  isInCart,
  isDisabled,
  onPress,
}: {
  isInCart: boolean;
  isDisabled: boolean;
  onPress: () => void;
}) => {
  const getMessage = () => {
    if (isDisabled) return 'Login to shop';
    if (isInCart) return 'Remove from cart';
    return 'Add to cart';
  };

  return (
    <CustomButton onPress={onPress} disabled={isDisabled}>
      {getMessage()}
    </CustomButton>
  );
};
