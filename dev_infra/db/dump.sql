--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.0 (Debian 16.0-1.pgdg120+1)

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
-- Name: bots; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA bots;


ALTER SCHEMA bots OWNER TO postgres;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status AS ENUM (
    'queued',
    'inprogress',
    'created',
    'failed',
    'failed_queue_push'
);


ALTER TYPE public.status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: bot_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bot_details (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text NOT NULL,
    created_by_user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    status public.status DEFAULT 'queued'::public.status,
    spec json,
    is_deleted boolean DEFAULT false,
    avatar_image text,
    assets_id text
);


ALTER TABLE public.bot_details OWNER TO postgres;

--
-- Name: bot_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bot_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bot_details_id_seq OWNER TO postgres;

--
-- Name: bot_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bot_details_id_seq OWNED BY public.bot_details.id;


--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sessions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    session_id text NOT NULL,
    bot_id integer NOT NULL
);


ALTER TABLE public.chat_sessions OWNER TO postgres;

--
-- Name: chat_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_sessions_id_seq OWNER TO postgres;

--
-- Name: chat_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_sessions_id_seq OWNED BY public.chat_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    picture text,
    email text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: bot_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bot_details ALTER COLUMN id SET DEFAULT nextval('public.bot_details_id_seq'::regclass);


--
-- Name: chat_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions ALTER COLUMN id SET DEFAULT nextval('public.chat_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	fb1c050bdd8918c71f5a0683c572693957524d39e6e2f06088ea05f8b5840cef	1708238804787
2	a3da68cf9b4465336258971a5c781a01603e7d75548865420efff212787ae5bf	1708241813060
3	8eb28cc398355395ac1309fa5d44f3d6fcc9ad07aaa46f98820f9a8ba33dbc53	1708241967704
4	dfb7a0319873625c91107c2b8844ad8dda5ff9232af518aa7ab880c9c4686bbe	1708249489819
5	640cf60246e53784264dc6061408afd685742265484481f6cd3c9f477dc90f1c	1708251400085
6	515e5e480ad45d4b8c808bc7bac610ce7b35a86fa3479fce37f2a021de45c546	1708251462893
7	ad74082bce548a0b4b05592babccae1bf917e9f7099ee157f0bb16fa1d7a15eb	1708926042684
8	bf84ef7877525fc4e52d9cfcf1012dd832251d9b128d43ed5abd28566a467b65	1709008703251
9	5e32d4e78841c1d0035e1070fc8a6c06c096951f63abfbbbcf33b359c5a0f6a1	1709015812058
10	bbbb0ee7343caa8276020aac599f7b172d756b8f52bdccac9eae3a731d2f98f4	1709021219071
11	d1ead3ae15949029c17398fbfe3a688cb42c85ca0733a621409b269964c036d6	1709023589564
\.


--
-- Data for Name: bot_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bot_details (id, name, description, created_by_user_id, created_at, status, spec, is_deleted, avatar_image, assets_id) FROM stdin;
1	asdfasdfasdfasdf	asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf	1	2024-02-18 00:00:00	queued	{"dataId":"df627e3d-94f2-4a91-88f1-4bb8d72d29ff","trainingInputs":["Files"]}	f	\N	\N
2	bot name here	a bot which is useful to answer questions related to resume of atul vinod	1	2024-02-19 00:00:00	queued	"{\\"dataId\\":\\"73f7f839-d2a7-4c43-bcf3-87725667d985\\",\\"trainingInputs\\":[\\"Files\\"],\\"systemPrompt\\":\\"\\\\\\"You are a bot designed to answer questions related to the resume of Atul Vinod. Always use the provided information about Atul Vinod's resume to respond, not any prior knowledge. Some guidelines to follow: 1. Do not directly mention or reference the given information in your response. 2. Avoid phrases like 'According to the provided details, ..' or 'The given information suggests ...' or anything similar. Ensure your responses are concise and straight to the point.\\\\\\"\\"}"	f	\N	\N
3	bot name here	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-19 00:00:00	queued	"{\\"dataId\\":\\"c72ab727-5d43-47ea-b526-88c2b2342994\\",\\"trainingInputs\\":[\\"Files\\"],\\"systemPrompt\\":\\"systemPrompt\\"}"	f	\N	\N
4	This is your public bot name.	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-19 00:00:00	queued	"{\\"dataId\\":\\"3fe0bff4-691e-4c6a-a1fe-f5115dbf6033\\",\\"trainingInputs\\":[\\"Files\\"],\\"systemPrompt\\":\\"systemPrompt\\"}"	f	\N	\N
5	This is your public bot name.	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-19 00:00:00	queued	"{\\"data_id\\":\\"810585e8-680e-4204-a12b-f401d5599564\\",\\"training_inputs\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
6	This is your public bot name.	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-02-19 00:00:00	created	"{\\"data_id\\":\\"0f87ff0c-ce0b-4afb-a6b8-c6436ccb4791\\",\\"training_inputs\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
7	a very helpful bot	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers	1	2024-02-20 00:00:00	queued	"{\\"data_id\\":\\"a4eacb97-9b4e-4dee-91b4-11205696bda6\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
8	asdfasdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-20 00:00:00	queued	"{\\"data_id\\":\\"e8f29854-e6a4-4694-8ea7-ef3711f0c510\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
9	asdfasdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-20 00:00:00	inprogress	"{\\"data_id\\":\\"3fa7ce07-42f6-4e37-81f4-df924fcf804c\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
10	This is your public bot name.	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-02-20 00:00:00	created	"{\\"data_id\\":\\"e64ce5a5-831a-4df9-a5e3-ce2fd88755fb\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	\N
14	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 08:51:35.072537	queued	"{\\"data_id\\":\\"68f4686d-b781-4f9b-a9a5-ef95dce89239\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	68f4686d-b781-4f9b-a9a5-ef95dce89239
15	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 08:56:19.355156	failed_queue_push	"{\\"data_id\\":\\"0365d935-12b5-409f-87b6-b70c4f3ababf\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	0365d935-12b5-409f-87b6-b70c4f3ababf
11	asdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 08:07:29.072679	queued	"{\\"data_id\\":\\"08759415-bdb7-4461-8f41-662766fd1ca9\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f		08759415-bdb7-4461-8f41-662766fd1ca9
13	asdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 08:46:55.770026	queued	"{\\"data_id\\":\\"67a8a6b4-349e-42ff-945a-3cfd8477139f\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f		67a8a6b4-349e-42ff-945a-3cfd8477139f
12	asdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 08:08:48.072664	queued	"{\\"data_id\\":\\"ccc6596a-0bbd-49dc-a1e4-14c8e9da25ec\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f		ccc6596a-0bbd-49dc-a1e4-14c8e9da25ec
16	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-02-27 09:03:47.822546	failed_queue_push	"{\\"data_id\\":\\"a260d7cb-ad64-437f-bf3b-79ac4426b506\\",\\"training_spec\\":[\\"Files\\"],\\"system_prompt\\":\\"systemPrompt\\"}"	f	https://firebasestorage.googleapis.com/v0/b/bot-builder-a057a.appspot.com/o/avatar%2Fa260d7cb-ad64-437f-bf3b-79ac4426b506%2Favatar.png?alt=media&token=cb8772de-b1d6-4cc7-ac96-441595432390	a260d7cb-ad64-437f-bf3b-79ac4426b506
21	explore bot name	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-03-02 05:57:53.262185	failed_queue_push	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"contesnt\\",\\"files_id\\":\\"file-0\\",\\"files\\":[{\\"name\\":\\"resume-fla.pdf\\",\\"size\\":\\"0.34\\"},{\\"name\\":\\"resume-v2.pdf\\",\\"size\\":\\"0.34\\"}]},{\\"context\\":\\"contenst\\",\\"files_id\\":\\"file-1\\",\\"files\\":[{\\"name\\":\\"cover-letter-base.docx\\",\\"size\\":\\"0.01\\"}]}]}],\\"system_prompt\\":\\"systemPrompt\\"}"	f	https://firebasestorage.googleapis.com/v0/b/bot-builder-a057a.appspot.com/o/avatar%2Fce0c7de2-e753-4753-a760-35667532b902%2Favatar.png?alt=media&token=709f11a8-3ade-4cab-86f0-9ff52d1b9105	ce0c7de2-e753-4753-a760-35667532b902
17	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-02-29 10:49:21.941624	created	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"my old resume\\",\\"files_id\\":\\"file-0\\"},{\\"context\\":\\"my new resume\\",\\"files_id\\":\\"file-1\\"}]}],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	deaa0653-23ac-4512-9b0f-e2a1931eca65
18	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-03-01 06:29:24.639628	failed_queue_push	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[]}],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	d88c5879-4016-489b-942d-03695e8dba4f
19	asdfasdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-03-01 14:13:59.400712	failed_queue_push	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"adsfasdf\\",\\"files_id\\":\\"file-0\\"}]}],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	33faf3db-5562-4752-9230-8765533f25ac
20	asdfasdfasdfasdf	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.\r\n\r\n	1	2024-03-01 14:16:16.603132	failed_queue_push	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"dfsdfsdfsdf\\",\\"files_id\\":\\"file-0\\"}]}],\\"system_prompt\\":\\"systemPrompt\\"}"	f	\N	fdf7b77c-74eb-4819-92f2-6c014c7daf3e
23	Investment advisor	This is an investment advisor trained on 'Coffee can investing', a book that teaches investment strategies	1	2024-03-03 10:19:57.810593	created	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"The coffee can investing book containing all the information related to investing\\",\\"files_id\\":\\"file-0\\",\\"files\\":[{\\"name\\":\\"Coffee Can Investing_ the low r - Saurabh Mukherjea.pdf\\",\\"size\\":\\"8.46\\"}]}]}],\\"system_prompt\\":\\"You are an investment advisor trained on the principles of 'Coffee can investing', a book that outlines various investment strategies. Your responses should be concise and to the point. Always answer queries using the information provided from the book, not from prior knowledge or external sources. Do not directly reference or mention the book in your answers. Avoid phrases such as 'According to the book...' or 'The book states...'.\\"}"	f	https://firebasestorage.googleapis.com/v0/b/bot-builder-a057a.appspot.com/o/avatar%2F2286a3b1-7ba6-488d-bc44-d3b5c5b3c14f%2Favatar.png?alt=media&token=3f9b3442-6fff-4991-b2cb-2c7f7f2f8b00	2286a3b1-7ba6-488d-bc44-d3b5c5b3c14f
22	Andrew huberman sleep bot	This bot is trained on andrew huberman's podcast notes related to healthy sleep and how to achieve it	1	2024-03-03 06:34:37.184055	created	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"these files are related to human behaviour\\",\\"files_id\\":\\"file-0\\",\\"files\\":[{\\"name\\":\\"10_Tools_for_Managing_Stress_&_Anxiety_Huberman_Lab_Podcast_10.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"12_How_to_Increase_Motivation_&_Drive_Huberman_Lab_Podcast_12.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"13_The_Science_of_Emotions_&_Relationships_Huberman_Lab_Podcast_13.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"14_Biological_Influences_On_Sex_Sex_Differences_&_Preferences_Huberman_Lab_Podcast_14.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"15_The_Science_of_How_to_Optimize_Testosterone_&_Estrogen_Huberman_Lab_Podcast_15.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"18_Using_Cortisol_&_Adrenaline_to_Boost_Our_Energy_&_Immune_System_Function_Huberman_Lab_Podcast_18.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"19_Supercharge_Exercise_Performance_&_Recovery_with_Cooling_Huberman_Lab_Podcast_19.pdf\\",\\"size\\":\\"0.18\\"},{\\"name\\":\\"22_Science_of_Muscle_Growth_Increasing_Strength_&_Muscular_Recovery_Huberman_Lab_Podcast_22.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"24_The_Science_of_Vision_Eye_Health_&_Seeing_Better_Huberman_Lab_Podcast_24.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"25_How_Smell_Taste_&_PheromoneLike_Chemicals_Control_You_Huberman_Lab_Podcast_25.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"26_Dr_Karl_Deisseroth_Understanding_&_Healing_the_Mind_Huberman_Lab_Podcast_26.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"28_Maximizing_Productivity_Physical_&_Mental_Health_with_Daily_Tools_Huberman_Lab_Podcast_28.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"29_Dr_Lex_Fridman_Machines_Creativity_&_Love_Huberman_Lab_Podcast_29.pdf\\",\\"size\\":\\"0.29\\"},{\\"name\\":\\"32_How_to_Control_Your_Sense_of_Pain_&_Pleasure_Huberman_Lab_Podcast_32.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"33_Dr_Anna_Lembke_Understanding_&_Treating_Addiction_Huberman_Lab_Podcast_33.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"34_Understanding_&_Conquering_Depression_Huberman_Lab_Podcast_34.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"35_Dr_Robert_Sapolsky_Science_of_Stress_Testosterone_&_Free_Will_Huberman_Lab_Podcast_35.pdf\\",\\"size\\":\\"0.17\\"},{\\"name\\":\\"37_ADHD_&_How_Anyone_Can_Improve_Their_Focus_Huberman_Lab_Podcast_37.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"38_Dr_Matthew_Johnson_Psychedelics_for_Treating_Mental_Disorders_Huberman_Lab_Podcast_38.pdf\\",\\"size\\":\\"0.31\\"},{\\"name\\":\\"39_Controlling_Your_Dopamine_For_Motivation_Focus_&_Satisfaction_Huberman_Lab_Podcast_39.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"40_Dr_Craig_Heller_Using_Temperature_for_Performance_Brain_&_Body_Health_Huberman_Lab_Podcast_40.pdf\\",\\"size\\":\\"0.16\\"},{\\"name\\":\\"44_Using_Your_Nervous_System_to_Enhance_Your_Immune_System_Huberman_Lab_Podcast_44.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"45_Dr_Duncan_French_How_to_Exercise_for_Strength_Gains_&_Hormone_Optimization_Huberman_Lab_45.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"46_Time_Perception_&_Entrainment_by_Dopamine_Serotonin_&_Hormones_Huberman_Lab_Podcast_46.pdf\\",\\"size\\":\\"0.17\\"},{\\"name\\":\\"47_The_Science_of_Gratitude_&_How_to_Build_a_Gratitude_Practice_Huberman_Lab_Podcast_47.pdf\\",\\"size\\":\\"0.18\\"},{\\"name\\":\\"48_Dr_David_Buss_How_Humans_Select_&_Keep_Romantic_Partners_in_Short_&_Long_Term_Huberman_Lab_48.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"49_Erasing_Fears_&_Traumas_Based_on_the_Modern_Neuroscience_of_Fear_Huberman_Lab_Podcast_49.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"51_Science_of_Social_Bonding_in_Family_Friendship_&_Romantic_Love_Huberman_Lab_Podcast_51.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"52_Dr_David_Sinclair_The_Biology_of_Slowing_&_Reversing_Aging_Huberman_Lab_Podcast_52.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"53_The_Science_of_Making_&_Breaking_Habits_Huberman_Lab_Podcast_53.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"54_Dr_Jack_Feldman_Breathing_for_Mental_&_Physical_Health_&_Performance_Huberman_Lab_Podcast_54.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"55_The_Science_of_Setting_&_Achieving_Goals_Huberman_Lab_Podcast_55.pdf\\",\\"size\\":\\"0.17\\"},{\\"name\\":\\"56_Dr_Alia_Crum_Science_of_Mindsets_for_Health_&_Performance_Huberman_Lab_Podcast_56.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"57_Optimizing_Workspace_for_Productivity_Focus_&_Creativity_Huberman_Lab_Podcast_57.pdf\\",\\"size\\":\\"0.16\\"},{\\"name\\":\\"59_The_Science_of_Love_Desire_and_Attachment_Huberman_Lab_Podcast_59.pdf\\",\\"size\\":\\"0.28\\"},{\\"name\\":\\"60_Dr_David_Spiegel_Using_Hypnosis_to_Enhance_Health_&_Performance_Huberman_Lab_Podcast_60.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"65_Dr_Andy_Galpin_How_to_Build_Strength_Muscle_Size_&_Endurance_Huberman_Lab_Podcast_65.pdf\\",\\"size\\":\\"0.33\\"},{\\"name\\":\\"66_Using_Deliberate_Cold_Exposure_for_Health_and_Performance_Huberman_Lab_Podcast_66.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"67_Dr_Kyle_Gillett_How_to_Optimize_Your_Hormones_for_Health_&_Vitality_Huberman_Lab_Podcast_67.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"68_Using_Light_(Sunlight_Blue_Light_&_Red_Light)_to_Optimize_Health_Huberman_Lab_Podcast_68.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"69_The_Science_&_Health_Benefits_of_Deliberate_Heat_Exposure_Huberman_Lab_Podcast_69.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"71_Understanding_&_Controlling_Aggression_Huberman_Lab_Podcast_71.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"74_The_Science_&_Process_of_Healing_from_Grief_Huberman_Lab_Podcast_74.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"75_Dr_Paul_Conti_Therapy_Treating_Trauma_&_Other_Life_Challenges_Huberman_Lab_Podcast_75.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"76_Improve_Flexibility_with_ResearchSupported_Stretching_Protocols_Huberman_Lab_Podcast_76.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"77_Ido_Portal_The_Science_&_Practice_of_Movement_Huberman_Lab_Podcast_77.pdf\\",\\"size\\":\\"0.25\\"},{\\"name\\":\\"78_The_Science_&_Treatment_of_Obsessive_Compulsive_Disorder_(OCD)_Huberman_Lab_Podcast_78.pdf\\",\\"size\\":\\"0.28\\"},{\\"name\\":\\"79_Jeff_Cavaliere_Optimize_Your_Exercise_Program_with_ScienceBased_Tools_Huberman_Lab_Podcast_79.pdf\\",\\"size\\":\\"0.29\\"},{\\"name\\":\\"82_The_Science_&_Treatment_of_Bipolar_Disorder_Huberman_Lab_Podcast_82.pdf\\",\\"size\\":\\"0.25\\"},{\\"name\\":\\"83_Dr_Emily_Balcetis_Tools_for_Setting_&_Achieving_Goals_Huberman_Lab_Podcast_83.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"85_Dr_Peter_Attia_Exercise_Nutrition_Hormones_for_Vitality_&_Longevity_Huberman_Lab_Podcast_85.pdf\\",\\"size\\":\\"0.31\\"},{\\"name\\":\\"88_Focus_Toolkit_Tools_to_Improve_Your_Focus_&_Concentration_Huberman_Lab_Podcast_88.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"89_Dr_David_Anderson_The_Biology_of_Aggression_Mating_&_Arousal_Huberman_Lab_Podcast_89.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"90_Nicotine’s_Effects_on_the_Brain_&_Body_&_How_to_Quit_Smoking_or_Vaping_Huberman_Lab_Podcast_90.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"94_Fitness_Toolkit_Protocol_&_Tools_to_Optimize_Physical_Health_Huberman_Lab_Podcast_94.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"96_How_Meditation_Works_&_ScienceBased_Effective_Meditations_Huberman_Lab_Podcast_96.pdf\\",\\"size\\":\\"0.27\\"},{\\"name\\":\\"98_ScienceBased_Tools_for_Increasing_Happiness_Huberman_Lab_Podcast_98.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"100_Dr_Lex_Fridman_Navigating_Conflict_Finding_Purpose_&_Maintaining_Drive_Huberman_Lab_Podcast_100.pdf\\",\\"size\\":\\"0.28\\"},{\\"name\\":\\"102_Dr_Kyle_Gillett_Tools_for_Hormone_Optimization_in_Males_Huberman_Lab_Podcast_102.pdf\\",\\"size\\":\\"0.27\\"},{\\"name\\":\\"103_The_Science_of_Creativity_&_How_to_Enhance_Creative_Innovation_Huberman_Lab_Podcast_103.pdf\\",\\"size\\":\\"0.25\\"},{\\"name\\":\\"104_Jocko_Willink_How_to_Become_Resilient_Forge_Your_Identity_&_Lead_Others_Huberman_Lab_Podcast_104.pdf\\",\\"size\\":\\"0.40\\"},{\\"name\\":\\"105_Dr_Sam_Harris_Using_Meditation_to_Focus_View_Consciousness_&_Expand_Your_Mind_Huberman_Lab_105.pdf\\",\\"size\\":\\"0.38\\"},{\\"name\\":\\"110_Dr_Andy_Galpin_Optimal_Protocols_to_Build_Strength_&_Grow_Muscles_Huberman_Lab_Guest_Series.pdf\\",\\"size\\":\\"0.54\\"},{\\"name\\":\\"111_Dr_Sara_Gottfried_How_to_Optimize_Female_Hormone_Health_for_Vitality_&_Longevity_Huberman_Lab.pdf\\",\\"size\\":\\"0.29\\"},{\\"name\\":\\"112_Dr_Andy_Galpin_How_to_Build_Physical_Endurance_&_Lose_Fat_Huberman_Lab_Guest_Series.pdf\\",\\"size\\":\\"0.44\\"},{\\"name\\":\\"114_Dr_Andy_Galpin_Optimize_Your_Training_Program_for_Fitness_&_Longevity_Huberman_Lab_Guest_Series.pdf\\",\\"size\\":\\"0.33\\"},{\\"name\\":\\"116_Dr_Andy_Galpin_Maximize_Recovery_to_Achieve_Fitness_&_Performance_Goals_Huberman_Lab.pdf\\",\\"size\\":\\"0.39\\"},{\\"name\\":\\"117_How_to_Breathe_Correctly_for_Optimal_Health_Mood_Learning_&_Performance_Huberman_Lab_Podcast.pdf\\",\\"size\\":\\"0.25\\"},{\\"name\\":\\"Dr_Andy_Galpin_How_to_Assess_&_Improve_All_Aspects_of_Your_Fitness_Huberman_Lab_Guest_Series.pdf\\",\\"size\\":\\"0.25\\"},{\\"name\\":\\"How_to_Optimize_Fertility_in_Males_&_Females_Huberman_Lab_Podcast.pdf\\",\\"size\\":\\"0.43\\"},{\\"name\\":\\"Rick_Rubin_How_to_Access_Your_Creativity_Huberman_Lab_Podcast.pdf\\",\\"size\\":\\"0.29\\"}]},{\\"context\\":\\"these files are related to brain and its inner workings\\",\\"files_id\\":\\"file-1\\",\\"files\\":[{\\"name\\":\\"06_How_to_Focus_to_Change_Your_Brain_Huberman_Lab_Podcast_6.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"07_Using_Failures_Movement_&_Balance_to_Learn_Faster_Huberman_Lab_Podcast_7.pdf\\",\\"size\\":\\"0.18\\"},{\\"name\\":\\"08_Optimize_Your_Learning_&_Creativity_with_Sciencebased_Tools_Huberman_Lab_Podcast_8.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"09_Control_Pain_&_Heal_Faster_with_Your_Brain_Huberman_Lab_Podcast_9.pdf\\",\\"size\\":\\"0.19\\"},{\\"name\\":\\"20_How_to_Learn_Skills_Faster_Huberman_Lab_Podcast_20.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"23_How_To_Build_Endurance_In_Your_Brain_&_Body_Huberman_Lab_Podcast_23.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"27_The_Science_of_Hearing_Balance_&_Accelerated_Learning_Huberman_Lab_Podcast_27.pdf\\",\\"size\\":\\"0.17\\"},{\\"name\\":\\"30_How_to_Optimize_Your_BrainBody_Function_&_Health_Huberman_Lab_Podcast_30.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"42_Nutrients_For_Brain_Health_&_Performance_Huberman_Lab_Podcast_42.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"50_Dr_David_Berson_Your_Brain's_Logic_&_Function_Huberman_Lab_Podcast_50.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"58_Using_Play_to_Rewire_&_Improve_Your_Brain_Huberman_Lab_Podcast_58.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"72_Understand_&_Improve_Memory_Using_ScienceBased_Tools_Huberman_Lab_Podcast_72.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"73_Dr_Wendy_Suzuki_Boost_Attention_&_Memory_with_ScienceBased_Tools_Huberman_Lab_Podcast_73.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"80_Optimize_&_Control_Your_Brain_Chemistry_to_Improve_Health_&_Performance_Huberman_Lab_Podcast_80.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"86_What_Alcohol_Does_to_Your_Body_Brain_&_Health_Huberman_Lab_Podcast_86.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"87_Dr_Erich_Jarvis_The_Neuroscience_of_Speech_Language_&_Music_Huberman_Lab_Podcast_87.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"92_The_Effects_of_Cannabis_(Marijuana)_on_the_Brain_&_Body_Huberman_Lab_Podcast_92.pdf\\",\\"size\\":\\"0.28\\"},{\\"name\\":\\"93_Dr_Nolan_Williams_Psychedelics_&_Neurostimulation_for_Brain_Rewiring_Huberman_Lab_Podcast_93.pdf\\",\\"size\\":\\"0.28\\"},{\\"name\\":\\"95_Dr_Eddie_Chang_The_Science_of_Learning_&_Speaking_Languages_Huberman_Lab_Podcast_95.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"113_How_to_Stop_Headaches_Using_Science_Based_Approaches_Huberman_Lab_Podcast.pdf\\",\\"size\\":\\"0.35\\"},{\\"name\\":\\"118_Dr_Andy_Galpin_Optimal_Nutrition_&_Supplementation_for_Fitness_Huberman_Lab_Guest_Series.pdf\\",\\"size\\":\\"0.38\\"}]},{\\"context\\":\\"these files are related to food and healthy eating\\",\\"files_id\\":\\"file-2\\",\\"files\\":[{\\"name\\":\\"11_How_Foods_and_Nutrients_Control_Our_Moods_Huberman_Lab_Podcast_11.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"16_How_Our_Hormones_Control_Our_Hunger_Eating_&_Satiety_Huberman_Lab_Podcast_16.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"17_How_to_Control_Your_Metabolism_by_Thyroid_&_Growth_Hormone_Huberman_Lab_Podcast_17.pdf\\",\\"size\\":\\"0.21\\"},{\\"name\\":\\"21_How_to_Lose_Fat_with_ScienceBased_Tools_Huberman_Lab_Podcast_21.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"36_Healthy_Eating_&_Eating_Disorders_Anorexia_Bulimia_Binging_Huberman_Lab_Podcast_36.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"41_Effects_of_Fasting_&_Time_Restricted_Eating_on_Fat_Loss_&_Health_Huberman_Lab_Podcast_41.pdf\\",\\"size\\":\\"0.20\\"},{\\"name\\":\\"61_How_to_Enhance_Your_Gut_Microbiome_for_Brain_&_Overall_Health_Huberman_Lab_Podcast_61.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"62_Dr_Justin_Sonnenburg_How_to_Build_Maintain_&_Repair_Gut_Health_Huberman_Lab_Podcast_62.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"63_Using_Salt_to_Optimize_Mental_&_Physical_Performance_Huberman_Lab_Podcast_63.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"64_Controlling_Sugar_Cravings_&_Metabolism_with_ScienceBased_Tools_Huberman_Lab_Podcast_64.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"70_Dr_Rhonda_Patrick_Micronutrients_for_Health_&_Longevity_Huberman_Lab_Podcast_70.pdf\\",\\"size\\":\\"0.31\\"},{\\"name\\":\\"81_Dr_Charles_Zuker_The_Biology_of_Taste_Perception_&_Sugar_Craving_Huberman_Lab_Podcast_81.pdf\\",\\"size\\":\\"0.22\\"},{\\"name\\":\\"91_Dr_Casey_Halpern_Biology_&_Treatments_for_Compulsive_Eating_&_Behaviors_Huberman_Lab_Podcast_91.pdf\\",\\"size\\":\\"0.24\\"},{\\"name\\":\\"97_Dr_Layne_Norton_The_Science_of_Eating_for_Health_Fat_Loss_&_Lean_Muscle_Huberman_Lab_Podcast_97.pdf\\",\\"size\\":\\"0.38\\"},{\\"name\\":\\"99_Dr_Chris_Palmer_Diet_&_Nutrition_for_Mental_Health_Huberman_Lab_Podcast_99.pdf\\",\\"size\\":\\"0.29\\"},{\\"name\\":\\"101_Using_Caffeine_to_Optimize_Mental_&_Physical_Performance_Huberman_Lab_Podcast_101.pdf\\",\\"size\\":\\"0.26\\"},{\\"name\\":\\"106_Developing_a_Rational_Approach_to_Supplementation_for_Health_&_Performance_Huberman_Lab_Podcast_106.pdf\\",\\"size\\":\\"0.23\\"},{\\"name\\":\\"How_to_Optimize_Your_Water_Quality_&_Intake_for_Health_Huberman_Lab_Podcast.pdf\\",\\"size\\":\\"0.27\\"}]},{\\"context\\":\\"these files are related to ways of healthy sleep\\",\\"files_id\\":\\"file-3\\",\\"files\\":[{\\"name\\":\\"04_Find_Your_Temperature_Minimum_to_Defeat_Jetlag_Shift_Work_&_Sleeplessness_Huberman_Lab_Podcast_4.txt\\",\\"size\\":\\"0.10\\"},{\\"name\\":\\"05_Understanding_and_Using_Dreams_to_Learn_and_to_Forget_Huberman_Lab_Podcast_5.txt\\",\\"size\\":\\"0.07\\"},{\\"name\\":\\"43_Dr_Samer_Hattar_Timing_Light_Food_&_Exercise_for_Better_Sleep_Energy_&_Mood_Huberman_Lab_43.txt\\",\\"size\\":\\"0.13\\"},{\\"name\\":\\"84_Sleep_Toolkit_Tools_for_Optimizing_Sleep_&_SleepWake_Timing_Huberman_Lab_Podcast_84.txt\\",\\"size\\":\\"0.11\\"},{\\"name\\":\\"115_Dr_Gina_Poe_Use_Sleep_to_Enhance_Learning_Memory_&_Emotional_State_Huberman_Lab_Podcast.txt\\",\\"size\\":\\"0.12\\"},{\\"name\\":\\"AMA_4_Maintain_Motivation_Improve_REM_Sleep_Set_Goals_Manage_Anxiety_&_More.txt\\",\\"size\\":\\"0.02\\"}]}]}],\\"system_prompt\\":\\"\\\\\\"You are a bot trained on Andrew Huberman's podcast notes focusing on healthy sleep and methods to achieve it. Your responses should be concise, direct, and strictly based on the information from the podcast notes. Do not use any prior knowledge or external sources for your answers. Also, avoid referencing the source material directly in your responses or using phrases like 'According to the podcast notes...' or 'The podcast notes say...'. Always maintain a straightforward approach while answering.\\\\\\"\\"}"	f	\N	9975a9b0-a5e1-4a43-b29d-8b2681ecc202
25	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-03-03 10:30:28.503096	created	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"s\\",\\"files_id\\":\\"file-0\\",\\"files\\":[{\\"name\\":\\"your-file.pdf\\",\\"size\\":\\"0.10\\"}]}]}],\\"system_prompt\\":\\"You are a bot designed to provide concise and to-the-point responses. Your role is to assist users by answering their queries based on the description provided. Remember, your answers should be brief yet comprehensive, focusing on the main points of the question. Avoid referencing the given description directly in your response or using phrases like 'According to the description...' or 'The description states...'.\\"}"	f	\N	c19619e3-3a2e-45ec-9df3-19aa6905e34a
24	Name displayed to the users	A bot description is like an introduction for a chatbot. It helps the chatbot know what it's supposed to do and what kind of answers it should give. It also tells users what the bot can help with, giving them an idea of what to expect.	1	2024-03-03 10:30:28.552362	created	"{\\"training_spec\\":[{\\"type\\":\\"Files\\",\\"config\\":[{\\"context\\":\\"s\\",\\"files_id\\":\\"file-0\\",\\"files\\":[{\\"name\\":\\"your-file.pdf\\",\\"size\\":\\"0.10\\"}]}]}],\\"system_prompt\\":\\"You are a bot designed to provide concise and to-the-point responses based on your description. Your role is to introduce yourself, explain your capabilities, and set user expectations about the assistance you can provide. Remember not to directly reference your description in your answers. Avoid phrases like 'According to my description...' or 'My description states that...'.\\"}"	f	\N	a5018fd1-1eab-41b4-9eff-a244a9532289
\.


--
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (id, created_at, user_id, session_id, bot_id) FROM stdin;
43	2024-03-04 05:08:02.451392	1	1f133779-aaea-4ffc-b539-a876ebea6696	25
44	2024-03-04 05:24:26.525747	1	96ad27cd-9e2a-446f-9969-219d0eb7352a	22
52	2024-03-09 07:06:13.274492	1	85a7340c-30e2-4196-8bdf-74e657d6b0a5	23
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, picture, email, created_at) FROM stdin;
1	Atul Vinod	https://lh3.googleusercontent.com/a/ACg8ocK1jZ0-wQrFWAF5TPEzNK78G27YKnyOQuXShRsB8rpbSqrC=s96-c	atulvinod1911@gmail.com	2024-02-27 04:38:40.75287
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 11, true);


--
-- Name: bot_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bot_details_id_seq', 25, true);


--
-- Name: chat_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_sessions_id_seq', 52, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: bot_details bot_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bot_details
    ADD CONSTRAINT bot_details_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

