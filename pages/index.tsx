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

function getISODateStringOrNull(date: any): string | null {
  if (!date) return null;
  if (typeof date === "string") {
    const parsed = Date.parse(date);
    if (isNaN(parsed)) {
      return null;
    }
    return new Date(parsed).toISOString();
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  return null;
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "publish-date",
    "slug",
    "author",
    "cover-image",
    "excerpt",
    "tags",
    "public",
  ]);

  allPosts.forEach((post) => {
    // @ts-ignore
    post.publishDate = getISODateStringOrNull(post.publishDate);
    // @ts-ignore
    post.updatedDate = getISODateStringOrNull(post.updatedDate);

    delete post["publish-date"];
    delete post["update-date"];
  });

  return {
    props: { allPosts },
  };
};
