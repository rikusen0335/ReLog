import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { SITE_NAME, DEVELOP_SITE_URL, PRODUCTION_SITE_URL } from '../../lib/constants'
import PostType from '../../types/post'
import { bundleMDX } from 'mdx-bundler'
import { resolve } from 'path'
import remarkBreaks from 'remark-breaks';
const remarkHint = require('remark-hint'); // TODO: あとでremark-directiveで置き換える
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
// import rehypeShiki from "@leafac/rehype-shiki";
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta';
import { remarkMdxImages } from "remark-mdx-images";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkDirectiveRehype from 'remark-directive-rehype'
import { NextPage } from 'next'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'


type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

const Post: NextPage<Props> = ({ post, morePosts, preview }) => {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
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
                <meta
                  property="og:title"
                  content={post.title}
                />
                <meta
                  property="twitter:title"
                  content={post.title}
                />
                <meta
                  property="twitter:text:title"
                  content={post.title}
                />
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
  )
}

export default Post


type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'tags',
    'ogImage',
    'coverImage',
  ])

  const rawContent = post.content || ''
  const content = await bundleMDX(
    post.content,
    {
      cwd: resolve(`./content/${post.slug}`),
      xdmOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkHint,
          remarkBreaks,
          remarkGfm,
          remarkMdxImages,
          remarkDirective,
          remarkDirectiveRehype,
          // remarkMdxCodeMeta,
        ]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          rehypeCodeTitles,
          rehypePrismPlus,
          rehypeAutolinkHeadings,
        ]

        return options
      },
      /*
       * Writes images to public directory
       * Reference: https://github.com/kentcdodds/mdx-bundler#image-bundling
       */
      esbuildOptions: (options) => {
        options.outdir = resolve(`./public/posts/${post.slug}/images`)
        options.loader = {
          ...options.loader,
          '.png': 'file',
          '.jpeg': 'file',
          '.jpg': 'file',
        },
        options.publicPath = `/posts/${post.slug}/images`
        options.write = true

        return options
      },
    }
  );

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
          url: `${baseUrl}/ogp/${post.title}`
        },
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
