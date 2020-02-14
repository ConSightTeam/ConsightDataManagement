

-- Table: public.data_point

-- DROP TABLE public.data_point;

CREATE TABLE public.data_point
(
    id integer NOT NULL DEFAULT nextval('data_point_id_seq'::regclass),
    location geometry NOT NULL,
    data jsonb NOT NULL,
    inserted_on timestamp without time zone NOT NULL,
    node uuid NOT NULL,
    CONSTRAINT data_point_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.data_point
    OWNER to postgres;

-- Table: public.node

-- DROP TABLE public.node;

CREATE TABLE public.node
(
    uuid uuid NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    location geometry,
    CONSTRAINT node_pkey PRIMARY KEY (uuid)
)

TABLESPACE pg_default;

ALTER TABLE public.node
    OWNER to postgres;