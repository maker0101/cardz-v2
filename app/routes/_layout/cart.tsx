import {useQuery} from '@rocicorp/zero/react';
import {createFileRoute, useRouter} from '@tanstack/react-router';
import {Mutators} from 'zero/mutators';
import {Schema} from 'zero/schema';
import {CustomButton} from '@/frontend/ui/custom-button';
import {Zero} from '@rocicorp/zero';

const cartQuery = (z: Zero<Schema, Mutators>, userID: string | undefined) => {
  return z.query.cartItem
    .related('album', album =>
      album.one().related('artist', artist => artist.one()),
    )
    .where('userId', userID ?? '');
};

const useCart = (zero: Zero<Schema, Mutators>, userID: string | undefined) => {
  const [cartItems, {type}] = useQuery(cartQuery(zero, userID));
  return {cartItems, type};
};

export const Route = createFileRoute('/_layout/cart')({
  component: CartPage,
  ssr: false,
  loader: async ({context}) => {
    console.log('preloading cart', context.session);
    const {zero, session} = context;
    const userID = session.data?.userID;
    if (userID) {
      cartQuery(zero, userID).preload({ttl: '5m'}).cleanup();
    }
  },
});

function CartPage() {
  const {zero, session} = useRouter().options.context;
  const {cartItems, type} = useCart(zero, session.data?.userID);

  const onRemove = (albumID: string) => {
    zero.mutate.cart.remove(albumID);
  };

  if (!session.data) return <div>Login to view cart</div>;
  if (type === 'complete' && cartItems.length === 0)
    return <div>No items in cart 😢</div>;

  return (
    <>
      <h1>Cart</h1>
      <table cellPadding={0} cellSpacing={0} border={0} style={{width: 500}}>
        <tbody>
          {cartItems.map(item =>
            item.album ? (
              <tr key={item.albumId}>
                <td>
                  {item.album?.title} ({item.album?.artist?.name})
                </td>
                <td style={{paddingLeft: '1em'}}>
                  <CustomButton onPress={() => onRemove(item.albumId)}>
                    Remove
                  </CustomButton>
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </>
  );
}
