CREATE TYPE "public"."algorithm_enum" AS ENUM('sm2', 'sm18', 'hlr', 'leitner');--> statement-breakpoint
CREATE TYPE "public"."study_card_type_enum" AS ENUM('queue', 'history');--> statement-breakpoint
CREATE TYPE "public"."study_mode_enum" AS ENUM('due', 'onDemand');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "album" (
	"id" varchar PRIMARY KEY NOT NULL,
	"artist_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE "artist" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"sort_name" varchar NOT NULL,
	"type" varchar,
	"begin_date" varchar,
	"end_date" varchar,
	"popularity" integer
);
--> statement-breakpoint
CREATE TABLE "card" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_label" (
	"card_id" text NOT NULL,
	"label_id" text NOT NULL,
	CONSTRAINT "card_label_card_id_label_id_pk" PRIMARY KEY("card_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "card_study_state" (
	"card_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_studied_at" timestamp,
	"next_studied_at" timestamp,
	"box" text,
	"interval" text,
	"repetitions" text,
	"ease_factor" text,
	"difficulty" text,
	"stability" text
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"user_id" varchar NOT NULL,
	"album_id" varchar NOT NULL,
	"added_at" timestamp NOT NULL,
	CONSTRAINT "cart_item_user_id_album_id_pk" PRIMARY KEY("user_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "label" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "on_demand_study" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "on_demand_study_card" (
	"study_id" text NOT NULL,
	"card_id" text NOT NULL,
	"type" "study_card_type_enum" NOT NULL,
	CONSTRAINT "on_demand_study_card_study_id_card_id_pk" PRIMARY KEY("study_id","card_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "setting" (
	"id" text PRIMARY KEY NOT NULL,
	"algorithm" "algorithm_enum" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ui" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"study_mode" "study_mode_enum" NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_study_state" ADD CONSTRAINT "card_study_state_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "on_demand_study" ADD CONSTRAINT "on_demand_study_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "on_demand_study_card" ADD CONSTRAINT "on_demand_study_card_study_id_on_demand_study_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."on_demand_study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "on_demand_study_card" ADD CONSTRAINT "on_demand_study_card_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ui" ADD CONSTRAINT "ui_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "album_artist_id_idx" ON "album" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "artist_name_idx" ON "artist" USING btree ("name");--> statement-breakpoint
CREATE INDEX "artist_popularity_idx" ON "artist" USING btree ("popularity");--> statement-breakpoint
CREATE INDEX "card_user_id_idx" ON "card" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "card_question_idx" ON "card" USING btree ("question");--> statement-breakpoint
CREATE INDEX "card_label_card_id_idx" ON "card_label" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_label_label_id_idx" ON "card_label" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "card_study_state_next_idx" ON "card_study_state" USING btree ("next_studied_at");--> statement-breakpoint
CREATE INDEX "cart_item_user_id_idx" ON "cart_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_item_album_id_idx" ON "cart_item" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "label_user_id_idx" ON "label" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "label_name_idx" ON "label" USING btree ("name");--> statement-breakpoint
CREATE INDEX "on_demand_study_user_id_idx" ON "on_demand_study" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "on_demand_study_card_study_id_idx" ON "on_demand_study_card" USING btree ("study_id");--> statement-breakpoint
CREATE INDEX "on_demand_study_card_card_id_idx" ON "on_demand_study_card" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "setting_user_id_idx" ON "setting" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ui_user_id_idx" ON "ui" USING btree ("user_id");