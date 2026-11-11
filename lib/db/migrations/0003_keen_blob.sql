CREATE TABLE "selectie_docs" (
	"collection" text NOT NULL,
	"doc_id" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "selectie_docs_collection_doc_id_pk" PRIMARY KEY("collection","doc_id")
);
