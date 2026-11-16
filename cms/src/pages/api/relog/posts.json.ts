import type { APIRoute } from "astro";
import { serializePost } from "../../../lib/post-data";
import { publicHeaders, readPublishedPosts } from "../../../lib/public-posts";

export const GET: APIRoute = async ({ url }) => {
  const { entries, nextCursor } = await readPublishedPosts(url.searchParams.get("cursor") || undefined);
  return Response.json({
    posts: entries.map((entry) => serializePost(entry.data)).filter((post) => post !== null),
    nextCursor: nextCursor ?? null,
  }, { headers: publicHeaders });
};
