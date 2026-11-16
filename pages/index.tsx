import type { NextPage } from "next";
import Head from "next/head";
import Container from "../components/container";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import MoreStories from "../components/more-stories";
import { getAllPosts } from "../lib/api";
import { SITE_NAME } from "../lib/constants";
import type Post from "../types/post";

type Props = {
  allPosts: Post[];
};

const Index: NextPage<Props> = ({ allPosts }) => {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  const metaTitle = `${SITE_NAME} | An extremely garbage blog for notes.`;
  return (
    <>
      <Layout>
        <Head>
          <title>{metaTitle}</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              publishDate={heroPost.publishDate}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
              tags={heroPost.tags}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  );
};

export default Index;

// Read on every request so new posts and unpublishing do not require a deployment.
export const getServerSideProps = async ({ res }: { res: import("http").ServerResponse }) => {
  res.setHeader("Cache-Control", "private, no-store");
  return { props: { allPosts: await getAllPosts() } };
};
