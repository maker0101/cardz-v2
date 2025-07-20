import {useQuery} from '@rocicorp/zero/react';
import {createFileRoute, useRouter} from '@tanstack/react-router';
import {CustomButton} from '@/frontend/ui/custom-button';
import {DatabaseType} from 'zero/zero.types';

const cartQuery = (db: DatabaseType, userID: string | undefined) => {
  return db.query.cartItem
    .related('album', album =>
      album.one().related('artist', artist => artist.one()),
    )
    .where('userId', userID ?? '');
};

const useCart = (db: DatabaseType, userID: string | undefined) => {
  const [cartItems, {type}] = useQuery(cartQuery(db, userID));
  return {cartItems, type};
};

export const Route = createFileRoute('/_layout/cart')({
  component: CartPage,
  ssr: false,
  loader: async ({context}) => {
    console.log('preloading cart', context.session);
    const {db, session} = context;
    const userID = session.data?.userID;
    if (userID) {
      cartQuery(db, userID).preload({ttl: '5m'}).cleanup();
    }
  },
});

function CartPage() {
  const {db, session} = useRouter().options.context;
  const {cartItems, type} = useCart(db, session.data?.userID);

  const onRemove = (albumID: string) => {
    db.mutate.cart.remove(albumID);
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
