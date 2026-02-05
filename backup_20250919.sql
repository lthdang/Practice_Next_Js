--
-- PostgreSQL database dump
--

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: lang_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO lang_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: lang_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Answer; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Answer" (
    answer_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Answer" OWNER TO lang_user;

--
-- Name: Answer_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Answer_answer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Answer_answer_id_seq" OWNER TO lang_user;

--
-- Name: Answer_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Answer_answer_id_seq" OWNED BY public."Answer".answer_id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Comment" (
    comment_id integer NOT NULL,
    lesson_id integer NOT NULL,
    user_id integer NOT NULL,
    parent_comment_id integer,
    content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO lang_user;

--
-- Name: Comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Comment_comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_comment_id_seq" OWNER TO lang_user;

--
-- Name: Comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Comment_comment_id_seq" OWNED BY public."Comment".comment_id;


--
-- Name: Course; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Course" (
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    language character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    description character varying(1000),
    thumbnail_url character varying(255),
    created_by_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public."Course" OWNER TO lang_user;

--
-- Name: Course_course_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Course_course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Course_course_id_seq" OWNER TO lang_user;

--
-- Name: Course_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Course_course_id_seq" OWNED BY public."Course".course_id;


--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Enrollment" (
    enrollment_id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    enrollment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Enrollment" OWNER TO lang_user;

--
-- Name: Enrollment_enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Enrollment_enrollment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Enrollment_enrollment_id_seq" OWNER TO lang_user;

--
-- Name: Enrollment_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Enrollment_enrollment_id_seq" OWNED BY public."Enrollment".enrollment_id;


--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Lesson" (
    lesson_id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    video_url character varying(255),
    order_index integer DEFAULT 0 NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public."Lesson" OWNER TO lang_user;

--
-- Name: Lesson_lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Lesson_lesson_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Lesson_lesson_id_seq" OWNER TO lang_user;

--
-- Name: Lesson_lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Lesson_lesson_id_seq" OWNED BY public."Lesson".lesson_id;


--
-- Name: Question; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Question" (
    question_id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_text text NOT NULL,
    question_type character varying(50) NOT NULL
);


ALTER TABLE public."Question" OWNER TO lang_user;

--
-- Name: Question_question_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Question_question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Question_question_id_seq" OWNER TO lang_user;

--
-- Name: Question_question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Question_question_id_seq" OWNED BY public."Question".question_id;


--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Quiz" (
    quiz_id integer NOT NULL,
    lesson_id integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public."Quiz" OWNER TO lang_user;

--
-- Name: Quiz_quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Quiz_quiz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Quiz_quiz_id_seq" OWNER TO lang_user;

--
-- Name: Quiz_quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Quiz_quiz_id_seq" OWNED BY public."Quiz".quiz_id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."Role" (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    description text,
    created_by integer,
    modified_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Role" OWNER TO lang_user;

--
-- Name: Role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."Role_role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_role_id_seq" OWNER TO lang_user;

--
-- Name: Role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."Role_role_id_seq" OWNED BY public."Role".role_id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."User" (
    user_id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255),
    avatar_url character varying(255),
    role_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public."User" OWNER TO lang_user;

--
-- Name: UserLessonProgress; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public."UserLessonProgress" (
    progress_id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp(3) without time zone
);


ALTER TABLE public."UserLessonProgress" OWNER TO lang_user;

--
-- Name: UserLessonProgress_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."UserLessonProgress_progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserLessonProgress_progress_id_seq" OWNER TO lang_user;

--
-- Name: UserLessonProgress_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."UserLessonProgress_progress_id_seq" OWNED BY public."UserLessonProgress".progress_id;


--
-- Name: User_user_id_seq; Type: SEQUENCE; Schema: public; Owner: lang_user
--

CREATE SEQUENCE public."User_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_user_id_seq" OWNER TO lang_user;

--
-- Name: User_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lang_user
--

ALTER SEQUENCE public."User_user_id_seq" OWNED BY public."User".user_id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: lang_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO lang_user;

--
-- Name: Answer answer_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Answer" ALTER COLUMN answer_id SET DEFAULT nextval('public."Answer_answer_id_seq"'::regclass);


--
-- Name: Comment comment_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN comment_id SET DEFAULT nextval('public."Comment_comment_id_seq"'::regclass);


--
-- Name: Course course_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Course" ALTER COLUMN course_id SET DEFAULT nextval('public."Course_course_id_seq"'::regclass);


--
-- Name: Enrollment enrollment_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Enrollment" ALTER COLUMN enrollment_id SET DEFAULT nextval('public."Enrollment_enrollment_id_seq"'::regclass);


--
-- Name: Lesson lesson_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Lesson" ALTER COLUMN lesson_id SET DEFAULT nextval('public."Lesson_lesson_id_seq"'::regclass);


--
-- Name: Question question_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Question" ALTER COLUMN question_id SET DEFAULT nextval('public."Question_question_id_seq"'::regclass);


--
-- Name: Quiz quiz_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Quiz" ALTER COLUMN quiz_id SET DEFAULT nextval('public."Quiz_quiz_id_seq"'::regclass);


--
-- Name: Role role_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Role" ALTER COLUMN role_id SET DEFAULT nextval('public."Role_role_id_seq"'::regclass);


--
-- Name: User user_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."User" ALTER COLUMN user_id SET DEFAULT nextval('public."User_user_id_seq"'::regclass);


--
-- Name: UserLessonProgress progress_id; Type: DEFAULT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."UserLessonProgress" ALTER COLUMN progress_id SET DEFAULT nextval('public."UserLessonProgress_progress_id_seq"'::regclass);


--
-- Data for Name: Answer; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Answer" (answer_id, question_id, answer_text, is_correct) FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Comment" (comment_id, lesson_id, user_id, parent_comment_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Course" (course_id, title, language, price, description, thumbnail_url, created_by_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Enrollment" (enrollment_id, user_id, course_id, enrollment_date) FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Lesson" (lesson_id, course_id, title, content, video_url, order_index, created_by_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Question" (question_id, quiz_id, question_text, question_type) FROM stdin;
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Quiz" (quiz_id, lesson_id, title) FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."Role" (role_id, role_name, status, description, created_by, modified_by, created_at, updated_at) FROM stdin;
1	SUPER_ADMIN	t	\N	\N	\N	2025-09-12 09:33:47.447	2025-09-12 09:33:47.447
2	SUB_ADMIN	t	Sub admin	\N	\N	2025-09-12 09:36:50.072	2025-09-19 03:18:57.253
5	TEACHER	t	Teacher	\N	\N	2025-09-19 04:16:11.407	2025-09-19 04:26:50.05
6	SUB_TEACHER	t	Substitute Teacher	\N	\N	2025-09-19 04:28:29.648	2025-09-19 04:28:29.648
4	STUDENT	t	Student	\N	\N	2025-09-19 04:11:01.422	2025-09-19 07:13:08.076
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."User" (user_id, username, email, password_hash, full_name, avatar_url, role_id, created_at, updated_at, deleted_at, status) FROM stdin;
2	dang	lthang@ninepoints.vn	$2b$10$V1Gtmj7NhfJRVl.raxcVpOcsbi/as3Jz0mskrPzTgx7Q0EL3aK.Qi	Lâm Thái Hải Đăng	\N	1	2025-09-12 09:37:00.271	2025-09-12 09:37:00.271	\N	t
3	Khiêm	nkhiem@ninepoints.vn	$2b$10$meytI3IjgggeMdNePvj53.cZD8yPhYWzUs7vgFilqIsLEjNvsbvhy	Nguyễn Khiêm	\N	5	2025-09-19 05:09:54.651	2025-09-19 05:09:54.651	\N	t
4	Tiến	nnt@ninepoints.vn	$2b$10$DW9pu6umBC/t0t.HNUF4BOtJg9O73MxbxeJk7.IwVFIfvcrHFjmvC	Nguyễn Trung Tiến	\N	5	2025-09-19 07:44:30.919	2025-09-19 07:44:30.919	\N	t
5	Nam	a@ninepoints.vn	$2b$10$HMdzzIJzhp7QPkMZNUZQ.uKyo1feu7S7R4XAlzQ8OCJJLYf3D.Beu	Nguyễn Văn A	\N	4	2025-09-19 07:45:48.74	2025-09-19 07:45:48.74	\N	t
\.


--
-- Data for Name: UserLessonProgress; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public."UserLessonProgress" (progress_id, user_id, lesson_id, is_completed, completed_at) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: lang_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
95f50849-7fc3-4a09-9a97-8924764189c0	2a2ece85e3d0f788d5de2c24673410e158044633c4a7701f361d71fb6c6fa85f	2025-09-12 09:32:04.127346+00	20250912082856_fix_role_relations	\N	\N	2025-09-12 09:32:04.059079+00	1
b38a4b60-7b7c-41ff-80e6-b8c58f1015bd	e316547242b45d916102488ef415bfcd339ac05266dab142dcafc218506e0313	2025-09-12 09:32:31.433731+00	20250912093231_fix_role	\N	\N	2025-09-12 09:32:31.410342+00	1
5bb9061e-b2e7-44eb-b5b1-27f0693f0f1e	1e0c6dd26e615d66dfb5eaaf42dd1b103a34bf5e3151a52f9d6be13bfbc82097	2025-09-19 07:58:56.77183+00	20250919075856_add_user_status	\N	\N	2025-09-19 07:58:56.761938+00	1
\.


--
-- Name: Answer_answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Answer_answer_id_seq"', 1, false);


--
-- Name: Comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Comment_comment_id_seq"', 1, false);


--
-- Name: Course_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Course_course_id_seq"', 1, false);


--
-- Name: Enrollment_enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Enrollment_enrollment_id_seq"', 1, false);


--
-- Name: Lesson_lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Lesson_lesson_id_seq"', 1, false);


--
-- Name: Question_question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Question_question_id_seq"', 1, false);


--
-- Name: Quiz_quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Quiz_quiz_id_seq"', 1, false);


--
-- Name: Role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."Role_role_id_seq"', 6, true);


--
-- Name: UserLessonProgress_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."UserLessonProgress_progress_id_seq"', 1, false);


--
-- Name: User_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lang_user
--

SELECT pg_catalog.setval('public."User_user_id_seq"', 5, true);


--
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY (answer_id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (comment_id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (course_id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (enrollment_id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (lesson_id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (question_id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (quiz_id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (role_id);


--
-- Name: UserLessonProgress UserLessonProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY (progress_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Enrollment_user_id_course_id_key; Type: INDEX; Schema: public; Owner: lang_user
--

CREATE UNIQUE INDEX "Enrollment_user_id_course_id_key" ON public."Enrollment" USING btree (user_id, course_id);


--
-- Name: Role_role_name_key; Type: INDEX; Schema: public; Owner: lang_user
--

CREATE UNIQUE INDEX "Role_role_name_key" ON public."Role" USING btree (role_name);


--
-- Name: UserLessonProgress_user_id_lesson_id_key; Type: INDEX; Schema: public; Owner: lang_user
--

CREATE UNIQUE INDEX "UserLessonProgress_user_id_lesson_id_key" ON public."UserLessonProgress" USING btree (user_id, lesson_id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: lang_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: lang_user
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Answer Answer_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public."Question"(question_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public."Lesson"(lesson_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public."Comment"(comment_id);


--
-- Name: Comment Comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public."Course"(course_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public."Course"(course_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question Question_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_quiz_id_fkey" FOREIGN KEY (quiz_id) REFERENCES public."Quiz"(quiz_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Quiz Quiz_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public."Lesson"(lesson_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Role Role_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Role Role_modified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserLessonProgress UserLessonProgress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public."Lesson"(lesson_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserLessonProgress UserLessonProgress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lang_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Role"(role_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: lang_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

