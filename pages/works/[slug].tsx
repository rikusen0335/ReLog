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
import Image from "next/image";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { FaGithub } from "react-icons/fa"

type Props = {
    work: WorkType;
};

const Work: NextPage<Props> = ({ work }) => {
    const router = useRouter();

    const { title, subtitle, description, thumbnail, images, used, githubLink } = work;

    if (!router.isFallback && !work?.slug) {
        return <ErrorPage statusCode={404} />;
    }

    return (
        <Layout>
            <Container>
                <Header continuedText=" The Works" href="/works" />
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
                            <h2 className="flex flex-col transition lg:flex-row dark:text-light-50 lg:items-baseline">
                                <span className="text-2xl font-bold md:text-3xl lg:text-5xl">{title}</span>
                                <span className="font-bold lg:ml-2 xl:ml-4 text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[3.5rem]">{subtitle}</span>
                            </h2>
                            <p className="mt-4 text-base leading-8 whitespace-pre-wrap transition sm:text-lg md:text-xl xl:text-2xl dark:text-light-200 md:leading-7">{description}</p>
                            <div className="flex flex-wrap mt-4 mb-6 space-x-4">
                                {used.map((name, idx) => (
                                    <p
                                        key={idx}
                                        className="px-[8px] py-[4px] mb-2 text-gray-700 border border-gray-400 dark:text-light-300 dark:border-gray-500"
                                    >
                                        {name}
                                    </p>
                                ))}
                            </div>

                            <div className="mb-12">
                                {githubLink &&<div className="flex items-center space-x-2">
                                    <span className="text-2xl dark:text-light-100"><FaGithub /></span>
                                    <span className="text-xl"><a className="hover:underline decoration-neutral-700 dark:decoration-neutral-200 decoration-1 dark:text-light-300" href={githubLink}>{githubLink}</a></span>
                                </div>}
                            </div>

                            <img src={thumbnail} className="w-full h-[400px] object-cover" />

                            <h4 className="mt-16 mb-8 text-4xl tracking-wider text-center transition dark:text-light-200">Gallery</h4>
                            <SimpleReactLightbox>
                                <SRLWrapper>
                                    <div className="grid grid-cols-1 gap-0 mx-2 xs:mx-4 sm:mx-8 xs:grid-cols-2 md:grid-cols-3 lg:gap-8 md:mx-16 lg:mx-32">
                                        {images.map((img, idx) => (
                                            <div className="col-span-1 transition hover:-translate-y-1" key={idx}>
                                                <Image
                                                    key={idx}
                                                    className="object-cover cursor-pointer"
                                                    width="100%"
                                                    height="100%"
                                                    layout="responsive"
                                                    src={img.source}
                                                    alt={img.alt}
                                                    // @ts-ignore 仕方ない
                                                    srl_gallery_image="true"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </SRLWrapper>
                            </SimpleReactLightbox>
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
            work,
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
