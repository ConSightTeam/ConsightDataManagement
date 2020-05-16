--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Ubuntu 12.2-2.pgdg18.04+1)
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-2.pgdg18.04+1)

-- Started on 2020-05-16 15:30:46 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16385)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 17407)
-- Name: data_point; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_point (
    id integer NOT NULL,
    location public.geometry NOT NULL,
    data jsonb NOT NULL,
    node uuid NOT NULL,
    inserted_on timestamp without time zone NOT NULL
);


--
-- TOC entry 208 (class 1259 OID 17405)
-- Name: data_point_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_point_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 208
-- Name: data_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_point_id_seq OWNED BY public.data_point.id;


--
-- TOC entry 210 (class 1259 OID 17458)
-- Name: node; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node (
    uuid uuid NOT NULL,
    name text NOT NULL,
    location public.geometry,
    owner integer NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 17468)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username text NOT NULL,
    hashed_password text,
    github_id text,
    google_id text,
    email text NOT NULL,
    is_admin boolean DEFAULT false NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 17466)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 211
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3632 (class 2604 OID 17410)
-- Name: data_point id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_point ALTER COLUMN id SET DEFAULT nextval('public.data_point_id_seq'::regclass);


--
-- TOC entry 3633 (class 2604 OID 17471)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3638 (class 2606 OID 17415)
-- Name: data_point data_point_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_point
    ADD CONSTRAINT data_point_pkey PRIMARY KEY (id);


--
-- TOC entry 3645 (class 2606 OID 17494)
-- Name: user email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 3641 (class 2606 OID 17480)
-- Name: node name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node
    ADD CONSTRAINT name UNIQUE (name);


--
-- TOC entry 3643 (class 2606 OID 17465)
-- Name: node node_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node
    ADD CONSTRAINT node_pkey PRIMARY KEY (uuid);


--
-- TOC entry 3647 (class 2606 OID 17482)
-- Name: user oauth; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT oauth UNIQUE (github_id, google_id);


--
-- TOC entry 3649 (class 2606 OID 17476)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3651 (class 2606 OID 17478)
-- Name: user username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT username UNIQUE (username);


--
-- TOC entry 3639 (class 1259 OID 17451)
-- Name: from_node; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX from_node ON public.data_point USING btree (node);


--
-- TOC entry 3652 (class 2606 OID 17488)
-- Name: data_point node; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_point
    ADD CONSTRAINT node FOREIGN KEY (node) REFERENCES public.node(uuid) NOT VALID;


--
-- TOC entry 3653 (class 2606 OID 17483)
-- Name: node owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node
    ADD CONSTRAINT owner FOREIGN KEY (owner) REFERENCES public."user"(id) NOT VALID;


-- Completed on 2020-05-16 15:30:46 UTC

--
-- PostgreSQL database dump complete
--

