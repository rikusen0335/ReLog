// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
// import rehypeShiki from "@leafac/rehype-shiki";
import remarkGfm from "remark-gfm";
import { remarkMdxCodeMeta } from "remark-mdx-code-meta";
import { remarkMdxImages } from "remark-mdx-images";

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: "**/*.md",
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({ contentDirPath: 'posts', documentTypes: [Post], mdx: { remarkPlugins: [
  // remarkHint,
  remarkBreaks,
  remarkGfm,
  remarkMdxImages,
  remarkDirective,
  remarkDirectiveRehype,
], rehypePlugins: [
  rehypeSlug,
  rehypeCodeTitles,
  rehypePrismPlus,
  rehypeAutolinkHeadings,
  // rehypeMdxImportMedia,
  // rehypeMdxCodeProps,
]}})
  // remarkMdxCodeMeta,]} })