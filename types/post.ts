import type Author from "./author";

type PostType = {
  slug: string;
  title: string;
  publishDate: string;
  updatedDate: string | null;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: { url: string };
  tags: string[];
  bodyHtml?: string;
};

export default PostType;
