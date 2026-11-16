export type CmsPost = {
  slug: string;
  title: string;
  publishDate: string;
  updatedDate: string | null;
  coverImage: string;
  excerpt: string;
  author: { name: string; picture: string };
  tags: string[];
};

function validatePost(value: unknown): CmsPost {
  if (!value || typeof value !== "object") throw new Error("Invalid EmDash post");
  const post = value as CmsPost;
  if (
    typeof post.slug !== "string" || !post.slug ||
    typeof post.title !== "string" ||
    typeof post.publishDate !== "string" || Number.isNaN(Date.parse(post.publishDate)) ||
    !(post.updatedDate === null || typeof post.updatedDate === "string") ||
    typeof post.coverImage !== "string" ||
    typeof post.excerpt !== "string" ||
    typeof post.author?.name !== "string" || typeof post.author?.picture !== "string" ||
    !Array.isArray(post.tags) || post.tags.some((tag) => typeof tag !== "string")
  ) throw new Error("Invalid EmDash post metadata");
  return post;
}

export function createEmDashClient(baseUrl: string, fetcher: typeof fetch = fetch) {
  const origin = new URL(baseUrl);
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password || origin.search || origin.hash || !["", "/"].includes(origin.pathname)) {
    throw new Error("EMDASH_URL must be an HTTP(S) origin");
  }

  async function request(path: string) {
    const response = await fetcher(new URL(path, origin), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      // Deliberately do not forward visitor cookies, preview tokens or credentials.
      headers: { Accept: path.endsWith("/body") ? "text/html" : "application/json" },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("EmDash request failed (" + response.status + ")");
    return response;
  }

  return {
    async getPosts(): Promise<CmsPost[]> {
      const posts: CmsPost[] = [];
      const cursors = new Set<string>();
      let cursor: string | null = null;
      do {
        const query = cursor ? "?cursor=" + encodeURIComponent(cursor) : "";
        const response = await request("/api/relog/posts.json" + query);
        if (!response) throw new Error("EmDash public posts endpoint is missing");
        const page: { posts: unknown[]; nextCursor: unknown } = await response.json();
        if (!Array.isArray(page.posts)) throw new Error("Invalid EmDash posts response");
        posts.push(...page.posts.map(validatePost));
        if (page.nextCursor !== null && typeof page.nextCursor !== "string") {
          throw new Error("Invalid EmDash pagination cursor");
        }
        cursor = page.nextCursor as string | null;
        if (cursor) {
          if (cursors.has(cursor)) throw new Error("Repeated EmDash pagination cursor");
          cursors.add(cursor);
        }
      } while (cursor);
      return posts.sort((a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate) || a.slug.localeCompare(b.slug));
    },
    async getPost(slug: string): Promise<(CmsPost & { bodyHtml: string }) | null> {
      const path = "/api/relog/posts/" + encodeURIComponent(slug);
      const response = await request(path + ".json");
      if (!response) return null;
      const post = validatePost(await response.json());
      const body = await request(path + "/body");
      // The entry may have been unpublished between the two reads.
      if (!body) return null;
      if (!(body.headers.get("content-type") || "").includes("text/html")) {
        throw new Error("EmDash returned an invalid post body");
      }
      return { ...post, bodyHtml: await body.text() };
    },
  };
}
