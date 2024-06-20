import type { NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaGithub } from "react-icons/fa";
import Container from "../../components/container";
import Header from "../../components/header";
import Layout from "../../components/layout";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import PostTitle from "../../components/post-title";
import useLightbox from "../../hooks/useLightbox";
import { getAllWorks, getWorkBySlug } from "../../lib/api";
import {
	DEVELOP_SITE_URL,
	PRODUCTION_SITE_URL,
	SITE_NAME,
} from "../../lib/constants";
import type WorkType from "../../types/work";

type Props = {
	work: WorkType;
};

const Work: NextPage<Props> = ({ work }) => {
	const router = useRouter();

	const { title, subtitle, description, thumbnail, images, used, githubLink } =
		work;

	if (!router.isFallback && !work?.slug) {
		return <ErrorPage statusCode={404} />;
	}

	const { openLightbox, renderLightbox } = useLightbox();

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
								<span className="text-2xl font-bold md:text-3xl lg:text-5xl">
									{title}
								</span>
								<span className="font-bold lg:ml-2 xl:ml-4 text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[3.5rem]">
									{subtitle}
								</span>
							</h2>
							<p className="mt-4 text-base leading-8 whitespace-pre-wrap transition sm:text-lg md:text-xl xl:text-2xl dark:text-light-200 md:leading-7">
								{description}
							</p>
							<div className="flex flex-wrap mt-4 mb-6 space-x-4">
								{used.map((name, idx) => (
									<p
										key={name}
										className="px-[8px] py-[4px] mb-2 text-gray-700 border border-gray-400 dark:text-light-300 dark:border-gray-500"
									>
										{name}
									</p>
								))}
							</div>

							<div className="mb-12">
								{githubLink && (
									<div className="flex items-center space-x-2">
										<span className="text-2xl dark:text-light-100">
											<FaGithub />
										</span>
										<span className="text-xl">
											<a
												className="hover:underline decoration-neutral-700 dark:decoration-neutral-200 decoration-1 dark:text-light-300"
												href={githubLink}
											>
												{githubLink}
											</a>
										</span>
									</div>
								)}
							</div>

							<img
								alt="作品のサムネイル"
								src={thumbnail}
								className="w-full h-[400px] object-cover"
							/>

							<h4 className="mt-16 mb-8 text-4xl tracking-wider text-center transition dark:text-light-200">
								Gallery
							</h4>
							<div className="grid grid-cols-1 gap-0 mx-2 xs:mx-4 sm:mx-8 xs:grid-cols-2 md:grid-cols-3 lg:gap-8 md:mx-16 lg:mx-32">
								{/* TODO: 画像のローディングが終わらないとLightboxに表示されないのをどうにかする */}
								{images.map((img, idx) => (
									<button
										type="button"
										key={img.source}
										className="relative col-span-1 transition hover:-translate-y-1 h-[300px]"
										onClick={() => openLightbox(idx)}
									>
										<Image
											className="object-cover cursor-pointer"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // TODO: いったん適当
											fill
											src={img.source}
											alt={img.alt ?? ""}
										/>
									</button>
								))}
							</div>
						</article>
					</>
				)}
			</Container>
			{renderLightbox({
				slides: images.map(({ source, alt }) => ({
					src: source,
					alt: alt,
					description: alt,
				})),
			})}
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
