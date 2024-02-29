DO $$ BEGIN
 CREATE TYPE "platform" AS ENUM('uplay', 'xbl', 'psn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(52) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" text,
	"platform" "platform" DEFAULT 'uplay' NOT NULL,
	"level" jsonb,
	"aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary" jsonb,
	"trends" jsonb,
	"operators" jsonb,
	"weapons" jsonb,
	"maps" jsonb,
	"ranked" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "similar" (
	"id" uuid NOT NULL,
	"similar_id" uuid NOT NULL,
	CONSTRAINT "pk_similar_users" PRIMARY KEY("id","similar_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "similar_profile_idx" ON "similar" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "similar" ADD CONSTRAINT "similar_id_players_id_fk" FOREIGN KEY ("id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "similar" ADD CONSTRAINT "similar_similar_id_players_id_fk" FOREIGN KEY ("similar_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION compute_alias_names(aliases JSONB) RETURNS text AS $$
DECLARE
    alias_element JSONB;
    combined_names text := '';
BEGIN
    -- Loop through aliases array
    FOR alias_element IN SELECT * FROM jsonb_array_elements(aliases)
    LOOP
        combined_names := combined_names || ' ' || COALESCE(alias_element->>'name', '');
    END LOOP;

    RETURN TRIM(combined_names);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "players" ADD COLUMN "alias_fts" text GENERATED ALWAYS AS (compute_alias_names("aliases")) STORED;
EXCEPTION
	WHEN duplicate_column THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX pgroonga_alias_search_text_index ON "players" USING pgroonga ("alias_fts");
--> statement-breakpoint
