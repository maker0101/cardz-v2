import {
  ANYONE_CAN,
  ExpressionBuilder,
  PermissionsConfig,
  type Row,
  definePermissions,
} from '@rocicorp/zero';
import {schema, type Schema} from './schema.gen';

export {schema, type Schema};

export type Artist = Row<typeof schema.tables.artist>;
export type Album = Row<typeof schema.tables.album>;
export type CartItem = Row<typeof schema.tables.cartItem>;

export type AuthData = {
  // The logged-in user.
  sub: string;
};

const allowIfCartOwner = (
  authData: AuthData,
  {cmp}: ExpressionBuilder<Schema, 'cartItem'>,
) => {
  // You can see a cart item if you are its owner.
  return cmp('userId', authData.sub);
};

export const permissions = definePermissions<{}, Schema>(schema, () => {
  return {
    album: {
      row: {
        select: ANYONE_CAN,
      },
    },
    artist: {
      row: {
        select: ANYONE_CAN,
      },
    },
    cartItem: {
      row: {
        select: [allowIfCartOwner],
      },
    },
    card: {
      row: {
        select: ANYONE_CAN,
      },
    },
    cardStudyState: {
      row: {
        select: ANYONE_CAN,
      },
    },
    label: {
      row: {
        select: ANYONE_CAN,
      },
    },
    cardLabel: {
      row: {
        select: ANYONE_CAN,
      },
    },
    onDemandStudy: {
      row: {
        select: ANYONE_CAN,
      },
    },
    setting: {
      row: {
        select: ANYONE_CAN,
      },
    },
    ui: {
      row: {
        select: ANYONE_CAN,
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
