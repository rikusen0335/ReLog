import { getEmDashCollection, getEmDashEntry, getRequestContext, runWithContext } from "emdash";

// The public feed never inherits a preview or visual-editing session.
export function publishedContext<T>(read: () => Promise<T>): Promise<T> {
  return runWithContext({ ...getRequestContext(), editMode: false, preview: undefined }, read);
}

export async function readPublishedPost(slug: string) {
  const result = await publishedContext(() => getEmDashEntry("posts", slug));
  if (result.error) throw result.error;
  return result.entry?.data.status === "published" ? result.entry : null;
}

export async function readPublishedPosts(cursor?: string) {
  const result = await publishedContext(() => getEmDashCollection("posts", {
    status: "published",
    limit: 50,
    cursor,
    orderBy: { publish_date: "desc", id: "desc" },
  }));
  if (result.error) throw result.error;
  return result;
}

export const publicHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
