import { createEmDashClient, type CmsPost } from "./emdash-client";
import { DEVELOP_SITE_URL, PRODUCTION_SITE_URL } from "./constants";

function client() {
  const url = process.env.EMDASH_URL;
  if (!url) throw new Error("Set EMDASH_URL to the ReLog EmDash server (see README.md)");
  return createEmDashClient(url);
}

function withOgImage<T extends CmsPost>(post: T) {
  const baseUrl = process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : DEVELOP_SITE_URL;
  return { ...post, ogImage: { url: baseUrl + "/ogp/" + encodeURIComponent(post.title) } };
}

export async function getAllPosts() {
  return (await client().getPosts()).map(withOgImage);
}

export async function getPostBySlug(slug: string) {
  const post = await client().getPost(slug);
  return post ? withOgImage(post) : null;
}
