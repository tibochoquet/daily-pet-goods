CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"stripe_session_id" text NOT NULL,
	"order_ref" text NOT NULL,
	"email" text NOT NULL,
	"placed_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'betaald' NOT NULL,
	"total_amount" integer,
	"confirmation_email_sent_at" timestamp with time zone,
	"shipping_email_sent_at" timestamp with time zone,
	"review_email_sent_at" timestamp with time zone,
	"sendcloud_parcel_id" text,
	"carrier" text,
	"tracking_number" text,
	"tracking_url" text,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"review_token" text,
	"review_opt_out" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_order_ref_key" ON "orders" USING btree ("order_ref");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_review_token_key" ON "orders" USING btree ("review_token");--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX "orders_review_due_idx" ON "orders" USING btree ("delivered_at","review_email_sent_at");