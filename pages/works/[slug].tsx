import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import { getWorkBySlug, getAllWorks } from "../../lib/api";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import {
    SITE_NAME,
    DEVELOP_SITE_URL,
    PRODUCTION_SITE_URL,
} from "../../lib/constants";
import WorkType from "../../types/work";
import { NextPage } from "next";

type Props = {
    work: WorkType;
};

const Work: NextPage<Props> = ({ work }) => {
    const router = useRouter();

    const { title, subtitle, description,  } = work

    if (!router.isFallback && !work?.slug) {
        return <ErrorPage statusCode={404} />;
    }

    return (
        <Layout>
            <Container>
                <Header continuedText=" The Works" />
                {router.isFallback ? (
                    <PostTitle>Loading…</PostTitle>
                ) : (
                    <>
                        <article className="mb-32">
                            <Head>
                                <title>
                                    {work.title} | {SITE_NAME}
                                </title>
                                <meta property="og:title" content={work.title} />
                                <meta property="twitter:title" content={work.title} />
                                <meta property="twitter:text:title" content={work.title} />
                                {/* <meta
                                    property="og:image"
                                    key="ogImage"
                                    content={work.ogImage.url}
                                /> */}
                                {/* <meta
                                    name="twitter:card"
                                    key="twitterCard"
                                    content="summary_large_image"
                                /> */}
                                {/* <meta
                                    name="twitter:image"
                                    key="twitterImage"
                                    content={work.ogImage.url}
                                /> */}
                            </Head>
                            <h2 className="text-5xl font-bold">{title}<span className="ml-4 text-[3.5rem]">{subtitle}</span></h2>
                            <p className="text-xl mt-4">{description}</p>

                        </article>
                    </>
                )}
            </Container>
        </Layout>
    );
};

export default Work;

type Params = {
    params: {
        slug: string;
    };
};

export async function getStaticProps({ params }: Params) {
    const work = getWorkBySlug(params.slug);

    const baseUrl = {
        production: PRODUCTION_SITE_URL,
        development: DEVELOP_SITE_URL,
        test: DEVELOP_SITE_URL, // 使わないけど
    }[process.env.NODE_ENV];

    return {
        props: {
            work
        },
    };
}

export async function getStaticPaths() {
    const works = getAllWorks();

    return {
        paths: works.map((work) => {
            return {
                params: {
                    slug: work.slug,
                },
            };
        }),
        fallback: false,
    };
}
