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
import { CMS_NAME, SITE_NAME } from '../../lib/constants'
import PostType from '../../types/post'
import { bundleMDX } from 'mdx-bundler'
import { resolve } from 'path'
import remarkBreaks from 'remark-breaks';
import remarkHint from 'remark-hint';
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@leafac/rehype-shiki";
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta';
import { remarkMdxImages } from "remark-mdx-images";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getJSDocTags } from 'typescript'


type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

const Post = ({ post, morePosts, preview }: Props) => {
  const router = useRouter()
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
                <meta property="og:image" content={post.ogImage.url} />
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
  )

  // const a = await bundleMDX(`![Game Screenshot](./image_1.jpg 'The Cycle')`)

  // console.log(a)

  return {
    props: {
      post: {
        ...post,
        content,
        rawContent,
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
