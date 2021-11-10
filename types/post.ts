import Author from './author'

type PostType = {
  slug: string
  title: string
  date: string
  coverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  tags?: string[]
  content: object // TODO: とりあえず
  rawContent: string;
}

export default PostType
