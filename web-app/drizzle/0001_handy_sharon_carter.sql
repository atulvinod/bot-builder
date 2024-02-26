CREATE TABLE IF NOT EXISTS "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"bot_id" integer NOT NULL
);
