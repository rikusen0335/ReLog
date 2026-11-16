import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Container from "../../components/container";
import Header from "../../components/header";
import Layout from "../../components/layout";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import { getPostBySlug } from "../../lib/api";
import { SITE_NAME } from "../../lib/constants";
import type PostType from "../../types/post";

type Props = { post: PostType };

const Post: NextPage<Props> = ({ post }) => (
  <Layout>
    <Container>
      <Header />
      <article className="mb-32">
        <Head>
          <title>{post.title} | {SITE_NAME}</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="twitter:title" content={post.title} />
          <meta property="og:image" key="ogImage" content={post.ogImage.url} />
          <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
          <meta name="twitter:image" key="twitterImage" content={post.ogImage.url} />
        </Head>
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          publishDate={post.publishDate}
          author={post.author}
          tags={post.tags}
        />
        <PostBody html={post.bodyHtml || ""} />
      </article>
    </Container>
  </Layout>
);

export default Post;

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  if (typeof params?.slug !== "string") return { notFound: true };
  const post = await getPostBySlug(params.slug);
  return post ? { props: { post } } : { notFound: true };
};
