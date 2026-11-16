import type { APIRoute } from "astro";
import { serializePost } from "../../../../lib/post-data";
import { publicHeaders, readPublishedPost } from "../../../../lib/public-posts";

export const GET: APIRoute = async ({ params }) => {
  const post = params.slug ? await readPublishedPost(params.slug) : null;
  if (!post) return new Response(null, { status: 404, headers: publicHeaders });
  return Response.json(serializePost(post.data), { headers: publicHeaders });
};
