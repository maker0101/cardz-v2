import {
  index,
  integer,
  pgTable,
  varchar,
  timestamp,
  primaryKey,
  boolean,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const jwks = pgTable('jwks', {
  id: text('id').primaryKey(),
  publicKey: text('public_key').notNull(),
  privateKey: text('private_key').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const artist = pgTable(
  'artist',
  {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    sortName: varchar('sort_name').notNull(),
    type: varchar(),
    beginDate: varchar('begin_date'),
    endDate: varchar('end_date'),
    popularity: integer(),
  },
  table => [
    index('artist_name_idx').on(table.name),
    index('artist_popularity_idx').on(table.popularity),
  ],
);

export const album = pgTable(
  'album',
  {
    id: varchar().primaryKey(),
    artistId: varchar('artist_id')
      .notNull()
      .references(() => artist.id),
    title: varchar().notNull(),
    year: integer(),
  },
  table => [index('album_artist_id_idx').on(table.artistId)],
);

export const cartItem = pgTable(
  'cart_item',
  {
    userId: varchar('user_id')
      .notNull()
      .references(() => user.id),
    albumId: varchar('album_id')
      .notNull()
      .references(() => album.id),
    addedAt: timestamp('added_at').notNull(),
  },
  table => [
    primaryKey({columns: [table.userId, table.albumId]}),
    index('cart_item_user_id_idx').on(table.userId),
    index('cart_item_album_id_idx').on(table.albumId),
  ],
);

export const userRelations = relations(user, ({many}) => ({
  cartItems: many(cartItem),
}));

export const artistRelations = relations(artist, ({many}) => ({
  albums: many(album),
}));

export const albumRelations = relations(album, ({one, many}) => ({
  artist: one(artist, {
    fields: [album.artistId],
    references: [artist.id],
  }),
  cartItems: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({one}) => ({
  album: one(album, {
    fields: [cartItem.albumId],
    references: [album.id],
  }),
  user: one(user, {
    fields: [cartItem.userId],
    references: [user.id],
  }),
}));

// -------------- Added enums --------------
export const algorithmEnum = pgEnum('algorithm_enum', [
  'sm2',
  'sm18',
  'hlr',
  'leitner',
]);

export const studyCardTypeEnum = pgEnum('study_card_type_enum', [
  'queue',
  'history',
]);

export const studyModeEnum = pgEnum('study_mode_enum', ['due', 'onDemand']);

// -------------- Added tables --------------

export const label = pgTable(
  'label',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
  },
  table => [
    index('label_user_id_idx').on(table.userId),
    index('label_name_idx').on(table.name),
  ],
);

export const card = pgTable(
  'card',
  {
    id: text('id').primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: timestamp('created_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
  },
  table => [
    index('card_user_id_idx').on(table.userId),
    index('card_question_idx').on(table.question),
  ],
);

export const cardStudyState = pgTable(
  'card_study_state',
  {
    cardId: text('card_id')
      .primaryKey()
      .references(() => card.id, {onDelete: 'cascade'}),
    createdAt: timestamp('created_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    lastStudiedAt: timestamp('last_studied_at'),
    nextStudiedAt: timestamp('next_studied_at'),
    box: text('box'),
    interval: text('interval'),
    repetitions: text('repetitions'),
    easeFactor: text('ease_factor'),
    difficulty: text('difficulty'),
    stability: text('stability'),
  },
  table => [index('card_study_state_next_idx').on(table.nextStudiedAt)],
);

export const setting = pgTable(
  'setting',
  {
    id: text('id').primaryKey(),
    algorithm: algorithmEnum('algorithm').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
  },
  table => [index('setting_user_id_idx').on(table.userId)],
);

export const onDemandStudy = pgTable(
  'on_demand_study',
  {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
  },
  table => [index('on_demand_study_user_id_idx').on(table.userId)],
);

export const onDemandStudyCard = pgTable(
  'on_demand_study_card',
  {
    studyId: text('study_id')
      .notNull()
      .references(() => onDemandStudy.id, {onDelete: 'cascade'}),
    cardId: text('card_id')
      .notNull()
      .references(() => card.id, {onDelete: 'cascade'}),
    type: studyCardTypeEnum('type').notNull(),
  },
  table => [
    primaryKey({columns: [table.studyId, table.cardId]}),
    index('on_demand_study_card_study_id_idx').on(table.studyId),
    index('on_demand_study_card_card_id_idx').on(table.cardId),
  ],
);

export const cardLabel = pgTable(
  'card_label',
  {
    cardId: text('card_id')
      .notNull()
      .references(() => card.id, {onDelete: 'cascade'}),
    labelId: text('label_id')
      .notNull()
      .references(() => label.id, {onDelete: 'cascade'}),
  },
  table => [
    primaryKey({columns: [table.cardId, table.labelId]}),
    index('card_label_card_id_idx').on(table.cardId),
    index('card_label_label_id_idx').on(table.labelId),
  ],
);

export const ui = pgTable(
  'ui',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
    studyMode: studyModeEnum('study_mode').notNull(),
    createdAt: timestamp('created_at').$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp('updated_at').$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
  },
  table => [index('ui_user_id_idx').on(table.userId)],
);

// -------------- Added relations --------------

export const labelRelations = relations(label, ({one, many}) => ({
  user: one(user, {
    fields: [label.userId],
    references: [user.id],
  }),
  cardLabels: many(cardLabel),
}));

export const cardRelations = relations(card, ({one, many}) => ({
  user: one(user, {
    fields: [card.userId],
    references: [user.id],
  }),
  cardLabels: many(cardLabel),
  cardStudyState: one(cardStudyState, {
    fields: [card.id],
    references: [cardStudyState.cardId],
  }),
  onDemandStudyCards: many(onDemandStudyCard),
}));

export const cardStudyStateRelations = relations(cardStudyState, ({one}) => ({
  card: one(card, {
    fields: [cardStudyState.cardId],
    references: [card.id],
  }),
}));

export const settingRelations = relations(setting, ({one}) => ({
  user: one(user, {
    fields: [setting.userId],
    references: [user.id],
  }),
}));

export const onDemandStudyRelations = relations(
  onDemandStudy,
  ({one, many}) => ({
    user: one(user, {
      fields: [onDemandStudy.userId],
      references: [user.id],
    }),
    onDemandStudyCards: many(onDemandStudyCard),
  }),
);

export const onDemandStudyCardRelations = relations(
  onDemandStudyCard,
  ({one}) => ({
    onDemandStudy: one(onDemandStudy, {
      fields: [onDemandStudyCard.studyId],
      references: [onDemandStudy.id],
    }),
    card: one(card, {
      fields: [onDemandStudyCard.cardId],
      references: [card.id],
    }),
  }),
);

export const cardLabelRelations = relations(cardLabel, ({one}) => ({
  card: one(card, {
    fields: [cardLabel.cardId],
    references: [card.id],
  }),
  label: one(label, {
    fields: [cardLabel.labelId],
    references: [label.id],
  }),
}));

export const uiRelations = relations(ui, ({one}) => ({
  user: one(user, {
    fields: [ui.userId],
    references: [user.id],
  }),
}));
