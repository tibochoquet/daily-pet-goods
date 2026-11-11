-- Diep samenvoegen van twee JSONB-objecten, voor de productselectietool.
--
-- Met de hand geschreven, want drizzle-kit genereert geen functies.
--
-- Waarom dit in de database zit en niet in de API: de driver van dit
-- project (neon-http) kent geen transacties, dus lezen-en-dan-schrijven
-- vanuit de applicatie laat een gat waarin de ander kan schrijven. Eén
-- INSERT ... ON CONFLICT DO UPDATE is wel atomair, en dan moet het
-- samenvoegen hier gebeuren.
--
-- `||` van Postgres voegt alleen de bovenste laag samen; deze functie
-- gaat recursief naar beneden, zodat twee mensen die tegelijk aan
-- hetzelfde product werken elkaars velden niet wissen. Niet-objecten
-- (getallen, tekst, arrays) vervangen, precies zoals de tool altijd al
-- deed.
CREATE OR REPLACE FUNCTION jsonb_diepe_merge(a jsonb, b jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN a IS NULL THEN b
    WHEN b IS NULL THEN a
    WHEN jsonb_typeof(a) = 'object' AND jsonb_typeof(b) = 'object' THEN
      COALESCE(
        (SELECT jsonb_object_agg(
                  sleutel,
                  CASE
                    WHEN a ? sleutel AND b ? sleutel THEN jsonb_diepe_merge(a -> sleutel, b -> sleutel)
                    WHEN b ? sleutel THEN b -> sleutel
                    ELSE a -> sleutel
                  END)
         FROM (
           SELECT jsonb_object_keys(a) AS sleutel
           UNION
           SELECT jsonb_object_keys(b)
         ) AS sleutels),
        '{}'::jsonb)
    ELSE b
  END
$$;
