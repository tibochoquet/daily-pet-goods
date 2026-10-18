CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"order_ref" text,
	"product_slug" text NOT NULL,
	"product_name" text NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL,
	"name" text NOT NULL,
	"photo_url" text,
	"photo_consent" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_order_product_key" ON "reviews" USING btree ("order_id","product_slug");--> statement-breakpoint
CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_slug","status");