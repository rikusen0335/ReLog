// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
// import rehypeShiki from "@leafac/rehype-shiki";
import remarkGfm from "remark-gfm";

const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    avatarPath: {
      type: 'string',
      required: true,
    },
  },
}))

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "**/*.md",
	fields: {
    slug: { type: "string", required: true }, // TODO: ハイフンと小文字と数字しか使えないみたいなvalidationを追加したい
		title: { type: "string", required: true },
		publishedDate: { type: "date", required: true },
    author: { type: "nested", required: true, of: Author },
    excerpt: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    public: { type: "boolean" },
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (post) => `/posts/${post._raw.flattenedPath}`,
		},
	},
}));

export default makeSource({
	contentDirPath: "posts",
	documentTypes: [Post],
	mdx: {
		remarkPlugins: [
			// remarkHint,
			remarkBreaks,
			remarkGfm,
			remarkDirective,
			remarkDirectiveRehype,
		],
		rehypePlugins: [
			rehypeSlug,
			rehypeCodeTitles,
			rehypePrismPlus,
			rehypeAutolinkHeadings,
			rehypeMdxImportMedia,
			rehypeMdxCodeProps,
		],
	},
});
