import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import Work from '../types/work'

const postsDirectory = join(process.cwd(), 'content')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = join(postsDirectory, `${realSlug}/index.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents) // frontmatterから情報を取るやつ

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

const allWorks = [
  {
    slug: "3dmodel-mechakun",
    title: "3Dモデル",
    subtitle: "\"Mecha-kun\"",
    introduction: "スタイリッシュな人型ロボットを作りたくて、Blenderの勉強ついでに作りました。",
    description: "性癖つめつめなスタイリッシュ人型ロボットを作りたくて、Blenderの勉強ついでに作りました。制作時間は20時間ぐらい？\nVRCのアバターとして改造して使ったり、配信で自分のアバターとして使ったりしてます。",
    used: ["Blender", "Unity"],
    thumbnail: "https://picsum.photos/800/1000",
    images: ["https://picsum.photos/800/1000", "https://picsum.photos/800/1000", "https://picsum.photos/800/1000"],
  },
  {
    slug: "hoge",
    title: "hoge",
    introduction: "",
    description: "",
    used: [],
    images: [],
  },
  {
    slug: "foo",
    title: "foo",
    introduction: "",
    description: "",
    used: [],
    images: [],
  },
  {
    slug: "uwaowa",
    title: "uwaowa",
    introduction: "",
    description: "",
    used: [],
    images: [],
  },
]

export function getWorkBySlug(targetSlug: string): Work | undefined {
  const realSlug = targetSlug.replace(/\.mdx$/, '')

  return allWorks.find(({ slug }) => slug === realSlug)
}

export function getAllWorks(): Work[] {
  return allWorks
}
