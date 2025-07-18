/* eslint-disable */
/* tslint:disable */
// noinspection JSUnusedGlobalSymbols
// biome-ignore-all
/*
 * ------------------------------------------------------------
 * ## This file was automatically generated by drizzle-zero. ##
 * ## Any changes you make to this file will be overwritten. ##
 * ##                                                        ##
 * ## Additionally, you should also exclude this file from   ##
 * ## your linter and/or formatter to prevent it from being  ##
 * ## checked or modified.                                   ##
 * ##                                                        ##
 * ## SOURCE: https://github.com/0xcadams/drizzle-zero        ##
 * ------------------------------------------------------------
 */

import type { DrizzleToZeroSchema, ZeroCustomType } from "drizzle-zero";
import type * as drizzleSchema from "../backend/db/schema";

type ZeroSchema = DrizzleToZeroSchema<typeof drizzleSchema>;

/**
 * The Zero schema object.
 * This type is auto-generated from your Drizzle schema definition.
 */
export const schema = {
  tables: {
    account: {
      name: "account",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "id"
          >,
        },
        accountId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "accountId"
          >,
          serverName: "account_id",
        },
        providerId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "providerId"
          >,
          serverName: "provider_id",
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "userId"
          >,
          serverName: "user_id",
        },
        accessToken: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "accessToken"
          >,
          serverName: "access_token",
        },
        refreshToken: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "refreshToken"
          >,
          serverName: "refresh_token",
        },
        idToken: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "idToken"
          >,
          serverName: "id_token",
        },
        accessTokenExpiresAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "accessTokenExpiresAt"
          >,
          serverName: "access_token_expires_at",
        },
        refreshTokenExpiresAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "refreshTokenExpiresAt"
          >,
          serverName: "refresh_token_expires_at",
        },
        scope: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "scope"
          >,
        },
        password: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "password"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "account",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
      },
      primaryKey: ["id"],
    },
    album: {
      name: "album",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "album",
            "id"
          >,
        },
        artistId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "album",
            "artistId"
          >,
          serverName: "artist_id",
        },
        title: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "album",
            "title"
          >,
        },
        year: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "album",
            "year"
          >,
        },
      },
      primaryKey: ["id"],
    },
    artist: {
      name: "artist",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "id"
          >,
        },
        name: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "name"
          >,
        },
        sortName: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "sortName"
          >,
          serverName: "sort_name",
        },
        type: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "type"
          >,
        },
        beginDate: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "beginDate"
          >,
          serverName: "begin_date",
        },
        endDate: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "endDate"
          >,
          serverName: "end_date",
        },
        popularity: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "artist",
            "popularity"
          >,
        },
      },
      primaryKey: ["id"],
    },
    card: {
      name: "card",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "id"
          >,
        },
        question: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "question"
          >,
        },
        answer: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "answer"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "card",
            "userId"
          >,
          serverName: "user_id",
        },
      },
      primaryKey: ["id"],
    },
    cardLabel: {
      name: "cardLabel",
      columns: {
        cardId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardLabel",
            "cardId"
          >,
          serverName: "card_id",
        },
        labelId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardLabel",
            "labelId"
          >,
          serverName: "label_id",
        },
      },
      primaryKey: ["cardId", "labelId"],
      serverName: "card_label",
    },
    cardStudyState: {
      name: "cardStudyState",
      columns: {
        cardId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "cardId"
          >,
          serverName: "card_id",
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
        lastStudiedAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "lastStudiedAt"
          >,
          serverName: "last_studied_at",
        },
        nextStudiedAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "nextStudiedAt"
          >,
          serverName: "next_studied_at",
        },
        box: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "box"
          >,
        },
        interval: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "interval"
          >,
        },
        repetitions: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "repetitions"
          >,
        },
        easeFactor: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "easeFactor"
          >,
          serverName: "ease_factor",
        },
        difficulty: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "difficulty"
          >,
        },
        stability: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cardStudyState",
            "stability"
          >,
        },
      },
      primaryKey: ["cardId"],
      serverName: "card_study_state",
    },
    cartItem: {
      name: "cartItem",
      columns: {
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cartItem",
            "userId"
          >,
          serverName: "user_id",
        },
        albumId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cartItem",
            "albumId"
          >,
          serverName: "album_id",
        },
        addedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "cartItem",
            "addedAt"
          >,
          serverName: "added_at",
        },
      },
      primaryKey: ["userId", "albumId"],
      serverName: "cart_item",
    },
    jwks: {
      name: "jwks",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "jwks",
            "id"
          >,
        },
        publicKey: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "jwks",
            "publicKey"
          >,
          serverName: "public_key",
        },
        privateKey: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "jwks",
            "privateKey"
          >,
          serverName: "private_key",
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "jwks",
            "createdAt"
          >,
          serverName: "created_at",
        },
      },
      primaryKey: ["id"],
    },
    label: {
      name: "label",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "label",
            "id"
          >,
        },
        name: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "label",
            "name"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "label",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "label",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "label",
            "userId"
          >,
          serverName: "user_id",
        },
      },
      primaryKey: ["id"],
    },
    onDemandStudy: {
      name: "onDemandStudy",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudy",
            "id"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudy",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudy",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudy",
            "userId"
          >,
          serverName: "user_id",
        },
      },
      primaryKey: ["id"],
      serverName: "on_demand_study",
    },
    onDemandStudyCard: {
      name: "onDemandStudyCard",
      columns: {
        studyId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudyCard",
            "studyId"
          >,
          serverName: "study_id",
        },
        cardId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudyCard",
            "cardId"
          >,
          serverName: "card_id",
        },
        type: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "onDemandStudyCard",
            "type"
          >,
        },
      },
      primaryKey: ["studyId", "cardId"],
      serverName: "on_demand_study_card",
    },
    session: {
      name: "session",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "id"
          >,
        },
        expiresAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "expiresAt"
          >,
          serverName: "expires_at",
        },
        token: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "token"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
        ipAddress: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "ipAddress"
          >,
          serverName: "ip_address",
        },
        userAgent: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "userAgent"
          >,
          serverName: "user_agent",
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "session",
            "userId"
          >,
          serverName: "user_id",
        },
      },
      primaryKey: ["id"],
    },
    setting: {
      name: "setting",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "setting",
            "id"
          >,
        },
        algorithm: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "setting",
            "algorithm"
          >,
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "setting",
            "userId"
          >,
          serverName: "user_id",
        },
      },
      primaryKey: ["id"],
    },
    ui: {
      name: "ui",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<ZeroSchema, "ui", "id">,
        },
        userId: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "ui",
            "userId"
          >,
          serverName: "user_id",
        },
        studyMode: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "ui",
            "studyMode"
          >,
          serverName: "study_mode",
        },
        createdAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "ui",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "ui",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
      },
      primaryKey: ["id"],
    },
    user: {
      name: "user",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "id"
          >,
        },
        name: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "name"
          >,
        },
        email: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "email"
          >,
        },
        emailVerified: {
          type: "boolean",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "emailVerified"
          >,
          serverName: "email_verified",
        },
        image: {
          type: "string",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "image"
          >,
        },
        createdAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "user",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
      },
      primaryKey: ["id"],
    },
    verification: {
      name: "verification",
      columns: {
        id: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "id"
          >,
        },
        identifier: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "identifier"
          >,
        },
        value: {
          type: "string",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "value"
          >,
        },
        expiresAt: {
          type: "number",
          optional: false,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "expiresAt"
          >,
          serverName: "expires_at",
        },
        createdAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "createdAt"
          >,
          serverName: "created_at",
        },
        updatedAt: {
          type: "number",
          optional: true,
          customType: null as unknown as ZeroCustomType<
            ZeroSchema,
            "verification",
            "updatedAt"
          >,
          serverName: "updated_at",
        },
      },
      primaryKey: ["id"],
    },
  },
  relationships: {
    album: {
      artist: [
        {
          sourceField: ["artistId"],
          destField: ["id"],
          destSchema: "artist",
          cardinality: "one",
        },
      ],
      cartItems: [
        {
          sourceField: ["id"],
          destField: ["albumId"],
          destSchema: "cartItem",
          cardinality: "many",
        },
      ],
    },
    artist: {
      albums: [
        {
          sourceField: ["id"],
          destField: ["artistId"],
          destSchema: "album",
          cardinality: "many",
        },
      ],
    },
    cardLabel: {
      card: [
        {
          sourceField: ["cardId"],
          destField: ["id"],
          destSchema: "card",
          cardinality: "one",
        },
      ],
      label: [
        {
          sourceField: ["labelId"],
          destField: ["id"],
          destSchema: "label",
          cardinality: "one",
        },
      ],
    },
    card: {
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
      cardLabels: [
        {
          sourceField: ["id"],
          destField: ["cardId"],
          destSchema: "cardLabel",
          cardinality: "many",
        },
      ],
      cardStudyState: [
        {
          sourceField: ["id"],
          destField: ["cardId"],
          destSchema: "cardStudyState",
          cardinality: "one",
        },
      ],
      onDemandStudyCards: [
        {
          sourceField: ["id"],
          destField: ["cardId"],
          destSchema: "onDemandStudyCard",
          cardinality: "many",
        },
      ],
    },
    cardStudyState: {
      card: [
        {
          sourceField: ["cardId"],
          destField: ["id"],
          destSchema: "card",
          cardinality: "one",
        },
      ],
    },
    cartItem: {
      album: [
        {
          sourceField: ["albumId"],
          destField: ["id"],
          destSchema: "album",
          cardinality: "one",
        },
      ],
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
    },
    label: {
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
      cardLabels: [
        {
          sourceField: ["id"],
          destField: ["labelId"],
          destSchema: "cardLabel",
          cardinality: "many",
        },
      ],
    },
    onDemandStudyCard: {
      onDemandStudy: [
        {
          sourceField: ["studyId"],
          destField: ["id"],
          destSchema: "onDemandStudy",
          cardinality: "one",
        },
      ],
      card: [
        {
          sourceField: ["cardId"],
          destField: ["id"],
          destSchema: "card",
          cardinality: "one",
        },
      ],
    },
    onDemandStudy: {
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
      onDemandStudyCards: [
        {
          sourceField: ["id"],
          destField: ["studyId"],
          destSchema: "onDemandStudyCard",
          cardinality: "many",
        },
      ],
    },
    setting: {
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
    },
    ui: {
      user: [
        {
          sourceField: ["userId"],
          destField: ["id"],
          destSchema: "user",
          cardinality: "one",
        },
      ],
    },
    user: {
      cartItems: [
        {
          sourceField: ["id"],
          destField: ["userId"],
          destSchema: "cartItem",
          cardinality: "many",
        },
      ],
    },
  },
} as const;

/**
 * Represents the Zero schema type.
 * This type is auto-generated from your Drizzle schema definition.
 */
export type Schema = typeof schema;
