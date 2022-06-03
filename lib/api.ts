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

/**
 * 非公開のものは含まない
 * Private posts are excluded
 */
export function getAllPosts(fields: string[] = ['public']) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, [...fields, "public"]))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

  // @ts-ignore postはRecordであるため仕方ない
  const publicPosts = posts.filter((post => post["public"] != false))
  return publicPosts
}

const allWorks: Work[] = [
  // ----- テンプレ
  // {
  //   slug: "",
  //   title: "",
  //   introduction: "",
  //   description: "",
  //   used: [],
  //   images: [],
  // },
  {
    slug: "3dmodel-mechakun",
    title: "Blender製3Dモデル",
    subtitle: "\"Mecha-kun\"",
    introduction: "スタイリッシュな人型ロボットを作りたくて、Blenderの勉強ついでに作りました。",
    description: "性癖つめつめなスタイリッシュ人型ロボットを作りたくて、Blenderの勉強ついでに作りました。制作時間は20時間ぐらい？\nVRCのアバターとして改造して使ったり、配信で自分のアバターとして使ったりしてます。\n正直性癖をまだまだ突き詰められていないので、ロボ・サイボーグなどが好きな方は声かけてもらえるとありがたいです！Twitterでもいいのでお願いします。",
    used: ["Blender", "Unity", "VRChat"],
    thumbnail: "/assets/works/images/3dmodel-mechakun/21.png",
    images: [
      { source: "/assets/works/images/3dmodel-mechakun/1.png", alt: "ラフの段階ではそもそも足のスパイラルを作りたかっただけだった" },
      { source: "/assets/works/images/3dmodel-mechakun/2.png" },
      { source: "/assets/works/images/3dmodel-mechakun/3.png", alt: "最初は首と顔が一緒の形状でした" },
      { source: "/assets/works/images/3dmodel-mechakun/4.png" },
      { source: "/assets/works/images/3dmodel-mechakun/5.png", alt: "あまり意味のないタンク形状のなにかも付いてる" },
      { source: "/assets/works/images/3dmodel-mechakun/6.png" },
      { source: "/assets/works/images/3dmodel-mechakun/7.png" },
      { source: "/assets/works/images/3dmodel-mechakun/8.png" },
      { source: "/assets/works/images/3dmodel-mechakun/9.png" },
      { source: "/assets/works/images/3dmodel-mechakun/10.png" },
      { source: "/assets/works/images/3dmodel-mechakun/11.png" },
      { source: "/assets/works/images/3dmodel-mechakun/12.png", alt: "ウェイトペイントが楽でいい" },
      { source: "/assets/works/images/3dmodel-mechakun/13.png" },
      { source: "/assets/works/images/3dmodel-mechakun/14.png" },
      { source: "/assets/works/images/3dmodel-mechakun/16.png", alt: "足がバグって3日ぐらいUnityとマジで格闘しました" },
      { source: "/assets/works/images/3dmodel-mechakun/15.png", alt: "直ったときは本当になんか言葉にできない達成感を感じた..." },
      { source: "/assets/works/images/3dmodel-mechakun/17.png" },
      { source: "/assets/works/images/3dmodel-mechakun/18.png", alt: "色ついてないけどとりあえず完成" },
      { source: "/assets/works/images/3dmodel-mechakun/19.png" },
      { source: "/assets/works/images/3dmodel-mechakun/20.png" },
      { source: "/assets/works/images/3dmodel-mechakun/21.png", alt: "目の部分はしゃべると点滅します" },
      { source: "/assets/works/images/3dmodel-mechakun/22.png", alt: "Animazeのすがた" },
      { source: "/assets/works/images/3dmodel-mechakun/23.png", alt: "Twitterのアイコンに使ってました" },
      { source: "/assets/works/images/3dmodel-mechakun/24.png", alt: "同様に、色味だけ変更" },
    ],
  },
  {
    slug: "nextjs-blog-relog",
    title: "Next.js + TypeScriptで作ったマークダウンなブログ",
    introduction: "なんでも好き勝手できるブログ作りてーと思ってたらできてました。",
    description: "なんでも好き勝手できるブログ作りてーと思ってたらできてました。\n自分の今までやってきたものをたまに載せたり、ZennやQiitaに載せられないタイプの技術系、ないしはゲームなどの記事をちょいちょい書いて投稿しています。",
    githubLink: "https://github.com/rikusen0335/ReLog",
    used: ["Next.js", "TypeScript", "xdm", "mdx-bundler", "Vercel"],
    thumbnail: "/assets/works/images/nextjs-blog-relog/1.png",
    images: [
      { source: "/assets/works/images/nextjs-blog-relog/1.png", },
    ],
  },
  {
    slug: "nodecg-bundle-luckgamerta",
    title: "LuckGameRTA用のNodeCGバンドル",
    introduction: "LuckGameRTAという運ゲーRTAのイベントのためのバンドルを作成しました。",
    description: "LuckGameRTAという運ゲーRTAのイベントのために、NodeCGといわれるRTAでよく使われているフレームワーク用のバンドルを作成しました。\n今回はブランディングに応じたカスタムスタイルを書く必要がなかったので、Chakra UIを使用して簡易的にUXを提供しています。",
    githubLink: "https://github.com/rikusen0335/luckgamerta-bundle",
    used: ["React", "NodeCG", "nodecg-bundler", "Vite", "Chakra UI"],
    thumbnail: "/assets/works/images/nodecg-bundle-luckgamerta/1.jpg",
    images: [
      { source: "/assets/works/images/nodecg-bundle-luckgamerta/1.jpg", alt: "実際のTwitchでの放送時の画面" },
      { source: "/assets/works/images/nodecg-bundle-luckgamerta/2.jpg" },
      { source: "/assets/works/images/nodecg-bundle-luckgamerta/3.png" },
      { source: "/assets/works/images/nodecg-bundle-luckgamerta/gif_1.gif", alt: "Replicantを使用して、リアルタイムにグラフィック側を変更" },
      { source: "/assets/works/images/nodecg-bundle-luckgamerta/gif_2.gif", alt: "日付ごとの走者情報の変更" },
    ],
  },
]

export function getWorkBySlug(targetSlug: string): Work | undefined {
  const realSlug = targetSlug.replace(/\.mdx$/, '')

  return allWorks.find(({ slug }) => slug === realSlug)
}

export function getAllWorks(): Work[] {
  return allWorks
}
