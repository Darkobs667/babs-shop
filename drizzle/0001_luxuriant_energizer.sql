CREATE TABLE "daily_visits" (
	"day" date PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
