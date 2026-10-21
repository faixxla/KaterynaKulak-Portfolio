--
-- PostgreSQL database dump
--

\restrict 9a0AIbmuESoN0q3XdQPIOg3kaGhphIqVWCnNaRdkPW7BzbYSJ5PKuqiN4nuBtdh

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-10-21 21:09:00

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16405)
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    authorid integer NOT NULL,
    authorname character varying(255) NOT NULL,
    bio text
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16404)
-- Name: authors_authorid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authors_authorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authors_authorid_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 219
-- Name: authors_authorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authors_authorid_seq OWNED BY public.authors.authorid;


--
-- TOC entry 232 (class 1259 OID 16576)
-- Name: book_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_genres (
    bookgenresid integer NOT NULL,
    genreid integer,
    bookid integer
);


ALTER TABLE public.book_genres OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16575)
-- Name: book_genres_bookgenresid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_genres_bookgenresid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_genres_bookgenresid_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 231
-- Name: book_genres_bookgenresid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_genres_bookgenresid_seq OWNED BY public.book_genres.bookgenresid;


--
-- TOC entry 235 (class 1259 OID 16622)
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    bookmarkid integer NOT NULL,
    userid integer NOT NULL,
    bookid integer NOT NULL,
    sectionid character varying(255) NOT NULL,
    label text
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16621)
-- Name: bookmarks_bookmarkid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookmarks_bookmarkid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookmarks_bookmarkid_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 234
-- Name: bookmarks_bookmarkid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookmarks_bookmarkid_seq OWNED BY public.bookmarks.bookmarkid;


--
-- TOC entry 222 (class 1259 OID 16416)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    bookid integer NOT NULL,
    authorid integer,
    name character varying(255) NOT NULL,
    description text,
    pagesnum integer,
    year integer,
    language character varying(50),
    filepath character varying(500),
    coverpath character varying(500),
    videopath character varying(500)
);


ALTER TABLE public.books OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16415)
-- Name: books_bookid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_bookid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_bookid_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 221
-- Name: books_bookid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_bookid_seq OWNED BY public.books.bookid;


--
-- TOC entry 226 (class 1259 OID 16449)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    commentid integer NOT NULL,
    userid integer,
    bookid integer,
    sectionid character varying(255),
    content text NOT NULL,
    parentcomid integer,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16448)
-- Name: comments_commentid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_commentid_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 225
-- Name: comments_commentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;


--
-- TOC entry 230 (class 1259 OID 16567)
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    genreid integer NOT NULL,
    genrename character varying(100) NOT NULL,
    perception numeric(3,1)
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16566)
-- Name: genre_genreid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genre_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genre_genreid_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 229
-- Name: genre_genreid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genre_genreid_seq OWNED BY public.genre.genreid;


--
-- TOC entry 233 (class 1259 OID 16597)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16432)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    passwordhash character varying(255) NOT NULL,
    bio text,
    level integer DEFAULT 1,
    avatarpath character varying(500),
    totalxp bigint DEFAULT 0,
    birhday date,
    createdat timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16431)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 228 (class 1259 OID 16548)
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    wishlistid integer NOT NULL,
    userid integer,
    bookid integer,
    priority integer DEFAULT 0
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16547)
-- Name: wishlist_wishlistid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_wishlistid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_wishlistid_seq OWNER TO postgres;

--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 227
-- Name: wishlist_wishlistid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_wishlistid_seq OWNED BY public.wishlist.wishlistid;


--
-- TOC entry 4895 (class 2604 OID 16408)
-- Name: authors authorid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors ALTER COLUMN authorid SET DEFAULT nextval('public.authors_authorid_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16579)
-- Name: book_genres bookgenresid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres ALTER COLUMN bookgenresid SET DEFAULT nextval('public.book_genres_bookgenresid_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16625)
-- Name: bookmarks bookmarkid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN bookmarkid SET DEFAULT nextval('public.bookmarks_bookmarkid_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16419)
-- Name: books bookid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN bookid SET DEFAULT nextval('public.books_bookid_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 16452)
-- Name: comments commentid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16570)
-- Name: genre genreid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre ALTER COLUMN genreid SET DEFAULT nextval('public.genre_genreid_seq'::regclass);


--
-- TOC entry 4897 (class 2604 OID 16435)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16551)
-- Name: wishlist wishlistid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist ALTER COLUMN wishlistid SET DEFAULT nextval('public.wishlist_wishlistid_seq'::regclass);


--
-- TOC entry 4908 (class 2606 OID 16414)
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (authorid);


--
-- TOC entry 4922 (class 2606 OID 16582)
-- Name: book_genres book_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_pkey PRIMARY KEY (bookgenresid);


--
-- TOC entry 4926 (class 2606 OID 16633)
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (bookmarkid);


--
-- TOC entry 4910 (class 2606 OID 16425)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (bookid);


--
-- TOC entry 4916 (class 2606 OID 16459)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);


--
-- TOC entry 4920 (class 2606 OID 16574)
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genreid);


--
-- TOC entry 4924 (class 2606 OID 16606)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 4912 (class 2606 OID 16447)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4914 (class 2606 OID 16445)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 4918 (class 2606 OID 16555)
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (wishlistid);


--
-- TOC entry 4933 (class 2606 OID 16588)
-- Name: book_genres book_genres_bookid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_bookid_fkey FOREIGN KEY (bookid) REFERENCES public.books(bookid);


--
-- TOC entry 4934 (class 2606 OID 16583)
-- Name: book_genres book_genres_genreid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_genreid_fkey FOREIGN KEY (genreid) REFERENCES public.genre(genreid);


--
-- TOC entry 4927 (class 2606 OID 16426)
-- Name: books books_authorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_authorid_fkey FOREIGN KEY (authorid) REFERENCES public.authors(authorid);


--
-- TOC entry 4928 (class 2606 OID 16465)
-- Name: comments comments_bookid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_bookid_fkey FOREIGN KEY (bookid) REFERENCES public.books(bookid);


--
-- TOC entry 4929 (class 2606 OID 16470)
-- Name: comments comments_parentcomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parentcomid_fkey FOREIGN KEY (parentcomid) REFERENCES public.comments(commentid);


--
-- TOC entry 4930 (class 2606 OID 16460)
-- Name: comments comments_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- TOC entry 4935 (class 2606 OID 16639)
-- Name: bookmarks fk_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_book FOREIGN KEY (bookid) REFERENCES public.books(bookid) ON DELETE CASCADE;


--
-- TOC entry 4936 (class 2606 OID 16634)
-- Name: bookmarks fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- TOC entry 4931 (class 2606 OID 16561)
-- Name: wishlist wishlist_bookid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_bookid_fkey FOREIGN KEY (bookid) REFERENCES public.books(bookid);


--
-- TOC entry 4932 (class 2606 OID 16556)
-- Name: wishlist wishlist_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


-- Completed on 2026-10-21 21:09:00

--
-- PostgreSQL database dump complete
--

\unrestrict 9a0AIbmuESoN0q3XdQPIOg3kaGhphIqVWCnNaRdkPW7BzbYSJ5PKuqiN4nuBtdh

