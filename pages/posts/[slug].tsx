import { resolve } from "path";
import { bundleMDX } from "mdx-bundler";
import ErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import remarkBreaks from "remark-breaks";
import Container from "../../components/container";
import Header from "../../components/header";
import Layout from "../../components/layout";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import PostTitle from "../../components/post-title";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import {
  DEVELOP_SITE_URL,
  PRODUCTION_SITE_URL,
  SITE_NAME,
} from "../../lib/constants";
import type PostType from "../../types/post";
const remarkHint = require("remark-hint"); // TODO: あとでremark-directiveで置き換える
import type { NextPage } from "next";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
// import rehypeShiki from "@leafac/rehype-shiki";
import remarkGfm from "remark-gfm";

// コードフェンスのメタ文字列 `hl="1-4"` を pre 要素の dataLine プロパティに変換する。
// MDXソースの前処理で {1-4} → hl="1-4" に変換済みのものをここで処理する。
// rehype-prism-plus は pre.properties.dataLine を読んでラインハイライトを行う。
function rehypeHighlightToDataLine() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "pre") return;
      const codeEl = node.children?.find((c: any) => c.tagName === "code");
      if (!codeEl?.properties?.metastring) return;
      const match = codeEl.properties.metastring.match(/hl="([\d,\s-]+)"/);
      if (!match) return;
      node.properties = node.properties || {};
      node.properties.dataLine = match[1].trim();
      codeEl.properties.metastring = codeEl.properties.metastring
        .replace(/hl="[\d,\s-]+"/, "")
        .trim();
    });
  };
}

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

const Post: NextPage<Props> = ({ post, morePosts, preview }) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | {SITE_NAME}
                </title>
                <meta property="og:title" content={post.title} />
                <meta property="twitter:title" content={post.title} />
                <meta property="twitter:text:title" content={post.title} />
                <meta
                  property="og:image"
                  key="ogImage"
                  content={post.ogImage.url}
                />
                <meta
                  name="twitter:card"
                  key="twitterCard"
                  content="summary_large_image"
                />
                <meta
                  name="twitter:image"
                  key="twitterImage"
                  content={post.ogImage.url}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                tags={post.tags}
              />
              <PostBody source={post.content.code} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "tags",
    "ogImage",
    "coverImage",
  ]);

  const rawContent = post.content || "";
  // MDXパーサーが {1-4} をJSX式として解釈するのを防ぐため、
  // コードフェンスのメタ文字列内の {lines} を hl="lines" に変換する
  const processedContent = post.content.replace(
    /(^```+\s*\S[^\n{]*)\{([\d,\s-]+)\}/gm,
    '$1hl="$2"',
  );
  const content = await bundleMDX({
    source: processedContent,
    cwd: resolve(process.cwd(), `/_contents/posts/${post.slug}`),
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkHint,
        remarkBreaks,
        remarkGfm,
        remarkDirective,
        remarkDirectiveRehype,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrismPlus,
        rehypeHighlightToDataLine,
        rehypeMdxCodeProps,
        rehypeAutolinkHeadings,
        rehypeMdxImportMedia,
      ];

      return options;
    },
    /*
     * Writes images to public directory
     * Reference: https://github.com/kentcdodds/mdx-bundler#image-bundling
     */
    esbuildOptions: (options) => {
      options.outdir = resolve(`./public/posts/${post.slug}/images`);
      options.publicPath = `/posts/${post.slug}/images`;
      options.loader = {
        ...options.loader,
        ".png": "file",
        ".jpeg": "file",
        ".jpg": "file",
      };
      options.write = true;

      return options;
    },
  });

  const baseUrl = {
    production: PRODUCTION_SITE_URL,
    development: DEVELOP_SITE_URL,
    test: DEVELOP_SITE_URL, // 使わないけど
  }[process.env.NODE_ENV];

  return {
    props: {
      post: {
        ...post,
        content,
        rawContent,
        ogImage: {
          url: `${baseUrl}/ogp/${post.title}`,
        },
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
