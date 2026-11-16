export function imageUrl(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const image = value as Record<string, unknown>;
  const meta = image.meta as Record<string, unknown> | undefined;
  if (typeof image.src === "string" && image.src) {
    // Media paths are served through Next.js, including after a domain change.
    const url = new URL(image.src, "https://relog.invalid");
    if (url.pathname.startsWith("/_emdash/api/media/file/")) {
      return url.pathname + url.search;
    }
    if (image.src.startsWith("/") && !image.src.startsWith("//")) return image.src;
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  }
  if (typeof meta?.storageKey === "string") {
    return "/_emdash/api/media/file/" + meta.storageKey.split("/").map(encodeURIComponent).join("/");
  }
  return "";
}

function isoDate(value: unknown): string | null {
  if (!(typeof value === "string" || value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function serializePost(data: Record<string, unknown>) {
  if (data.status !== "published") return null;
  const publishDate = isoDate(data.publish_date ?? data.publishedAt);
  if (typeof data.slug !== "string" || !data.slug || typeof data.title !== "string" || !publishDate) {
    throw new Error("Published ReLog post has invalid metadata");
  }
  const terms = (data.terms as Record<string, Array<{ label: string }>> | undefined)?.tag ?? [];
  return {
    slug: data.slug,
    title: data.title,
    publishDate,
    updatedDate: isoDate(data.update_date ?? data.updatedAt),
    coverImage: imageUrl(data.cover_image) || "/assets/images/dynamic-routing.jpg",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    author: {
      name: typeof data.author_name === "string" ? data.author_name : "rikusen0335",
      picture: imageUrl(data.author_picture) || "/assets/images/rikusen.png",
    },
    tags: terms.map((term) => term.label),
  };
}
