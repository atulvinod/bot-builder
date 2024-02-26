DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('queued', 'inprogress', 'created', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bot_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"created_by_user_id" integer NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'queued',
	"spec" json,
	"is_deleted" boolean DEFAULT false
);
