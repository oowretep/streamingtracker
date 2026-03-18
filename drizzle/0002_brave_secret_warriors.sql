CREATE TABLE "watchlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title_id" integer NOT NULL,
	"title_name" text NOT NULL,
	"title_year" integer,
	"title_type" text,
	"poster" text,
	"list_type" text NOT NULL,
	"watched" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;