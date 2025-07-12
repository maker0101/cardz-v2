import {useQuery} from '@rocicorp/zero/react';
import {useRouter} from '@tanstack/react-router';
import {Link} from 'app/frontend/ui/link';

export function Cart() {
  const {zero, session} = useRouter().options.context;

  const [items] = useQuery(
    zero.query.cartItem
      .where('userId', session.data?.userID ?? '')
      .orderBy('addedAt', 'asc'),
    {
      ttl: '1m',
    },
  );

  if (!session.data) {
    return null;
  }

  return <Link to="/cart">Cart ({items.length ?? 0})</Link>;
}
